// src/Screens/ExamsScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

import { styles } from "../styles/styles";
import { genId } from "../storage/ids";

import BackButton from "../components/BackButton.component";
import Input from "../components/Input.component";
import GradeRow from "../components/GradeRow.component";
import SmallIconButton from "../components/SmallIconButton.component";
import SectionTitle from "../components/SectionTitle.component";

// ⭐ Zustand Store
import { useSchoolStore } from "../storage/useSchoolStore";

export default function ExamsScreen() {
  // ---------- GLOBAL STATE ----------
  const classes = useSchoolStore((s) => s.classes);
  const exams = useSchoolStore((s) => s.exams);

  const addExam = useSchoolStore((s) => s.addExam);
  const updateExam = useSchoolStore((s) => s.updateExam);
  const deleteExam = useSchoolStore((s) => s.deleteExam);

  // ---------- LOCAL FORM ----------
  const [form, setForm] = useState({
    id: null,
    classId: "",
    name: "",
    maxMarks: "",
    subjectSchedules: [],
    gradeType: "percentage", // 👈 NEW: percentage | marks
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
      subjectSchedules: [],
      gradeType: "percentage", // reset default
      gradeScale: [
        { id: genId(), name: "A", min: "90", max: "100" },
        { id: genId(), name: "B", min: "80", max: "89" },
      ],
    });

  const selectedClass = classes.find((c) => c.id === form.classId);
  const subjects = selectedClass?.subjects?.map((s) => s.name) || [];

  // ---------- SUBJECT TOGGLE ----------
  const toggleSubject = (name) => {
    setForm((p) => {
      const exists = p.subjectSchedules.find((s) => s.subjectName === name);

      return exists
        ? {
            ...p,
            subjectSchedules: p.subjectSchedules.filter(
              (s) => s.subjectName !== name
            ),
          }
        : {
            ...p,
            subjectSchedules: [
              ...p.subjectSchedules,
              { subjectName: name, date: "" },
            ],
          };
    });
  };

  // ---------- SAVE ----------
  const saveExam = () => {
    if (!form.classId) return Alert.alert("Choose class");
    if (!form.name.trim()) return Alert.alert("Exam name required");
    if (!form.maxMarks.trim()) return Alert.alert("Max marks required");
    if (form.subjectSchedules.length === 0)
      return Alert.alert("Select at least one subject");

    const cleaned = {
      ...form,
      id: form.id || genId(),
      maxMarks: parseInt(form.maxMarks),
      gradeType: form.gradeType || "percentage", // ensure saved
    };

    if (form.id) {
      updateExam(cleaned);
    } else {
      addExam(cleaned);
    }

    reset();
  };

  // ---------- UI ----------
  return (
    <View style={styles.screenWrapper}>
      {/* HEADER */}
      <View style={styles.curvedHeader}>
        <View style={styles.headerRow}>
          <BackButton />
          <Text style={styles.dateText}>{new Date().toDateString()}</Text>
        </View>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitleIcon}>📝</Text>
          <Text style={styles.headerTitleText}>Exams</Text>
        </View>
      </View>

      {/* BODY */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.whiteContainer}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* FORM */}
          <SectionTitle title="Schedule Exam" />

          {/* CLASS PICKER */}
          <SectionTitle title="Select Class" />

          <View style={styles.pickerContainer}>
            <ScrollView style={{ maxHeight: 200 }}>
              {classes.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() =>
                    setForm((p) => ({
                      ...p,
                      classId: c.id,
                      subjectSchedules: [],
                    }))
                  }
                  style={{
                    padding: 12,
                    backgroundColor: form.classId === c.id ? "#E7F7F5" : "#fff",
                  }}
                >
                  <Text>
                    {c.name}-{c.section} ({c.classTeacherName})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* INPUTS */}
          <Input
            label="Exam Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />

          <Input
            label="Max Marks"
            value={form.maxMarks}
            keyboardType="numeric"
            onChange={(v) => setForm({ ...form, maxMarks: v })}
          />

          {/* SUBJECTS */}
          <SectionTitle title="Subjects" />

          <View style={styles.subjectsBox}>
            {subjects.length === 0 ? (
              <Text style={styles.emptyTextRed}>No subjects in this class</Text>
            ) : (
              subjects.map((sub) => {
                const existing = form.subjectSchedules.find(
                  (s) => s.subjectName === sub
                );
                return (
                  <View key={sub} style={styles.scheduleRow}>
                    <TouchableOpacity
                      onPress={() => toggleSubject(sub)}
                      style={
                        existing
                          ? styles.checkboxChecked
                          : styles.checkboxUnchecked
                      }
                    >
                      {existing && <Text style={{ color: "#fff" }}>✓</Text>}
                    </TouchableOpacity>

                    <Text style={styles.scheduleText}>{sub}</Text>

                    {existing && (
                      <TextInput
                        style={[styles.textInput, { flex: 1 }]}
                        value={existing.date}
                        placeholder="YYYY-MM-DD"
                        onChangeText={(v) =>
                          setForm((p) => ({
                            ...p,
                            subjectSchedules: p.subjectSchedules.map((s) =>
                              s.subjectName === sub ? { ...s, date: v } : s
                            ),
                          }))
                        }
                      />
                    )}
                  </View>
                );
              })
            )}
          </View>

          {/* GRADE SCALE */}
          <SectionTitle title="Grade Scale" />

          {/* 🔥 Grade Type Toggle: Percentage / Marks */}
          <View
            style={{
              flexDirection: "row",
              marginBottom: 10,
              gap: 8,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                setForm((p) => ({ ...p, gradeType: "percentage" }))
              }
              style={{
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 999,
                borderWidth: 1,
                borderColor:
                  form.gradeType === "percentage" ? "#1C5A52" : "#D1D5DB",
                backgroundColor:
                  form.gradeType === "percentage" ? "#E7F7F5" : "#ffffff",
              }}
            >
              <Text
                style={{
                  fontWeight: "600",
                  color:
                    form.gradeType === "percentage" ? "#1C5A52" : "#4B5563",
                  fontSize: 13,
                }}
              >
                Percentage (%)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setForm((p) => ({ ...p, gradeType: "marks" }))}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: form.gradeType === "marks" ? "#1C5A52" : "#D1D5DB",
                backgroundColor:
                  form.gradeType === "marks" ? "#E7F7F5" : "#ffffff",
              }}
            >
              <Text
                style={{
                  fontWeight: "600",
                  color: form.gradeType === "marks" ? "#1C5A52" : "#4B5563",
                  fontSize: 13,
                }}
              >
                Marks
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gradesBox}>
            {form.gradeScale.map((g) => (
              <GradeRow
                key={g.id}
                grade={g}
                onChange={(field, value) =>
                  setForm((p) => ({
                    ...p,
                    gradeScale: p.gradeScale.map((x) =>
                      x.id === g.id ? { ...x, [field]: value } : x
                    ),
                  }))
                }
                onRemove={() =>
                  setForm((p) => ({
                    ...p,
                    gradeScale: p.gradeScale.filter((x) => x.id !== g.id),
                  }))
                }
              />
            ))}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                setForm((p) => ({
                  ...p,
                  gradeScale: [
                    ...p.gradeScale,
                    { id: genId(), name: "", min: "", max: "" },
                  ],
                }))
              }
            >
              <Text style={styles.addButtonText}>+ Add Grade</Text>
            </TouchableOpacity>
          </View>

          {/* SAVE BUTTON */}
          <TouchableOpacity style={styles.primaryButton} onPress={saveExam}>
            <Text style={styles.buttonText}>
              {form.id ? "Update Exam" : "Save Exam"}
            </Text>
          </TouchableOpacity>

          {/* EXISTING EXAMS */}
          <SectionTitle title={`Scheduled Exams (${exams.length})`} />

          {exams.map((item) => {
            const c = classes.find((x) => x.id === item.classId);

            return (
              <View key={item.id} style={styles.listRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{item.name}</Text>

                  <Text style={styles.itemMeta}>
                    Class: {c ? `${c.name}-${c.section}` : "Unknown"}
                  </Text>

                  <Text style={styles.itemMeta}>
                    Grade Type:{" "}
                    {item.gradeType === "marks" ? "Marks" : "Percentage"}
                  </Text>

                  <Text style={styles.itemSubjects}>
                    {item.subjectSchedules.map((s) => s.subjectName).join(", ")}
                  </Text>
                </View>

                <View style={styles.rowActions}>
                  <SmallIconButton
                    icon="edit"
                    onPress={() =>
                      setForm({
                        ...item,
                        classId: item.classId,
                        name: item.name,
                        maxMarks: String(item.maxMarks),
                        gradeType: item.gradeType || "percentage",
                        subjectSchedules: item.subjectSchedules || [],
                        gradeScale: (item.gradeScale || []).map((g) => ({
                          id: genId(),
                          name: g.name,
                          min: String(g.min),
                          max: String(g.max),
                        })),
                      })
                    }
                  />

                  <SmallIconButton
                    icon="trash-2"
                    color="#dc2626"
                    onPress={() => deleteExam(item.id)}
                  />
                </View>
              </View>
            );
          })}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
