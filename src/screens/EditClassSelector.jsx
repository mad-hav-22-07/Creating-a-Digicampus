import { router, useLocalSearchParams } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditClassSelector() {
  const params = useLocalSearchParams();
  const classes = JSON.parse(params.classes || "[]");

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Class to Edit</Text>

      {classes.length === 0 && (
        <Text style={{ color: "#777" }}>No classes available.</Text>
      )}

      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.box}
            onPress={() =>
              router.push({
                pathname: `/students/${item.id}`,
                params: {
                  classes: JSON.stringify(classes),
                },
              })
            }
          >
            <Text style={styles.text}>Class {item.id}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  box: {
    backgroundColor: "#eef6f4",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
  },
  text: { fontSize: 18, fontWeight: "600" },
});
