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

  const initialForm = {
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
  };

  const [form, setForm] = useState(initialForm);

  const reset = () => setForm(initialForm);

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

  // --------------------------------------------------
  // ⭐ GRADE SCALE VALIDATION
  // --------------------------------------------------
  const validateGradeScale = () => {
    if (form.gradeScale.length === 0) {
      Alert.alert("Invalid Grade Scale", "At least one grade must be defined.");
      return false;
    }

    const ranges = form.gradeScale
      .map((g) => ({
        name: g.name.trim(),
        min: Number(g.min),
        max: Number(g.max),
      }))
      .sort((a, b) => b.max - a.max);

    for (let i = 0; i < ranges.length; i++) {
      const g = ranges[i];

      if (!g.name) {
        Alert.alert("Invalid Grade", "Grade name cannot be empty.");
        return false;
      }

      if (g.min > g.max) {
        Alert.alert(
          "Invalid Range",
          `Min cannot be greater than max for grade ${g.name}.`
        );
        return false;
      }

      if (form.gradeType === "percentage") {
        if (g.min < 0 || g.max > 100) {
          Alert.alert(
            "Invalid Range",
            `Percentage range for ${g.name} must be between 0 and 100.`
          );
          return false;
        }
      } else {
        const maxMarksNum = Number(form.maxMarks);
        if (g.min < 0 || g.max > maxMarksNum) {
          Alert.alert(
            "Invalid Range",
            `Marks for ${g.name} must be between 0 and ${maxMarksNum}.`
          );
          return false;
        }
      }

      if (i < ranges.length - 1) {
        const next = ranges[i + 1];

        if (g.min <= next.max) {
          Alert.alert(
            "Overlap Error",
            `Grade ${g.name} overlaps with grade ${next.name}.`
          );
          return false;
        }
      }
    }

    return true;
  };

  // --------------------------------------------------
  // ⭐ SAVE EXAM
  // --------------------------------------------------
  const saveExam = async () => {
    if (!form.classId) return Alert.alert("Choose class");
    if (!form.name.trim()) return Alert.alert("Exam name required");
    if (!form.maxMarks.trim()) return Alert.alert("Max marks required");
    if (form.subjectSchedules.length === 0)
      return Alert.alert("Select at least one subject");

    if (!validateGradeScale()) return;

    const cleaned = {
      id: form.id || genId(),
      classId: form.classId,
      name: form.name.trim(),
      maxMarks: Number(form.maxMarks),
      subjectSchedules: form.subjectSchedules,
      gradeType: form.gradeType,
      gradeScale: form.gradeScale.map((g) => ({
        name: g.name,
        min: Number(g.min),
        max: Number(g.max),
      })),
    };

    if (form.id) {
      await updateExam(cleaned);
      Alert.alert("Success", "Exam updated");
    } else {
      await addExam(cleaned);
      Alert.alert("Success", "Exam added");
    }

    reset();
  };

  return (
    <View style={styles.screenWrapper}>
      {/* HEADER */}
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

          {/* ---------------- Select Class ---------------- */}
          <SectionTitle title="Select Class" />
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              onPress={() => setShowClassList((p) => !p)}
              style={styles.dropdownHeader}
            >
              <Text style={styles.dropdownText}>
                {form.classId
                  ? `${selectedClass?.name}-${selectedClass?.section}`
                  : "Select Class"}
              </Text>

              <Feather
                name={showClassList ? "chevron-up" : "chevron-down"}
                size={20}
              />
            </TouchableOpacity>

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
                        borderBottomColor: "#EEE",
                      }}
                    >
                      <Text>
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

          {/* ---------------- SUBJECTS ---------------- */}
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

          {/* ---------------- GRADE SCALE ---------------- */}
          <SectionTitle title="Grade Scale" />

          {/* Type Toggle */}
          <View style={styles.gradeTypeToggle}>
            <TouchableOpacity
              onPress={() =>
                setForm((p) => ({ ...p, gradeType: "percentage" }))
              }
              style={
                form.gradeType === "percentage"
                  ? styles.toggleSelected
                  : styles.toggle
              }
            >
              <Text style={styles.toggleText}>Percentage (%)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setForm((p) => ({ ...p, gradeType: "marks" }))}
              style={
                form.gradeType === "marks"
                  ? styles.toggleSelected
                  : styles.toggle
              }
            >
              <Text style={styles.toggleText}>Marks</Text>
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

          {/* Save Button */}
          <TouchableOpacity style={styles.primaryButton} onPress={saveExam}>
            <Text style={styles.buttonText}>
              {form.id ? "Update Exam" : "Save Exam"}
            </Text>
          </TouchableOpacity>

          {/* ---------------- LIST OF EXAMS ---------------- */}
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
                        id: item.id,
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
