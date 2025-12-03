import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSchoolStore } from "../../../src/storage/useSchoolStore";
import BackButton from "../../../src/components/BackButton.component";
import SectionTitle from "../../../src/components/SectionTitle.component";
import { styles } from "../../../src/styles/styles";

export default function ViewClassesPage() {
  const classes = useSchoolStore((s) => s.classes);
  const [selectedId, setSelectedId] = useState(null);

  const selectedClass = classes.find((c) => c.id === selectedId) || null;

  return (
    <View style={styles.screenWrapper}>
      {/* HEADER */}
      <View style={styles.curvedHeader}>
        {/* EXACT SAME AS CREATE PAGE */}
        <View style={styles.headerRow}>
          <BackButton />
          <Text style={styles.dateText}>{new Date().toDateString()}</Text>
        </View>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitleIcon}>📄</Text>
          <Text style={styles.headerTitleText}>View Classes</Text>
        </View>
      </View>

      {/* BODY */}
      <View style={styles.whiteContainer}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{ paddingBottom: 80, paddingTop: 10 }}
        >
          <SectionTitle title={`All Classes (${classes.length})`} />

          {/* LIST OF CLASSES */}
          {classes.length === 0 ? (
            <Text style={styles.emptyText}>No classes added yet.</Text>
          ) : (
            classes.map((cls) => {
              const isSelected = cls.id === selectedId;

              return (
                <TouchableOpacity
                  key={cls.id}
                  onPress={() =>
                    setSelectedId((prev) => (prev === cls.id ? null : cls.id))
                  }
                  style={[
                    styles.listRow,
                    isSelected && { borderWidth: 2, borderColor: "#1C5A52" },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>
                      {cls.name} - {cls.section}
                    </Text>

                    <Text style={styles.itemMeta}>
                      Teacher: {cls.classTeacherName}
                    </Text>

                    <Text style={styles.itemSubjects}>
                      {cls.subjects?.map((s) => s.name).join(", ") ||
                        "No subjects"}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}

          {/* DETAILS PANEL */}
          {selectedClass && (
            <View
              style={{
                marginTop: 16,
                padding: 16,
                borderRadius: 14,
                backgroundColor: "#F7FFFD",
                borderWidth: 1,
                borderColor: "#DDE7E5",
              }}
            >
              <SectionTitle title="Class Details" />

              <Text style={styles.itemTitle}>
                {selectedClass.name} - {selectedClass.section}
              </Text>

              <Text style={styles.itemMeta}>
                Class Teacher: {selectedClass.classTeacherName}
              </Text>

              <Text style={[styles.itemMeta, { marginTop: 4 }]}>
                Total Students: {selectedClass.totalStudents}
              </Text>

              <Text style={[styles.subHeader, { marginTop: 12 }]}>
                Subjects
              </Text>

              {(!selectedClass.subjects ||
                selectedClass.subjects.length === 0) && (
                <Text style={styles.emptyText}>No subjects defined.</Text>
              )}

              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {selectedClass.subjects?.map((s, idx) => (
                  <View key={idx} style={styles.gradeTag}>
                    <Text style={styles.gradeTagText}>{s.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
