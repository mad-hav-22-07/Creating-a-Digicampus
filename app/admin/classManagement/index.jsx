import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { styles } from "../../../src/styles/styles";

export default function ClassManagementHome() {
  const router = useRouter();

  return (
    <View style={styles.screenWrapper}>
      {/* HEADER */}
      <View style={styles.curvedHeader}>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitleIcon}>🛠️</Text>
          <Text style={styles.headerTitleText}>Class Management</Text>
        </View>
      </View>

      {/* GRID MENU */}
      <View style={styles.whiteContainer}>
        <View style={styles.menuGrid}>
          {/* 1️⃣ Create / Edit Class */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => router.push("/admin/classManagement/create")}
          >
            <Text style={styles.menuCardIcon}>➕</Text>
            <Text style={styles.menuCardLabel}>Create / Edit Class</Text>
          </TouchableOpacity>

          {/* 2️⃣ View Classes */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => router.push("/admin/classManagement/view")}
          >
            <Text style={styles.menuCardIcon}>📄</Text>
            <Text style={styles.menuCardLabel}>View Classes</Text>
          </TouchableOpacity>

          {/* 3️⃣ Schedule Exams */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => router.push("/admin/classManagement/exams")}
          >
            <Text style={styles.menuCardIcon}>📝</Text>
            <Text style={styles.menuCardLabel}>Schedule Exams</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
