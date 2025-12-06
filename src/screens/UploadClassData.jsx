// src/screens/UploadClassData.jsx
import * as DocumentPicker from "expo-document-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as XLSX from "xlsx";

import StudentLayout from "../components/StudentLayout";

export default function UploadClassData() {
  const { replaceMode, classList } = useLocalSearchParams();

  // Will come from backend later
  const availableClasses = classList ? classList.split(",") : [];

  const [selectedClass, setSelectedClass] = useState(null);

  const pickExcelFile = async () => {
    if (!selectedClass) {
      Alert.alert("Select Class", "Please choose a class.");
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled || result.type !== "success") return;

      const fileUri = result.uri;
      const file = await fetch(fileUri);
      const buffer = await file.arrayBuffer();

      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const excelData = XLSX.utils.sheet_to_json(sheet);

      const students = excelData.map((row, i) => ({
        id: String(Date.now() + i),
        roll: Number(row.Roll || row.roll || row["Roll No"]),
        name: row.Name || row.name,
      }));

      router.push({
        pathname: "/",
        params: {
          action: replaceMode === "true" ? "replace" : "upload",
          classId: selectedClass,
          students: JSON.stringify(students),
        },
      });
    } catch (err) {
      console.log("Excel Error:", err);
    }
  };

  return (
    <StudentLayout
      title={replaceMode === "true" ? "Replace Data" : "Upload Class Data"}
      subtitle="Select Class & Upload Excel"
      icon="upload-cloud"
      backOffset={40} // lower back button
      titleOffset={30} // push title lower
    >
      <View style={styles.container}>
        {/* CLASS LABEL */}
        <Text style={styles.label}>Choose Class</Text>

        {/* NO CLASSES AVAILABLE */}
        {availableClasses.length === 0 ? (
          <Text style={styles.noClassText}>
            No classes available. Please create classes first.
          </Text>
        ) : (
          <View style={styles.classRow}>
            {availableClasses.map((cls) => (
              <TouchableOpacity
                key={cls}
                style={[
                  styles.classOption,
                  selectedClass === cls && styles.selectedClass,
                ]}
                onPress={() => setSelectedClass(cls)}
              >
                <Text
                  style={[
                    styles.classText,
                    selectedClass === cls && { color: "#fff" },
                  ]}
                >
                  Class {cls}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* UPLOAD BUTTON */}
        <TouchableOpacity
          style={[styles.uploadBtn, !selectedClass && styles.uploadBtnDisabled]}
          disabled={!selectedClass}
          onPress={pickExcelFile}
        >
          <Text style={styles.uploadText}>
            {replaceMode === "true" ? "Select Excel File" : "Upload Excel File"}
          </Text>
        </TouchableOpacity>
      </View>
    </StudentLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },

  label: {
    fontSize: 15,
    fontFamily: "DMSans-Bold",
    color: "#0F5A52",
    marginBottom: 10,
  },

  noClassText: {
    color: "#777",
    fontFamily: "DMSans-Regular",
    marginBottom: 20,
  },

  classRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 25,
  },

  classOption: {
    backgroundColor: "#E4F2EF",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginRight: 10,
    marginBottom: 10,
  },

  selectedClass: {
    backgroundColor: "#0F5A52",
  },

  classText: {
    fontSize: 15,
    fontFamily: "DMSans-Medium",
    color: "#0F5A52",
  },

  uploadBtn: {
    backgroundColor: "#0F5A52",
    padding: 16,
    borderRadius: 14,
    marginTop: 10,
    alignItems: "center",
  },

  uploadBtnDisabled: {
    backgroundColor: "#9cc7c1",
  },

  uploadText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "DMSans-Bold",
  },
});
