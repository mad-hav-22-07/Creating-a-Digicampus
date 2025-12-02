// App.js
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

/* -----------------------------
  Simple local-storage backed app
  - Classes and Exams persisted via AsyncStorage
  - Single-file for easy drop-in
------------------------------*/

// Storage keys
const KEY_CLASSES = "@myapp_classes_v1";
const KEY_EXAMS = "@myapp_exams_v1";

// Helpers
const genId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const loadJSON = async (key, fallback = []) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load", key, e);
    return fallback;
  }
};

const saveJSON = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("Failed to save", key, e);
  }
};

/* ------------ Small reusable components ------------- */

const Label = ({ children, required }) => (
  <Text style={styles.label}>
    {children} {required ? <Text style={{ color: "red" }}>*</Text> : null}
  </Text>
);

const Input = ({ label, value, onChange, keyboardType, placeholder }) => (
  <View style={styles.inputGroup}>
    <Label required>{label}</Label>
    <TextInput
      value={value}
      onChangeText={onChange}
      keyboardType={keyboardType}
      placeholder={placeholder}
      style={styles.textInput}
    />
  </View>
);

const SmallIconButton = ({ onPress, icon, color = "#111", label }) => (
  <TouchableOpacity style={styles.iconButton} onPress={onPress}>
    <Feather name={icon} size={18} color={color} />
    {label ? <Text style={styles.smallIconText}>{label}</Text> : null}
  </TouchableOpacity>
);

/* ---------------- Classes screen (create/edit/list) ---------------- */

