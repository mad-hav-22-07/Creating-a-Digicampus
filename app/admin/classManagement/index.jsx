// app/admin/classManagement/index.jsx
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { styles } from "../../../src/styles/styles";
import BackButton from "../../../src/components/BackButton.component";

export default function ClassManagementHome() {
  const router = useRouter();

  return (
    <View style={styles.screenWrapper}>
      {/* FULL HEADER WITH BACKGROUND IMAGE */}
      <ImageBackground
        source={require("../../../assets/header/bg.png")}
        style={styles.headerBackground}
        imageStyle={styles.headerImageStyle}
      >
        <BackButton />

        <View style={styles.dateRightBox}>
          <Text style={styles.dateText}>{new Date().toDateString()}</Text>
        </View>

        {/* HEADER ICON + TITLE */}
        <View style={styles.headerTitleBox}>
          <Feather
            name="layers"
            size={32}
            color="#fff"
            style={{ marginBottom: 6 }}
          />
          <Text style={styles.headerTitleText}>Class Management</Text>
        </View>
      </ImageBackground>

      {/* WHITE CONTAINER WITH MENU */}
      <View style={styles.whiteContainer}>
        <View style={styles.menuGrid}>
          {/* CREATE / EDIT CLASS */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => router.push("/admin/classManagement/create")}
          >
            <Feather name="plus-circle" size={28} color="#444" />
            <Text style={styles.menuCardLabel}>Create / Edit{"\n"}Class</Text>
            <Feather name="arrow-right" size={20} color="#444" />
          </TouchableOpacity>

          {/* VIEW CLASSES */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => router.push("/admin/classManagement/view")}
          >
            <Feather name="list" size={28} color="#444" />
            <Text style={styles.menuCardLabel}>View{"\n"}Classes</Text>
            <Feather name="arrow-right" size={20} color="#444" />
          </TouchableOpacity>

          {/* SCHEDULE EXAMS */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => router.push("/admin/classManagement/exams")}
          >
            <Feather name="file-text" size={28} color="#444" />
            <Text style={styles.menuCardLabel}>Schedule{"\n"}Exams</Text>
            <Feather name="arrow-right" size={20} color="#444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
