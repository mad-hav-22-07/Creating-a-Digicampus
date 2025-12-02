import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";

import BackButton from "../components/BackButton.component";
import Input from "../components/Input.component";
import SmallIconButton from "../components/SmallIconButton.component";
import SubjectRow from "../components/SubjectRow.component";
import SectionTitle from "../components/SectionTitle.component";

import { saveJSON } from "../storage/storage";
import { KEY_CLASSES, genId } from "../storage/ids";
import { styles } from "../styles/styles";

export default function ClassesScreen({ classes, setClasses }) {
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

    setClasses((prev) => {
      const exists = prev.find((c) => c.id === cleaned.id);
      const updated = exists
        ? prev.map((c) => (c.id === cleaned.id ? cleaned : c))
        : [cleaned, ...prev];

      saveJSON(KEY_CLASSES, updated);
      return updated;
    });

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
          setClasses((prev) => {
            const next = prev.filter((c) => c.id !== id);
            saveJSON(KEY_CLASSES, next);
            return next;
          });
        },
      },
    ]);
  };

  // ---------- HEADER (FORM) ----------
  const renderHeader = () => (
    <View style={{ padding: 16 }}>
      <BackButton />
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
        value={form.totalStudents}
        keyboardType="numeric"
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

  // ---------- RENDER ROW ----------
  const renderItem = ({ item }) => (
    <View style={styles.listRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>
          {item.name} - {item.section}
        </Text>

        <Text style={styles.itemMeta}>Teacher: {item.classTeacherName}</Text>

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
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        ListHeaderComponent={renderHeader}
        data={classes}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        nestedScrollEnabled
      />
    </KeyboardAvoidingView>
  );
}
