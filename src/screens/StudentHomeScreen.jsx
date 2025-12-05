import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function StudentHomeScreen() {
  const params = useLocalSearchParams();
  const { action, classId, students } = params;

  const [classes, setClasses] = useState([]);

  // Handle uploads or replacements coming from UploadClassData
  useEffect(() => {
    if (!action) return;

    const parsedStudents =
      typeof students === "string" ? JSON.parse(students) : students;

    if (action === "upload") {
      setClasses((prev) => {
        const exists = prev.find((c) => c.id === classId);
        if (exists) return prev;
        return [
          ...prev,
          { id: classId, name: `Class ${classId}`, students: parsedStudents },
        ];
      });
    }

    if (action === "replace") {
      setClasses((prev) =>
        prev.map((c) =>
          c.id === classId ? { ...c, students: parsedStudents } : c
        )
      );
    }
  }, [action]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Student Data</Text>

      {/* Top Buttons */}
      <View style={styles.topButtonsContainer}>
        {/* UPLOAD EXCEL */}
        <TouchableOpacity
          style={styles.optionBox}
          onPress={() =>
            router.push({
              pathname: "/upload",
              params: {
                classList: classes.map((c) => c.id).join(","),
              },
            })
          }
        >
          <Text style={styles.optionText}>Upload Class Data</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        {/* EDIT → goes to students/select */}
        <TouchableOpacity
          style={styles.optionBox}
          onPress={() =>
            router.push({
              pathname: "/students/select",
              params: {
                classes: JSON.stringify(classes),
              },
            })
          }
        >
          <Text style={styles.optionText}>Add & Edit Records</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* CLASS RECORD LIST */}
      <Text style={styles.subTitle}>CLASS RECORDS</Text>

      {classes.length === 0 && (
        <Text style={{ color: "#888", marginTop: 10 }}>
          No class data uploaded yet.
        </Text>
      )}

      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.classItem}
            onPress={() =>
              router.push({
                pathname: `/view/${item.id}`,
                params: {
                  students: JSON.stringify(item.students),
                },
              })
            }
          >
            <Text style={styles.classText}>{item.name}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 26, fontWeight: "700", marginBottom: 20 },
  topButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionBox: {
    width: "48%",
    backgroundColor: "#fdeee7",
    padding: 18,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionText: { fontSize: 16, fontWeight: "600" },
  arrow: { fontSize: 18, fontWeight: "700", color: "#444" },
  subTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 10,
  },
  classItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#eef6f4",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
  },
  classText: { fontSize: 16, fontWeight: "600" },
});
