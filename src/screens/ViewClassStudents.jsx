import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ViewClassStudents() {
  const params = useLocalSearchParams();

  const classId = params.classId;
  const students = JSON.parse(params.students || "[]");

  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState("roll-asc");

  const filteredStudents = useMemo(() => {
    let data = [...students];

    // Search filter
    data = data.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.roll.toString().includes(search)
    );

    // Sorting
    switch (sortMode) {
      case "roll-asc":
        data.sort((a, b) => a.roll - b.roll);
        break;
      case "roll-desc":
        data.sort((a, b) => b.roll - a.roll);
        break;
      case "name-asc":
        data.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        data.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return data;
  }, [students, search, sortMode]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Class {classId} Students</Text>

      {/* Search */}
      <TextInput
        style={styles.searchBox}
        placeholder="Search by name or roll"
        value={search}
        onChangeText={setSearch}
      />

      {/* Sort */}
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

      {/* Student list */}
      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.studentItem}>
            <Text style={styles.studentText}>
              {item.roll}. {item.name}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  header: { fontSize: 22, fontWeight: "700", marginBottom: 20 },

  searchBox: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginBottom: 15,
  },

  sortRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  sortBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
  },

  studentItem: {
    padding: 15,
    backgroundColor: "#eef6f4",
    borderRadius: 12,
    marginBottom: 10,
  },

  studentText: {
    fontSize: 17,
    fontWeight: "600",
  },
});
