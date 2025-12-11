import DateTimePicker from "@react-native-community/datetimepicker";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import ArrowIcon from "../assets/images/arrow.svg";
import Icon from "../assets/images/icon.svg";

export default function ClassDropdown() {
  const router = useRouter();

  const today = new Date();
  const dayName = today.toLocaleString("en-US", { weekday: "short" });
  const day = today.getDate();
  const monthName = today.toLocaleString("en-US", { month: "short" });

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      // Example placeholder — replace with API fetch later
      const data = ["Class 1", "Class 2", "Class 3"];

      const formatted = data.map((c) => ({
        label: c,
        value: c,
      }));

      setClasses(formatted);
    };

    fetchClasses();
  }, []);

  const onChangeDate = (event, selectedDate) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ width: "100%", height: 253, position: "relative" }}>
        <Image
          source={require("../assets/images/bg.jpg")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />

        <ArrowIcon width={32} height={32} style={{ position: "absolute", top: 40, left: 20 }} />

        <View
          style={{
            position: "absolute",
            top: 40,
            right: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ fontFamily: "OpenSans_600SemiBold", fontSize: 17, color: "white" }}>
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

        <Icon width={38} height={38} style={{ position: "absolute", top: 121, left: 22 }} />

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

      <View style={{ marginTop: 10 }}>
        <Text
          style={{
            fontFamily: "OpenSans_400Regular",
            fontSize: 16,
            marginBottom: 8,
            left: 20,
            color: "black",
          }}
        >
          Select Class:
        </Text>

        <Dropdown
          style={styles.dropdown}
          data={classes}
          maxHeight={180}
          labelField="label"
          valueField="value"
          value={selectedClass}
          onChange={(item) => setSelectedClass(item.value)}
          placeholder="Select Class"
          itemTextStyle={styles.itemText}
          selectedTextStyle={styles.selectedText}
          containerStyle={styles.dropdownContainer}
        />
      </View>

      <View style={{ marginTop: 20 }}>
        <Text
          style={{
            fontFamily: "OpenSans_400Regular",
            fontSize: 16,
            marginBottom: 8,
            left: 20,
            color: "black",
          }}
        >
          Select Date:
        </Text>

        <TouchableOpacity
          style={[styles.dropdown, { justifyContent: "center" }]}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.selectedText}>{date.toDateString()}</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChangeDate}
            textColor={Platform.OS === "ios" ? "white" : undefined}
            accentColor={Platform.OS === "android" ? "#FFC3A1" : undefined}
          />
        )}
      </View>

      <View style={{ marginTop: 20, alignItems: "center", gap: 12 }}>
        <Link href="/attendance" asChild>
          <TouchableOpacity
            style={{
              marginTop: 20,
              width: 336,
              height: 48,
              backgroundColor: "#2D665F",
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontFamily: "OpenSans_400Regular" }}>
              Take Attendance
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/summary" asChild>
          <TouchableOpacity
            style={{
              marginTop: 20,
              width: 336,
              height: 48,
              backgroundColor: "#2D665F",
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontFamily: "OpenSans_400Regular" }}>
              View Summary
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20, marginTop: 20 }}></ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    left: 20,
    width: 344,
    height: 48,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  dropdownContainer: {
    borderRadius: 8,
    paddingVertical: 5,
    backgroundColor: "white",
  },
  itemText: {
    fontSize: 16,
    fontFamily: "OpenSans_400Regular",
    paddingVertical: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  selectedText: {
    fontSize: 16,
    fontFamily: "OpenSans_400Regular",
  },
});
