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
  ImageBackground,
} from "react-native";

import Feather from "@expo/vector-icons/Feather";

import { styles } from "../styles/styles";
import { genId } from "../storage/ids";
import BackButton from "../components/BackButton.component";
import Input from "../components/Input.component";
import GradeRow from "../components/GradeRow.component";
import SmallIconButton from "../components/SmallIconButton.component";
import SectionTitle from "../components/SectionTitle.component";

// Zustand Store
import { useSchoolStore } from "../storage/useSchoolStore";

export default function ExamsScreen() {
  const classes = useSchoolStore((s) => s.classes);
  const exams = useSchoolStore((s) => s.exams);

  const addExam = useSchoolStore((s) => s.addExam);
  const updateExam = useSchoolStore((s) => s.updateExam);
  const deleteExam = useSchoolStore((s) => s.deleteExam);

  // ------ STATE ------
  const [showClassList, setShowClassList] = useState(false);

  const [form, setForm] = useState({
    id: null,
    classId: "",
    name: "",
    maxMarks: "",
    subjectSchedules: [],
    gradeType: "percentage",
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
      gradeType: "percentage",
      gradeScale: [
        { id: genId(), name: "A", min: "90", max: "100" },
        { id: genId(), name: "B", min: "80", max: "89" },
      ],
    });

  const selectedClass = classes.find((c) => c.id === form.classId);
  const subjects = selectedClass?.subjects?.map((s) => s.name) || [];

  // Toggle subject selection
  const toggleSubject = (name) => {
    setForm((prev) => {
      const exists = prev.subjectSchedules.find((s) => s.subjectName === name);

      return exists
        ? {
            ...prev,
            subjectSchedules: prev.subjectSchedules.filter(
              (s) => s.subjectName !== name
            ),
          }
        : {
            ...prev,
            subjectSchedules: [
              ...prev.subjectSchedules,
              { subjectName: name, date: "" },
            ],
          };
    });
  };

  // Save Exam
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
      gradeType: form.gradeType,
    };

    if (form.id) updateExam(cleaned);
    else addExam(cleaned);

    reset();
  };

  return (
    <View style={styles.screenWrapper}>
      {/* HEADER WITH BACKGROUND IMAGE */}
      <ImageBackground
        source={require("../../assets/header/bg.png")}
        style={styles.headerBackground}
        imageStyle={styles.headerImageStyle}
      >
        <BackButton />

        <View style={styles.dateRightBox}>
          <Text style={styles.dateText}>{new Date().toDateString()}</Text>
        </View>

        <View style={styles.headerTitleBox}>
          <Feather name="file-text" size={42} color="#fff" />
          <Text style={styles.headerTitleText}>Exams</Text>
        </View>
      </ImageBackground>

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
          <SectionTitle title="Schedule Exam" />

          {/* ------------ CLASS DROPDOWN ------------ */}
          <SectionTitle title="Select Class" />

          <View style={styles.pickerContainer}>
            {/* Dropdown Header */}
            <TouchableOpacity
              onPress={() => setShowClassList((p) => !p)}
              style={{
                padding: 12,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontFamily: "Poppins_500Medium" }}>
                {form.classId
                  ? `${selectedClass?.name}-${selectedClass?.section}`
                  : "Select Class"}
              </Text>

              <Feather
                name={showClassList ? "chevron-up" : "chevron-down"}
                size={20}
              />
            </TouchableOpacity>

            {/* Expanded List */}
            {showClassList && (
              <ScrollView style={{ maxHeight: 220 }}>
                {[...classes]
                  .sort((a, b) => {
                    const numA = parseInt(a.name);
                    const numB = parseInt(b.name);
                    if (numA !== numB) return numA - numB;
                    return a.section.localeCompare(b.section);
                  })
                  .map((c) => (
                    <TouchableOpacity
                      key={c.id}
                      onPress={() => {
                        setForm((p) => ({
                          ...p,
                          classId: c.id,
                          subjectSchedules: [],
                        }));
                        setShowClassList(false);
                      }}
                      style={{
                        padding: 12,
                        backgroundColor:
                          form.classId === c.id ? "#E7F7F5" : "#fff",
                        borderBottomWidth: 1,
                        borderBottomColor: "#e5e7eb",
                      }}
                    >
                      <Text style={{ fontFamily: "Poppins_400Regular" }}>
                        {c.name}-{c.section} ({c.classTeacherName})
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            )}
          </View>

          {/* Exam Name */}
          <Input
            label="Exam Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />

          {/* Max Marks */}
          <Input
            label="Max Marks"
            value={form.maxMarks}
            keyboardType="numeric"
            onChange={(v) => setForm({ ...form, maxMarks: v })}
          />

          {/* ------------ SUBJECT SELECTION ------------ */}
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
                      {existing && (
                        <Feather name="check" color="#fff" size={14} />
                      )}
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

          {/* ----------- GRADE SCALE ----------- */}
          <SectionTitle title="Grade Scale" />

          {/* Grade Type Toggle */}
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
            {/* PERCENTAGE */}
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
                  form.gradeType === "percentage" ? "#E7F7F5" : "#fff",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  color:
                    form.gradeType === "percentage" ? "#1C5A52" : "#4B5563",
                  fontSize: 13,
                }}
              >
                Percentage (%)
              </Text>
            </TouchableOpacity>

            {/* MARKS */}
            <TouchableOpacity
              onPress={() => setForm((p) => ({ ...p, gradeType: "marks" }))}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: form.gradeType === "marks" ? "#1C5A52" : "#D1D5DB",
                backgroundColor:
                  form.gradeType === "marks" ? "#E7F7F5" : "#fff",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  color: form.gradeType === "marks" ? "#1C5A52" : "#4B5563",
                  fontSize: 13,
                }}
              >
                Marks
              </Text>
            </TouchableOpacity>
          </View>

          {/* Grade rows */}
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

            {/* Add Grade */}
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
              <Feather name="plus-circle" size={18} color="#1C5A52" />
              <Text style={styles.addButtonText}>Add Grade</Text>
            </TouchableOpacity>
          </View>

          {/* Save */}
          <TouchableOpacity style={styles.primaryButton} onPress={saveExam}>
            <Text style={styles.buttonText}>
              {form.id ? "Update Exam" : "Save Exam"}
            </Text>
          </TouchableOpacity>

          {/* List of Exams */}
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
