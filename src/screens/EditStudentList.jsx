// src/screens/EditStudentList.jsx

import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import StudentLayout from "../components/StudentLayout";
import { useClassStore } from "../store/classStore";

export default function EditStudentList() {
  const { classId } = useLocalSearchParams();

  const classes = useClassStore((s) => s.classes);
  const replaceClassStudents = useClassStore((s) => s.replaceClassStudents);
  const setClasses = useClassStore((s) => s.setClasses);

  const initialStudents = classes.find((c) => c.id === classId)?.students || [];
  const [students, setStudents] = useState(initialStudents);

  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState("roll-asc");

  // 🔄 Reload when class updates globally
  useEffect(() => {
    const updated = classes.find((c) => c.id === classId)?.students || [];
    setStudents(updated);
  }, [classes]);

  const handleDelete = (id) => {
    const s = students.find((st) => st.id === id);

    Alert.alert(
      "Delete Student?",
      `Remove ${s.name} (Roll ${s.roll}) from Class ${classId}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updated = students.filter((st) => st.id !== id);
            setStudents(updated);
            replaceClassStudents(classId, updated);
          },
        },
      ]
    );
  };

  const deleteClass = () => {
    Alert.alert(
      "Delete Entire Class?",
      `This will permanently delete Class ${classId}.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setClasses((prev) => prev.filter((c) => c.id !== classId));
            router.push("/");
          },
        },
      ]
    );
  };

  const goToEdit = (student) => {
    router.push({
      pathname: `/students/${classId}/edit`,
      params: { studentId: student.id },
    });
  };

  const filteredStudents = useMemo(() => {
    let data = [...students];

    data = data.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.roll.toString().includes(search)
    );

    switch (sortMode) {
      case "roll-asc":
        return data.sort((a, b) => a.roll - b.roll);
      case "roll-desc":
        return data.sort((a, b) => b.roll - a.roll);
      case "name-asc":
        return data.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return data.sort((a, b) => b.name.localeCompare(a.name));
    }
    return data;
  }, [students, search, sortMode]);

  return (
    <StudentLayout
      title="Edit Records"
      subtitle={`Class ${classId}`}
      icon="edit"
      backOffset={40}
      titleOffset={50}
    >
      {/* DELETE CLASS */}
      <TouchableOpacity style={styles.deleteClassBtn} onPress={deleteClass}>
        <Text style={styles.deleteClassText}>Delete Entire Class</Text>
      </TouchableOpacity>

      {/* SEARCH */}
      <TextInput
        style={styles.searchBox}
        placeholder="Search student..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#999"
      />

      {/* SORT OPTIONS */}
      <View style={styles.sortRow}>
        <TouchableOpacity onPress={() => setSortMode("roll-asc")}>
          <Text style={styles.sortBtn}>Roll ↑</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortMode("roll-desc")}>
          <Text style={styles.sortBtn}>Roll ↓</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortMode("name-asc")}>
          <Text style={styles.sortBtn}>A–Z</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortMode("name-desc")}>
          <Text style={styles.sortBtn}>Z–A</Text>
        </TouchableOpacity>
      </View>

      {/* BULK + REPLACE */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push(`/students/${classId}/bulk-edit`)}
        >
          <Text style={styles.actionText}>Bulk Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() =>
            router.push({
              pathname: "/upload",
              params: { replaceMode: "true", classId },
            })
          }
        >
          <Text style={styles.actionText}>Replace Excel</Text>
        </TouchableOpacity>
      </View>

      {/* STUDENT LIST */}
      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.studentItem}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => goToEdit(item)}
            >
              <Text style={styles.studentText}>
                {item.roll}. {item.name}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={styles.deleteBtn}
            >
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* ADD STUDENT FAB */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push(`/students/${classId}/add`)}
      >
        <Text style={styles.addBtnText}>+</Text>
      </TouchableOpacity>
    </StudentLayout>
  );
}

const styles = StyleSheet.create({
  deleteClassBtn: {
    backgroundColor: "#FFE8E8",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  deleteClassText: {
    color: "#D30000",
    fontSize: 15,
    fontFamily: "DMSans-Bold",
  },

  searchBox: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 14,
    marginBottom: 15,
    fontFamily: "DMSans-Regular",
  },

  sortRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  sortBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#EEE",
    borderRadius: 10,
    fontFamily: "DMSans-Medium",
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  actionBtn: {
    backgroundColor: "#FDECE0",
    padding: 14,
    borderRadius: 14,
    width: "48%",
    alignItems: "center",
  },

  actionText: {
    fontFamily: "DMSans-Bold",
    fontSize: 15,
    color: "#333",
  },

  studentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#EEF6F4",
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
  },

  studentText: {
    fontSize: 16,
    fontFamily: "DMSans-Medium",
    color: "#222",
  },

  deleteBtn: {
    paddingHorizontal: 10,
  },

  deleteIcon: {
    fontSize: 20,
  },

  addBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0F5A52",
    position: "absolute",
    bottom: 25,
    right: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  addBtnText: {
    color: "#FFF",
    fontSize: 30,
    fontFamily: "DMSans-Bold",
  },
});
