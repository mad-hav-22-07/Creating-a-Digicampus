import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { loadJSON, saveJSON } from "../../../src/storage/storage";
import { KEY_CLASSES, KEY_EXAMS } from "../../../src/storage/ids";
import ClassesScreen from "../../../src/Screens/ClassesScreen";
import ExamsScreen from "../../../src/Screens/ExamsScreen";

export default function ClassManagementIndex() {
  const [screen, setScreen] = useState("classes"); // classes | exams
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);

  const loadAll = useCallback(async () => {
    const cls = await loadJSON(KEY_CLASSES, []);
    const ex = await loadJSON(KEY_EXAMS, []);
    setClasses(cls);
    setExams(ex);
  }, []);

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Top Navigation */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.topButton, screen === "classes" && styles.activeTab]}
          onPress={() => setScreen("classes")}
        >
          <Text style={styles.topButtonText}>Classes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.topButton, screen === "exams" && styles.activeTab]}
          onPress={() => setScreen("exams")}
        >
          <Text style={styles.topButtonText}>Exams</Text>
        </TouchableOpacity>
      </View>

      {/* Screens */}
      {screen === "classes" && (
        <ClassesScreen classes={classes} setClasses={setClasses} />
      )}

      {screen === "exams" && (
        <ExamsScreen classes={classes} exams={exams} setExams={setExams} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    backgroundColor: "#1C5A52",
    paddingVertical: 12,
  },
  topButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#174A44",
  },
  topButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