function ClassesScreen({
  classes,
  setClasses,
  onSelectClassToEdit, // callback with the class object for editing
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    id: null,
    name: "",
    section: "",
    totalStudents: "",
    classTeacherName: "",
    subjects: [{ id: genId(), name: "Mathematics" }],
  });

  useEffect(() => {
    // when editing is initiated, parent will call onSelectClassToEdit -> we'll handle externally
  }, []);

  const resetForm = () =>
    setForm({
      id: null,
      name: "",
      section: "",
      totalStudents: "",
      classTeacherName: "",
      subjects: [{ id: genId(), name: "Mathematics" }],
    });
  const BackButton = ({ onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
    >
      <Feather name="arrow-left" size={22} color="#111" />
      <Text style={{ fontSize: 16, fontWeight: "600", marginLeft: 6 }}>
        Back
      </Text>
    </TouchableOpacity>
  );

  const addSubject = () =>
    setForm((p) => ({
      ...p,
      subjects: [...p.subjects, { id: genId(), name: "" }],
    }));

  const updateSubjectName = (id, name) =>
    setForm((p) => ({
      ...p,
      subjects: p.subjects.map((s) => (s.id === id ? { ...s, name } : s)),
    }));

  const removeSubject = (id) =>
    setForm((p) => ({
      ...p,
      subjects:
        p.subjects.length > 1
          ? p.subjects.filter((s) => s.id !== id)
          : p.subjects,
    }));

  const validateClass = () => {
    if (!form.name.trim()) {
      Alert.alert("Validation", "Class name is required");
      return false;
    }
    if (!form.section.trim()) {
      Alert.alert("Validation", "Section is required");
      return false;
    }
    if (!form.classTeacherName.trim()) {
      Alert.alert("Validation", "Class teacher name is required");
      return false;
    }
    if (!form.totalStudents || isNaN(parseInt(form.totalStudents, 10))) {
      Alert.alert("Validation", "Total number of students must be a number");
      return false;
    }
    if (form.subjects.some((s) => !s.name.trim())) {
      Alert.alert("Validation", "All subjects must have a name");
      return false;
    }
    return true;
  };

  const createOrUpdateClass = () => {
    if (!validateClass()) return;
    const cleaned = {
      id: form.id || genId(),
      name: form.name.trim(),
      section: form.section.trim(),
      totalStudents: parseInt(form.totalStudents || "0", 10),
      classTeacherName: form.classTeacherName.trim(),
      subjects: form.subjects.map((s) => ({ name: s.name.trim() })),
      createdAt: form.id ? undefined : Date.now(),
    };

    setClasses((prev) => {
      // if cleaned.id is missing, generate a new one
      const classId = cleaned.id || genId();
      const updated = { ...cleaned, id: classId };

      // Check if class already exists safely
      const existsIndex = prev.findIndex((c) => c.id === updated.id);

      let next;
      if (existsIndex !== -1) {
        // update existing
        next = [...prev];
        next[existsIndex] = { ...prev[existsIndex], ...updated };
      } else {
        // create new
        next = [updated, ...prev];
      }

      saveJSON(KEY_CLASSES, next);
      return next;
    });

    resetForm();
    Alert.alert("Success", form.id ? "Class updated" : "Class added");
  };

  const startEdit = (c) => {
    setForm({
      id: c.id,
      name: c.name,
      section: c.section,
      totalStudents: String(c.totalStudents || ""),
      classTeacherName: c.classTeacherName,
      subjects: (c.subjects || []).map((s) => ({ id: genId(), name: s.name })),
    });
  };

  const deleteClass = (id, name) => {
    Alert.alert("Confirm", `Delete class ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setClasses((prev) => {
            const next = prev.filter((p) => p.id !== id);
            saveJSON(KEY_CLASSES, next);
            return next;
          });
        },
      },
    ]);
  };

  const renderClass = ({ item }) => (
    <View style={styles.listRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>
          {item.name} - {item.section}
        </Text>
        <Text style={styles.itemMeta}>
          Teacher: {item.classTeacherName} | Students: {item.totalStudents}
        </Text>
        <Text style={styles.itemSubjects}>
          Subjects: {(item.subjects || []).map((s) => s.name).join(", ")}
        </Text>
      </View>
      <View style={styles.rowActions}>
        <SmallIconButton
          onPress={() => startEdit(item)}
          icon="edit"
          color="#2563eb"
        />
        <SmallIconButton
          onPress={() => deleteClass(item.id, item.name)}
          icon="trash-2"
          color="#dc2626"
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <BackButton onPress={() => router.back()} />

      <FlatList
        ListHeaderComponent={
          <View style={{ padding: 12 }}>
            <Text style={styles.sectionTitle}>Define / Edit Class</Text>

            <Input
              label="Class Name"
              value={form.name}
              onChange={(v) => setForm((p) => ({ ...p, name: v }))}
              placeholder="e.g., 8"
            />
            <Input
              label="Section"
              value={form.section}
              onChange={(v) => setForm((p) => ({ ...p, section: v }))}
              placeholder="e.g., A"
            />
            <Input
              label="Total Number of Students"
              value={form.totalStudents}
              onChange={(v) =>
                setForm((p) => ({
                  ...p,
                  totalStudents: v.replace(/[^0-9]/g, ""),
                }))
              }
              keyboardType="numeric"
            />
            <Input
              label="Class Teacher Name"
              value={form.classTeacherName}
              onChange={(v) => setForm((p) => ({ ...p, classTeacherName: v }))}
            />

            <Text style={[styles.subHeader, { marginTop: 12 }]}>Subjects</Text>
            {(form.subjects || []).map((s, idx) => (
              <View key={s.id} style={styles.subjectRow}>
                <TextInput
                  value={s.name}
                  onChangeText={(txt) => updateSubjectName(s.id, txt)}
                  placeholder={`Subject ${idx + 1}`}
                  style={styles.subjectInput}
                />
                <TouchableOpacity
                  onPress={() => removeSubject(s.id)}
                  style={styles.smallCircle}
                >
                  <Feather name="trash-2" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              onPress={addSubject}
              style={[styles.addButton, { alignSelf: "flex-start" }]}
            >
              <Feather name="plus-circle" size={16} color="#10b981" />
              <Text style={[styles.addButtonText, { color: "#10b981" }]}>
                Add Subject
              </Text>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
              <TouchableOpacity
                onPress={createOrUpdateClass}
                style={[styles.primaryButton, { flex: 1 }]}
              >
                <Text style={styles.buttonText}>
                  {form.id ? "Update Class" : "Save Class"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={resetForm}
                style={[
                  styles.cancelButton,
                  {
                    marginLeft: 8,
                    alignSelf: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Text style={styles.cancelButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 18 }]}>
              Defined Classes ({classes.length})
            </Text>
          </View>
        }
        data={classes}
        keyExtractor={(item) => item.id}
        renderItem={renderClass}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </KeyboardAvoidingView>
  );
}

/* ---------------- Exams screen (create/edit/list) ---------------- */

function ExamsScreen({ classes, exams, setExams }) {
  const [form, setForm] = useState({
    id: null,
    classId: "",
    name: "",
    maxMarks: "",
    gradingBasis: "Percentage", // or "Marks"
    subjectSchedules: [], // array { subjectName, date }
    gradeScale: [
      { id: genId(), name: "A", min: "90", max: "100" },
      { id: genId(), name: "B", min: "80", max: "89" },
    ],
  });

  const reset = () =>
    setForm({
      id: null,
      classId: "",
      name: "",
      maxMarks: "",
      gradingBasis: "Percentage",
      subjectSchedules: [],
      gradeScale: [
        { id: genId(), name: "A", min: "90", max: "100" },
        { id: genId(), name: "B", min: "80", max: "89" },
      ],
    });

  const availableSubjects = (
    classes.find((c) => c.id === form.classId)?.subjects || []
  ).map((s) => s.name);

  const toggleSubject = (subjectName) => {
    setForm((p) => {
      const exists = p.subjectSchedules.some(
        (s) => s.subjectName === subjectName
      );
      if (exists) {
        return {
          ...p,
          subjectSchedules: p.subjectSchedules.filter(
            (s) => s.subjectName !== subjectName
          ),
        };
      }
      return {
        ...p,
        subjectSchedules: [...p.subjectSchedules, { subjectName, date: "" }],
      };
    });
  };

  const setSubjectDate = (subjectName, date) =>
    setForm((p) => ({
      ...p,
      subjectSchedules: p.subjectSchedules.map((s) =>
        s.subjectName === subjectName ? { ...s, date } : s
      ),
    }));

  const addGrade = () =>
    setForm((p) => ({
      ...p,
      gradeScale: [
        ...p.gradeScale,
        { id: genId(), name: "", min: "", max: "" },
      ],
    }));
  const updateGrade = (id, field, value) =>
    setForm((p) => ({
      ...p,
      gradeScale: p.gradeScale.map((g) =>
        g.id === id ? { ...g, [field]: value } : g
      ),
    }));

  const removeGrade = (id) =>
    setForm((p) => ({
      ...p,
      gradeScale: p.gradeScale.filter((g) => g.id !== id),
    }));

  const validate = () => {
    if (!form.classId) {
      Alert.alert("Validation", "Select a class");
      return false;
    }
    if (!form.name.trim()) {
      Alert.alert("Validation", "Exam name required");
      return false;
    }
    if (!form.maxMarks || isNaN(parseInt(form.maxMarks, 10))) {
      Alert.alert("Validation", "Max marks required (number)");
      return false;
    }
    if (form.subjectSchedules.length === 0) {
      Alert.alert("Validation", "Select at least one subject");
      return false;
    }
    if (
      form.subjectSchedules.some((s) => !/^\d{4}-\d{2}-\d{2}$/.test(s.date))
    ) {
      Alert.alert(
        "Validation",
        "Use YYYY-MM-DD date format for scheduled subjects"
      );
      return false;
    }
    if (form.gradeScale.some((g) => !g.name.trim() || !g.min || !g.max)) {
      Alert.alert("Validation", "All grades must have name, min and max");
      return false;
    }
    return true;
  };

  const createOrUpdate = () => {
    if (!validate()) return;

    const cleaned = {
      id: form.id || genId(),
      classId: form.classId,
      name: form.name.trim(),
      maxMarks: parseInt(form.maxMarks || "0", 10),
      gradingBasis: form.gradingBasis,
      subjectSchedules: form.subjectSchedules.map((s) => ({ ...s })),
      gradeScale: form.gradeScale.map((g) => ({
        name: g.name.trim().toUpperCase(),
        min: parseInt(g.min || "0", 10),
        max: parseInt(g.max || "0", 10),
      })),
    };

    setExams((prev) => {
      const exists = prev.find((e) => e.id === cleaned.id);
      let next;
      if (exists) next = prev.map((e) => (e.id === cleaned.id ? cleaned : e));
      else next = [cleaned, ...prev];
      saveJSON(KEY_EXAMS, next);
      return next;
    });

    reset();
    Alert.alert("Success", "Exam saved");
  };

  const startEdit = (exam) =>
    setForm({
      id: exam.id,
      classId: exam.classId,
      name: exam.name,
      maxMarks: String(exam.maxMarks),
      gradingBasis: exam.gradingBasis || "Percentage",
      subjectSchedules: exam.subjectSchedules || [],
      gradeScale: (exam.gradeScale || []).map((g) => ({
        id: genId(),
        name: g.name,
        min: String(g.min),
        max: String(g.max),
      })),
    });

  const delExam = (id, name) =>
    Alert.alert("Confirm", `Delete exam ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          setExams((prev) => {
            const next = prev.filter((p) => p.id !== id);
            saveJSON(KEY_EXAMS, next);
            return next;
          }),
      },
    ]);

  const renderExam = ({ item }) => {
    const parent = classes.find((c) => c.id === item.classId);
    const subjectNames = (item.subjectSchedules || [])
      .map((s) => s.subjectName)
      .join(", ");
    const sorted = (item.subjectSchedules || [])
      .slice()
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    return (
      <View style={styles.listRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemMeta}>
            Class: {parent ? `${parent.name} ${parent.section}` : "Unknown"}
          </Text>
          <Text style={styles.itemSubjects}>Subjects: {subjectNames}</Text>
          <Text style={styles.itemMeta}>
            Max Marks: {item.maxMarks} | Basis: {item.gradingBasis}
          </Text>

          <View style={{ marginTop: 6 }}>
            <Text style={styles.smallBold}>Schedule:</Text>
            {sorted.map((s, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>{s.subjectName}</Text>
                <Text>{s.date}</Text>
              </View>
            ))}
          </View>

          <View style={{ marginTop: 6 }}>
            <Text style={styles.smallBold}>Grade Scale:</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {(item.gradeScale || []).map((g, i) => (
                <View key={i} style={styles.gradeTag}>
                  <Text style={styles.gradeTagText}>
                    {g.name}: {g.min}-{g.max}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.rowActions}>
          <SmallIconButton
            onPress={() => startEdit(item)}
            icon="edit"
            color="#059669"
          />
          <SmallIconButton
            onPress={() => delExam(item.id, item.name)}
            icon="trash-2"
            color="#ef4444"
          />
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={{ padding: 12 }}
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      <Text style={styles.sectionTitle}>Schedule / Edit Exam</Text>

      <Label required>Select Class</Label>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.classId}
          onValueChange={(v) =>
            setForm((p) => ({ ...p, classId: v, subjectSchedules: [] }))
          }
        >
          <Picker.Item label="-- Select Class --" value="" />
          {classes.map((c) => (
            <Picker.Item
              key={c.id}
              label={`${c.name} - ${c.section} (${c.classTeacherName})`}
              value={c.id}
            />
          ))}
        </Picker>
      </View>

      <Input
        label="Exam Name"
        value={form.name}
        onChange={(v) => setForm((p) => ({ ...p, name: v }))}
      />
      <Input
        label="Max Marks"
        value={form.maxMarks}
        keyboardType="numeric"
        onChange={(v) =>
          setForm((p) => ({ ...p, maxMarks: v.replace(/[^0-9]/g, "") }))
        }
      />

      <Label>Subjects (choose and add dates)</Label>
      <View style={[styles.subjectsBox, !form.classId && { opacity: 0.5 }]}>
        {availableSubjects.length === 0 ? (
          <Text style={styles.emptyTextRed}>
            {form.classId
              ? "No subjects defined."
              : "Select a class to load subjects."}
          </Text>
        ) : (
          availableSubjects.map((sub) => {
            const scheduled = form.subjectSchedules.some(
              (s) => s.subjectName === sub
            );
            const date =
              form.subjectSchedules.find((s) => s.subjectName === sub)?.date ||
              "";
            return (
              <View key={sub} style={styles.scheduleRow}>
                <TouchableOpacity
                  onPress={() => toggleSubject(sub)}
                  style={
                    scheduled
                      ? styles.checkboxChecked
                      : styles.checkboxUnchecked
                  }
                >
                  {scheduled && <Feather name="check" size={14} color="#fff" />}
                </TouchableOpacity>
                <Text style={styles.scheduleText}>{sub}</Text>
                <View style={{ width: "50%" }}>
                  {scheduled && (
                    <TextInput
                      value={date}
                      placeholder="YYYY-MM-DD"
                      onChangeText={(txt) => setSubjectDate(sub, txt)}
                      style={styles.textInput}
                    />
                  )}
                </View>
              </View>
            );
          })
        )}
      </View>

      <Label>Grade Scale</Label>
      <View style={styles.gradesBox}>
        {form.gradeScale.map((g) => (
          <View key={g.id} style={styles.gradeRow}>
            <TextInput
              value={g.name}
              placeholder="A"
              onChangeText={(v) => updateGrade(g.id, "name", v)}
              style={styles.gradeInput}
            />
            <TextInput
              value={g.min}
              placeholder="Min"
              keyboardType="numeric"
              onChangeText={(v) =>
                updateGrade(g.id, "min", v.replace(/[^0-9]/g, ""))
              }
              style={styles.gradeInput}
            />
            <TextInput
              value={g.max}
              placeholder="Max"
              keyboardType="numeric"
              onChangeText={(v) =>
                updateGrade(g.id, "max", v.replace(/[^0-9]/g, ""))
              }
              style={styles.gradeInput}
            />
            <TouchableOpacity
              onPress={() => removeGrade(g.id)}
              style={styles.smallCircle}
            >
              <Feather name="minus-circle" size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          onPress={addGrade}
          style={[styles.addButton, { alignSelf: "flex-start" }]}
        >
          <Feather name="plus-circle" size={16} color="#059669" />
          <Text style={[styles.addButtonText, { color: "#059669" }]}>
            Add Grade
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <TouchableOpacity
          onPress={createOrUpdate}
          style={[styles.primaryButton, { flex: 1 }]}
        >
          <Text style={styles.buttonText}>
            {form.id ? "Update Exam" : "Schedule Exam"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={reset}
          style={[styles.cancelButton, { justifyContent: "center" }]}
        >
          <Text style={styles.cancelButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 18 }]}>
        Scheduled Exams ({exams.length})
      </Text>
      {exams.length === 0 ? (
        <Text style={styles.emptyText}>No exams scheduled.</Text>
      ) : (
        <FlatList
          data={exams}
          renderItem={renderExam}
          keyExtractor={(i) => i.id}
        />
      )}
    </ScrollView>
  );
}

/* ---------------- Simple app navigator & root ---------------- */

export default function App() {
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);
  const [screen, setScreen] = useState("home"); // home | classes | exams

  const loadAll = useCallback(async () => {
    const a = await loadJSON(KEY_CLASSES, []);
    const b = await loadJSON(KEY_EXAMS, []);
    setClasses(a);
    setExams(b);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Simple top nav
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => setScreen("home")}
          style={[
            styles.topButton,
            screen === "home" && styles.topButtonActive,
          ]}
        >
          <Text style={styles.topButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setScreen("classes")}
          style={[
            styles.topButton,
            screen === "classes" && styles.topButtonActive,
          ]}
        >
          <Text style={styles.topButtonText}>Classes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setScreen("exams")}
          style={[
            styles.topButton,
            screen === "exams" && styles.topButtonActive,
          ]}
        >
          <Text style={styles.topButtonText}>Exams</Text>
        </TouchableOpacity>
      </View>

      {screen === "home" && (
        <ScrollView contentContainerStyle={{ padding: 12 }}>
          <Text style={styles.mainTitle}>Academic Management (Local)</Text>
          <Text style={styles.paragraph}>
            This app stores classes and exams locally on your device
            (AsyncStorage). Use the tabs above to manage Classes and Exams. All
            data persists between app restarts.
          </Text>

          <View style={{ marginTop: 12 }}>
            <Text style={styles.smallBold}>Stats</Text>
            <Text>Classes: {classes.length}</Text>
            <Text>Exams: {exams.length}</Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.smallBold}>Quick Actions</Text>
            <TouchableOpacity
              style={[styles.primaryButton, { marginTop: 8 }]}
              onPress={() => setScreen("classes")}
            >
              <Text style={styles.buttonText}>Manage Classes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryButton, { marginTop: 8 }]}
              onPress={() => setScreen("exams")}
            >
              <Text style={styles.buttonText}>Manage Exams</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {screen === "classes" && (
        <ClassesScreen classes={classes} setClasses={setClasses} />
      )}

      {screen === "exams" && (
        <ExamsScreen classes={classes} exams={exams} setExams={setExams} />
      )}
    </SafeAreaView>
  );
}

