// src/screens/EditClassSelector.jsx

import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import StudentLayout from "../components/StudentLayout";
import { useClassStore } from "../store/classStore";

export default function EditClassSelector() {
  const classes = useClassStore((s) => s.classes);

  // Sort numeric class IDs
  const sortedClasses = [...classes].sort(
    (a, b) => Number(a.id) - Number(b.id)
  );

  const [selected, setSelected] = useState(null);

  const goToEdit = () => {
    if (!selected) return;
    router.push(`/students/${selected}`);
  };

  return (
    <StudentLayout
      title="Select Class"
      subtitle="Choose a class to edit"
      icon="edit"
      backOffset={40}
      titleOffset={50}
    >
      {/* NO CLASSES */}
      {sortedClasses.length === 0 && (
        <Text style={styles.emptyText}>No classes available.</Text>
      )}

      {/* CLASS LIST */}
      <View style={styles.classList}>
        {sortedClasses.map((cls) => (
          <TouchableOpacity
            key={cls.id}
            style={[styles.classBox, selected === cls.id && styles.activeClass]}
            onPress={() => setSelected(cls.id)}
          >
            <Text
              style={[
                styles.classText,
                selected === cls.id && { color: "#FFF" },
              ]}
            >
              Class {cls.id}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* NEXT BUTTON */}
      <TouchableOpacity
        style={[
          styles.nextBtn,
          (!selected || sortedClasses.length === 0) && { opacity: 0.4 },
        ]}
        disabled={!selected || sortedClasses.length === 0}
        onPress={goToEdit}
      >
        <Text style={styles.nextText}>Continue</Text>
      </TouchableOpacity>
    </StudentLayout>
  );
}

const styles = StyleSheet.create({
  emptyText: {
    fontSize: 15,
    fontFamily: "DMSans-Regular",
    color: "#777",
    marginBottom: 15,
  },

  classList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },

  classBox: {
    backgroundColor: "#EEF6F4",
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderRadius: 14,
    minWidth: 90,
    alignItems: "center",
  },

  activeClass: {
    backgroundColor: "#0F5A52",
  },

  classText: {
    fontSize: 15,
    fontFamily: "DMSans-Medium",
    color: "#333",
  },

  nextBtn: {
    backgroundColor: "#0F5A52",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },

  nextText: {
    color: "#FFF",
    fontSize: 17,
    fontFamily: "DMSans-Bold",
  },
});
