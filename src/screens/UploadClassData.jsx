import * as DocumentPicker from "expo-document-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as XLSX from "xlsx";

export default function UploadClassData() {
  const { replaceMode, classId, classList } = useLocalSearchParams();

  const [selectedClass, setSelectedClass] = useState(classId || null);

  // ---- PICK EXCEL FILE USING EXPO DOCUMENT PICKER ----
  const selectExcelFile = async () => {
    if (!selectedClass) {
      Alert.alert("Select Class", "Please choose a class first.");
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.type !== "success") return;

      const fileUri = result.uri;

      const file = await fetch(fileUri);
      const buffer = await file.arrayBuffer();

      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const excelData = XLSX.utils.sheet_to_json(sheet);

      const students = excelData.map((row, index) => ({
        id: String(index + 1),
        roll: row.Roll || row.roll || row["Roll No"],
        name: row.Name || row.name,
      }));

      if (replaceMode === "true") {
        Alert.alert(
          "Replace Data",
          `Class ${selectedClass} data will be replaced.`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Replace",
              onPress: () => {
                router.push({
                  pathname: "/",
                  params: {
                    action: "replace",
                    classId: selectedClass,
                    students: JSON.stringify(students),
                  },
                });
              },
            },
          ]
        );
      } else {
        router.push({
          pathname: "/",
          params: {
            action: "upload",
            classId: selectedClass,
            students: JSON.stringify(students),
          },
        });
      }
    } catch (err) {
      console.log("Error selecting Excel:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {replaceMode === "true" ? "Replace Class Data" : "Upload Class Data"}
      </Text>

      <Text style={styles.label}>Select Class</Text>

      <View style={styles.classRow}>
        {(classList ? classList.split(",") : []).map((cls) => (
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

      <TouchableOpacity style={styles.uploadBtn} onPress={selectExcelFile}>
        <Text style={styles.uploadText}>
          {replaceMode === "true" ? "Select New Excel" : "Upload Excel File"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ------ STYLES ------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 25,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  classRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 25,
  },

  classOption: {
    backgroundColor: "#eee",
  },
});