/* ---------------------- Styles ------------------------- */
const styles = StyleSheet.create({
  // ---------- TOP BAR ----------
  topBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 12,
    backgroundColor: "#1C5A52",
  },
  topButton: { flex: 1, alignItems: "center", paddingVertical: 10 },
  topButtonActive: { backgroundColor: "#174A44" },
  topButtonText: { fontWeight: "600", color: "#fff" },

  // ---------- PAGE TITLES ----------
  mainTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1C5A52",
    marginBottom: 4,
  },
  paragraph: { marginTop: 8, color: "#4b5563", fontSize: 14 },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1C1C1C",
  },

  // ---------- INPUTS ----------
  inputGroup: { marginBottom: 14 },
  label: { fontWeight: "700", marginBottom: 6, color: "#1C1C1C" },

  textInput: {
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#ffffff",
    fontSize: 15,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 14,
  },

  // ---------- BUTTONS ----------
  primaryButton: {
    backgroundColor: "#1C5A52",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#ECECEC",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  cancelButtonText: { color: "#374151", fontWeight: "700", fontSize: 16 },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 6,
  },
  addButtonText: { fontWeight: "700", color: "#1C5A52" },

  subHeader: {
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 8,
    fontSize: 16,
    color: "#1C1C1C",
  },

  // ---------- SUBJECT ROW ----------
  subjectRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  subjectInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
  },
  smallCircle: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: "#FCECEC",
  },

  // ---------- LIST ITEMS ----------
  listRow: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 14,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  itemTitle: { fontWeight: "800", fontSize: 17, color: "#1C1C1C" },
  itemMeta: { color: "#6b7280", fontSize: 13, marginTop: 2 },
  itemSubjects: {
    color: "#1C5A52",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "600",
  },

  rowActions: { justifyContent: "space-between", marginLeft: 10 },

  iconButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#E9F4F2",
    alignItems: "center",
  },

  emptyText: {
    color: "#6b7280",
    fontStyle: "italic",
    marginTop: 8,
  },

  emptyTextRed: { color: "#ef4444", fontWeight: "600" },

  subjectsBox: {
    borderWidth: 1,
    borderColor: "#DDE7E5",
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#F7FFFD",
    marginBottom: 12,
  },

  // ---------- CHECKBOX ----------
  checkboxUnchecked: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#1C5A52",
    borderRadius: 6,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: "#1C5A52",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  // ---------- GRADE SCALE ----------
  gradesBox: { marginBottom: 16 },
  gradeRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  gradeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    textAlign: "center",
    fontSize: 14,
  },

  smallBold: { fontWeight: "700", marginBottom: 6 },

  gradeTag: {
    backgroundColor: "#E7F7F5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 6,
    marginTop: 6,
  },
  gradeTagText: {
    fontWeight: "700",
    color: "#1C5A52",
    fontSize: 12,
  },

  // ---------- NEW BACK BUTTON ----------
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 10,
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C5A52",
  },
});
