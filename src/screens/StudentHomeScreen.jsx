// src/screens/StudentHomeScreen.jsx
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import StudentLayout from "../components/StudentLayout";
import { useClassStore } from "../store/classStore";

export default function StudentHomeScreen() {
  const params = useLocalSearchParams();

  const classes = useClassStore((s) => s.classes);
  const addClass = useClassStore((s) => s.addClass);
  const replaceClassStudents = useClassStore((s) => s.replaceClassStudents);

  // HANDLE ACTIONS FROM UPLOAD SCREEN
  useEffect(() => {
    if (!params?.action) return;

    const { action, classId } = params;
    let parsedStudents = params.students;

    if (typeof parsedStudents === "string") {
      try {
        parsedStudents = JSON.parse(parsedStudents);
      } catch (e) {
        console.log("JSON Parse Error:", e);
        return;
      }
    }

    if (action === "upload") addClass(classId, parsedStudents);
    if (action === "replace") replaceClassStudents(classId, parsedStudents);

    router.setParams({ action: null, classId: null, students: null });
  }, [params?.action]);
  function getTodayText() {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const d = new Date();
    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];

    return `${day} ${date} ${month}`;
  }

  return (
    <StudentLayout
      title="Student Data"
      icon="users"
      subtitle=""
      backOffset={40}
      titleOffset={60}
    >
      {/* TOP BUTTONS */}
      <View style={styles.topButtonsContainer}>
        {/* UPLOAD */}
        <TouchableOpacity
          style={styles.optionBox}
          onPress={() => router.push("/upload")}
        >
          <View>
            <Text style={styles.optionLabel}>Upload</Text>
            <Text style={styles.optionTitle}>Class Data</Text>
          </View>
          <Feather name="upload-cloud" size={24} color="#0F5A52" />
        </TouchableOpacity>

        {/* ADD & EDIT */}
        <TouchableOpacity
          style={styles.optionBox}
          onPress={() => router.push("/students/select")}
        >
          <View>
            <Text style={styles.optionLabel}>Add & Edit</Text>
            <Text style={styles.optionTitle}>Records</Text>
          </View>
          <Feather name="list" size={24} color="#0F5A52" />
        </TouchableOpacity>
      </View>

      {/* SECTION TITLE */}
      <Text style={styles.subTitle}>CLASS RECORDS</Text>

      {classes.length === 0 && (
        <Text style={styles.emptyText}>No class data available.</Text>
      )}

      {/* CLASS LIST */}
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.classItem}
            onPress={() => router.push(`/view/${item.id}?classId=${item.id}`)}
          >
            <View style={styles.rowLeft}>
              <View style={styles.classIcon}>
                <Feather name="users" size={18} color="#0F5A52" />
              </View>
              <Text style={styles.classText}>{item.name}</Text>
            </View>

            <Feather name="chevron-right" size={22} color="#0F5A52" />
          </TouchableOpacity>
        )}
      />
    </StudentLayout>
  );
}

const styles = StyleSheet.create({
  topButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  optionBox: {
    width: "48%",
    backgroundColor: "#FDECE0",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  optionLabel: {
    fontSize: 13,
    fontFamily: "DMSans-Medium",
    color: "#555",
  },

  optionTitle: {
    fontSize: 17,
    fontFamily: "DMSans-Bold",
    color: "#222",
  },

  subTitle: {
    fontSize: 16,
    fontFamily: "DMSans-Bold",
    marginVertical: 12,
    color: "#000",
  },

  emptyText: {
    fontFamily: "DMSans-Regular",
    color: "#777",
    marginTop: 6,
  },

  classItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EEF6F4",
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  classIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#D5EBE6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  classText: {
    fontSize: 16,
    fontFamily: "DMSans-Medium",
    color: "#333",
  },
});
