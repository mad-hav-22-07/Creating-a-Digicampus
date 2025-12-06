import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ⭐ Utility: Today's date
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
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

export default function StudentLayout({
  title,
  subtitle,
  icon,
  rightText,
  backOffset = 40,
  titleOffset = 70,
  children,
}) {
  const router = useRouter();
  const dateToShow = rightText || getTodayText();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <ImageBackground
        source={require("../../assets/images/student-bg.png")}
        style={styles.headerBg}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safe}>
          {/* BACK + DATE */}
          <View style={{ marginTop: backOffset }}>
            <View style={styles.topRow}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => router.back()}
              >
                <Feather name="arrow-left" size={26} color="#F8D2A2" />
              </TouchableOpacity>

              <Text style={styles.dateText}>{dateToShow}</Text>
            </View>
          </View>

          {/* TITLE ROW */}
          <View style={[styles.titleRow, { marginTop: titleOffset }]}>
            {icon && (
              <View style={styles.iconCircle}>
                <Feather name={icon} size={26} color="#FFFFFF" />
              </View>
            )}

            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={styles.titleText}>{title}</Text>

              {subtitle ? (
                <Text style={styles.subtitleText}>{subtitle}</Text>
              ) : null}
            </View>

            {/* Balance space */}
            <View style={{ width: icon ? 52 : 0 }} />
          </View>
        </SafeAreaView>
      </ImageBackground>

      {/* CONTENT */}
      <View style={styles.contentCard}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#255F57",
  },

  // ⭐ Increased height to avoid clipping
  headerBg: {
    width: "100%",
    height: 250,
  },

  safe: {
    paddingHorizontal: 20,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backBtn: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
  },

  dateText: {
    fontSize: 15,
    fontFamily: "DMSans-Medium",
    color: "#F5E6D4",
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  titleText: {
    fontSize: 32,
    fontFamily: "DMSans-Bold",
    color: "#FFFFFF",
    textAlign: "center",
  },

  subtitleText: {
    marginTop: 4,
    fontSize: 15,
    fontFamily: "DMSans-Medium",
    color: "#E9DFD4",
    textAlign: "center",
  },

  // ⭐ Lower card slightly so nothing hides under it
  contentCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -25,
    padding: 20,
  },
});
