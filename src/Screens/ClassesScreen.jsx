// src/Screens/ClassesScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import BackButton from "../components/BackButton.component";
import Input from "../components/Input.component";
import SmallIconButton from "../components/SmallIconButton.component";
import SubjectRow from "../components/SubjectRow.component";
import SectionTitle from "../components/SectionTitle.component";

import { saveJSON } from "../storage/storage";
import { KEY_CLASSES, genId } from "../storage/ids";
import { styles } from "../styles/styles";

// Zustand Store
import { useSchoolStore } from "../storage/useSchoolStore";

export default function ClassesScreen() {
  const classes = useSchoolStore((s) => s.classes);
  const setClasses = useSchoolStore((s) => s.setClasses);

  const [form, setForm] = useState({
    id: null,
    name: "",
    section: "",
    totalStudents: "",
    classTeacherName: "",
    subjects: [{ id: genId(), name: "" }],
  });

  const resetForm = () =>
    setForm({
      id: null,
      name: "",
      section: "",
      totalStudents: "",
      classTeacherName: "",
      subjects: [{ id: genId(), name: "" }],
    });

  const validate = () => {
    if (!form.name.trim()) return Alert.alert("Class name required") || false;
    if (!form.section.trim()) return Alert.alert("Section required") || false;
    if (!form.classTeacherName.trim())
      return Alert.alert("Teacher name required") || false;
    if (!form.totalStudents || isNaN(Number(form.totalStudents)))
      return Alert.alert("Students must be number") || false;

    // 🔴 PREVENT BLANK SUBJECTS
    const hasBlankSubject = form.subjects.some(
      (s) => !s.name || s.name.trim() === ""
    );
    if (hasBlankSubject) {
      Alert.alert("Invalid Subject", "Subject names cannot be empty.");
      return false;
    }

    // 🔴 DUPLICATE SUBJECT CHECK
    const names = form.subjects.map((s) => s.name.trim().toLowerCase());
    const hasDuplicates = new Set(names).size !== names.length;
    if (hasDuplicates) {
      Alert.alert(
        "Duplicate Subject",
        "You have added the same subject twice."
      );
      return false;
    }

    // 🔴 DUPLICATE CLASS CHECK
    const exists = classes.some(
      (c) =>
        c.name.toLowerCase().trim() === form.name.toLowerCase().trim() &&
        c.section.toLowerCase().trim() === form.section.toLowerCase().trim() &&
        c.id !== form.id // avoid blocking while editing
    );
    if (exists) {
      Alert.alert("Duplicate Class", "This class already exists.");
      return false;
    }

    return true;
  };

  const saveClass = () => {
    if (!validate()) return;

    const cleaned = {
      id: form.id || genId(),
      name: form.name.trim(),
      section: form.section.trim(),
      totalStudents: Number(form.totalStudents),
      classTeacherName: form.classTeacherName.trim(),
      subjects: form.subjects.map((s) => ({ name: s.name })),
    };

    const updated = classes.some((c) => c.id === cleaned.id)
      ? classes.map((c) => (c.id === cleaned.id ? cleaned : c))
      : [cleaned, ...classes];

    setClasses(updated);
    saveJSON(KEY_CLASSES, updated);

    Alert.alert("Success", form.id ? "Updated" : "Added");
    resetForm();
  };

  const startEdit = (cls) => {
    setForm({
      id: cls.id,
      name: cls.name,
      section: cls.section,
      totalStudents: String(cls.totalStudents),
      classTeacherName: cls.classTeacherName,
      subjects: cls.subjects.map((s) => ({ id: genId(), name: s.name })),
    });
  };

  const deleteClass = (id) => {
    Alert.alert("Delete?", "Confirm delete?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const next = classes.filter((c) => c.id !== id);
          setClasses(next);
          saveJSON(KEY_CLASSES, next);
        },
      },
    ]);
  };

  const renderForm = () => (
    <View>
      <SectionTitle title="Define / Edit Class" />

      <Input
        label="Class Name"
        value={form.name}
        onChange={(v) => setForm({ ...form, name: v })}
      />

      <Input
        label="Section"
        value={form.section}
        onChange={(v) => setForm({ ...form, section: v })}
      />

      <Input
        label="Total Students"
        keyboardType="numeric"
        value={form.totalStudents}
        onChange={(v) => setForm({ ...form, totalStudents: v })}
      />

      <Input
        label="Class Teacher Name"
        value={form.classTeacherName}
        onChange={(v) => setForm({ ...form, classTeacherName: v })}
      />

      <SectionTitle title="Subjects" />

      {form.subjects.map((s) => (
        <SubjectRow
          key={s.id}
          value={s.name}
          onChange={(name) =>
            setForm({
              ...form,
              subjects: form.subjects.map((x) =>
                x.id === s.id ? { ...x, name } : x
              ),
            })
          }
          onRemove={() =>
            setForm({
              ...form,
              subjects:
                form.subjects.length > 1
                  ? form.subjects.filter((x) => x.id !== s.id)
                  : form.subjects,
            })
          }
        />
      ))}

      <TouchableOpacity
        onPress={() =>
          setForm({
            ...form,
            subjects: [...form.subjects, { id: genId(), name: "" }],
          })
        }
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>+ Add Subject</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryButton} onPress={saveClass}>
        <Text style={styles.buttonText}>
          {form.id ? "Update Class" : "Save Class"}
        </Text>
      </TouchableOpacity>

      <SectionTitle title={`Classes (${classes.length})`} />
    </View>
  );

  return (
    <View style={styles.screenWrapper}>
      {/* BACK BUTTON — now positioned higher using topOffset */}
      <BackButton topOffset={60} />

      {/* HEADER */}
      <View style={styles.curvedHeader}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }} />
          <Text style={styles.dateText}>{new Date().toDateString()}</Text>
        </View>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitleIcon}>📚</Text>
          <Text style={styles.headerTitleText}>Class Management</Text>
        </View>
      </View>

      {/* BODY */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.whiteContainer}
          contentContainerStyle={{ paddingBottom: 120 }}
          keyboardShouldPersistTaps="always"
        >
          {renderForm()}

          {classes.map((item) => (
            <View key={item.id} style={styles.listRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>
                  {item.name} - {item.section}
                </Text>

                <Text style={styles.itemMeta}>
                  Teacher: {item.classTeacherName}
                </Text>

                <Text style={styles.itemSubjects}>
                  Subjects: {item.subjects.map((s) => s.name).join(", ")}
                </Text>
              </View>

              <View style={styles.rowActions}>
                <SmallIconButton
                  icon="edit"
                  color="#2563eb"
                  onPress={() => startEdit(item)}
                />
                <SmallIconButton
                  icon="trash-2"
                  color="#dc2626"
                  onPress={() => deleteClass(item.id)}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
