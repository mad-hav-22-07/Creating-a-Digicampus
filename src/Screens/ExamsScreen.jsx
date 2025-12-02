// app/admin/classManagement/ExamsScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";

import { styles } from "../styles/styles";
import { genId, KEY_EXAMS } from "../storage/ids";
import { saveJSON } from "../storage/storage";

import BackButton from "../components/BackButton.component";
import Input from "../components/Input.component";
import GradeRow from "../components/GradeRow.component";
import SmallIconButton from "../components/SmallIconButton.component";
import SectionTitle from "../components/SectionTitle.component";

export default function ExamsScreen({ classes, exams, setExams }) {
  const [form, setForm] = useState({
    id: null,
    classId: "",
    name: "",
    maxMarks: "",
    subjectSchedules: [],
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
      gradeScale: [
        { id: genId(), name: "A", min: "90", max: "100" },
        { id: genId(), name: "B", min: "80", max: "89" },
      ],
    });

  const selectedClass = classes.find((c) => c.id === form.classId);
  const subjects = selectedClass?.subjects?.map((s) => s.name) || [];

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
    };

    setExams((prev) => {
      const exists = prev.find((e) => e.id === cleaned.id);
      const next = exists
        ? prev.map((e) => (e.id === cleaned.id ? cleaned : e))
        : [cleaned, ...prev];

      saveJSON(KEY_EXAMS, next);
      return next;
    });

    reset();
  };

  return (
    <ScrollView style={{ flex: 1, padding: 12 }}>
      <BackButton />

      {/* Title */}
      <SectionTitle title="Schedule Exam" />

      {/* Select Class */}
      <SectionTitle title="Select Class" />
      <View style={styles.pickerContainer}>
        <ScrollView>
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

      {/* Subjects */}
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
                    existing ? styles.checkboxChecked : styles.checkboxUnchecked
                  }
                >
                  {existing && <Text style={{ color: "#fff" }}>✓</Text>}
                </TouchableOpacity>

                <Text style={styles.scheduleText}>{sub}</Text>

                {existing && (
                  <TextInput
                    style={styles.textInput}
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

      {/* Grade Scale */}
      <SectionTitle title="Grade Scale" />
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

      <TouchableOpacity style={styles.primaryButton} onPress={saveExam}>
        <Text style={styles.buttonText}>
          {form.id ? "Update Exam" : "Save Exam"}
        </Text>
      </TouchableOpacity>

      {/* Scheduled Exams */}
      <SectionTitle title={`Scheduled Exams (${exams.length})`} />

      <FlatList
        data={exams}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => {
          const c = classes.find((x) => x.id === item.classId);

          return (
            <View style={styles.listRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.name}</Text>

                <Text style={styles.itemMeta}>
                  Class: {c ? `${c.name}-${c.section}` : "Unknown"}
                </Text>

                <Text style={styles.itemSubjects}>
                  {item.subjectSchedules.map((s) => s.subjectName).join(", ")}
                </Text>
              </View>

              <View style={styles.rowActions}>
                <SmallIconButton
                  icon="edit"
                  onPress={() => {
                    setForm({
                      ...item,
                      maxMarks: String(item.maxMarks),
                      gradeScale: item.gradeScale.map((g) => ({
                        id: genId(),
                        name: g.name,
                        min: String(g.min),
                        max: String(g.max),
                      })),
                    });
                  }}
                />

                <SmallIconButton
                  icon="trash-2"
                  color="#dc2626"
                  onPress={() =>
                    setExams((prev) => {
                      const next = prev.filter((e) => e.id !== item.id);
                      saveJSON(KEY_EXAMS, next);
                      return next;
                    })
                  }
                />
              </View>
            </View>
          );
        }}
      />
    </ScrollView>
  );
}
