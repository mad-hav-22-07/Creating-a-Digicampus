const SAVE_ATTENDANCE_URL = "https://example.com/api/attendance"; // placeholder URL

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import ArrowIcon from "../assets/images/arrow.svg";
import Icon from "../assets/images/icon.svg";

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState({});

  useEffect(() => {
    // Replace with backend API call
    const fetched = [
      { roll: "001", name: "Aarav" },
      { roll: "002", name: "Diya" },
      { roll: "003", name: "Riza" },
    ];

    setStudents(fetched);
  }, []);

  const options = [
    { label: "Present", value: "Present" },
    { label: "Absent", value: "Absent" },
  ];

  const router = useRouter();

  const today = new Date();
  const dayName = today.toLocaleString("en-US", { weekday: "short" });
  const day = today.getDate();
  const monthName = today.toLocaleString("en-US", { month: "short" });

  const saveAttendance = async () => {
    const payload = {
      date: today.toISOString().split("T")[0],
      records: students.map((s) => ({
        roll: s.roll,
        name: s.name,
        status: status[s.roll] || "Absent",
      })),
    };

    try {
      const response = await fetch(SAVE_ATTENDANCE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      ToastAndroid.show("Attendance saved!", ToastAndroid.SHORT);

      // Navigate back automatically after 1.5s
      setTimeout(() => {
        router.replace("/"); // goes to first screen
      }, 1500);
    } catch (err) {
      console.error(err);

      ToastAndroid.show("Attendance saved (Mock)!", ToastAndroid.SHORT);

      setTimeout(() => {
        router.replace("/");
      }, 1200);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {/* Header */}
      <View style={{ width: "100%", height: 253, position: "relative" }}>
        <Image
          source={require("../assets/images/bg.jpg")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />

        {/* Back */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: "absolute", top: 40, left: 20 }}
        >
          <ArrowIcon width={32} height={32} />
        </TouchableOpacity>

        {/* Date */}
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

        {/* Title */}
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
      <View style={{ paddingHorizontal: 20 }}>
        <ScrollView style={{ marginTop: 20 }}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 0.8 }]}>Roll No</Text>
            <Text style={[styles.headerText, { flex: 1.6 }]}>Student Name</Text>
            <Text style={[styles.headerText, { flex: 1.4 }]}>Status</Text>
          </View>

          {students.map((s) => (
            <View key={s.roll} style={styles.row}>
              <Text style={styles.cell}>{s.roll}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{s.name}</Text>

              <Dropdown
                style={styles.dropdown}
                data={options}
                labelField="label"
                valueField="value"
                value={status[s.roll]}
                placeholder="Select"
                onChange={(item) =>
                  setStatus({ ...status, [s.roll]: item.value })
                }
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Finish Button */}
      <View style={{ alignItems: "center", marginTop: 20, marginBottom: 30 }}>
        <TouchableOpacity
          style={{
            width: 336,
            height: 48,
            backgroundColor: "#2D665F",
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={saveAttendance}
        >
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontFamily: "OpenSans_400Regular",
            }}
          >
            Finish Attendance
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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

  dropdown: {
    width: 110,
    height: 40,
    borderWidth: 1,
    borderColor: "#AAA",
    borderRadius: 6,
    paddingHorizontal: 8,
    justifyContent: "center",
  },
});


