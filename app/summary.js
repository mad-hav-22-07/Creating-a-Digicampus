import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ArrowIcon from "../assets/images/arrow.svg";
import Icon from "../assets/images/icon.svg";

const GET_ATTENDANCE_URL = "https://example.com/api/attendance?date="; // placeholder API

export default function Attendance() {
  const router = useRouter();

  const today = new Date();
  const dayName = today.toLocaleString("en-US", { weekday: "short" });
  const day = today.getDate();
  const monthName = today.toLocaleString("en-US", { month: "short" });

  // 🔥 JS version — no types
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(
          GET_ATTENDANCE_URL + today.toISOString().split("T")[0]
        );

        if (response.ok) {
          const data = await response.json();
          setRecords(data.records);
        } else {
          // mock fallback
          setRecords([
            { roll: "001", name: "Aarav", status: "Present" },
            { roll: "002", name: "Diya", status: "Absent" },
            { roll: "003", name: "Riza", status: "Present" },
          ]);
        }
      } catch (err) {
        console.error(err);
        setRecords([
          { roll: "001", name: "Aarav", status: "Present" },
          { roll: "002", name: "Diya", status: "Absent" },
          { roll: "003", name: "Riza", status: "Present" },
        ]);
      }
    };

    fetchSummary();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {/* Header */}
      <View style={{ width: "100%", height: 253, position: "relative" }}>
        <Image
          source={require("../assets/images/bg.jpg")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />

        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: "absolute", top: 40, left: 20 }}
        >
          <ArrowIcon width={32} height={32} />
        </TouchableOpacity>

        <View
          style={{
            position: "absolute",
            top: 40,
            right: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "OpenSans_600SemiBold",
              fontSize: 17,
              color: "white",
            }}
          >
            {dayName}
          </Text>

          <Text
            style={{
              fontFamily: "OpenSans_400Regular",
              fontSize: 17,
              color: "white",
              marginLeft: 6,
            }}
          >
            {day} {monthName}
          </Text>
        </View>

        <Text
          style={{
            position: "absolute",
            top: 115,
            left: 70,
            fontFamily: "OpenSans_600SemiBold",
            fontSize: 30,
            color: "white",
            lineHeight: 40,
          }}
        >
          Manage{"\n"}Attendance
        </Text>

        <Icon
          width={38}
          height={38}
          style={{ position: "absolute", top: 121, left: 22 }}
        />

        <View
          style={{
            position: "absolute",
            top: 218,
            left: 0,
            width: 385,
            height: 66,
            backgroundColor: "white",
            borderRadius: 70,
          }}
        />
      </View>

      {/* Table */}
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
      >
        <ScrollView>
          {/* Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 0.8 }]}>Roll No</Text>
            <Text style={[styles.headerText, { flex: 1.6 }]}>Student Name</Text>
            <Text style={[styles.headerText, { flex: 1.4 }]}>Status</Text>
          </View>

          {/* Rows */}
          {records.map((s) => (
            <View key={s.roll} style={styles.row}>
              <Text style={styles.cell}>{s.roll}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{s.name}</Text>
              <Text style={styles.cell}>{s.status}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 10,
    backgroundColor: "#FFE8DB",
    borderBottomWidth: 1,
    borderColor: "#FFE8DB",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "OpenSans_600SemiBold",
    textAlign: "left",
    paddingLeft: 18,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#F0F0F0",
    alignItems: "center",
  },
  cell: {
    flex: 1,
    textAlign: "left",
    paddingLeft: 18,
    fontSize: 15,
    fontFamily: "OpenSans_400Regular",
  },
});

