import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Header from '../components/Header';
import { classAPI } from '../services/api';
import { COLORS } from '../constants/colors';

const ViewClassScreen = ({ navigation }) => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    loadClasses();
  }, []);

const loadClasses = async () => {
  try {
    const res = await classAPI.getAllClasses();
    setClasses(res?.data || []);
  } catch (err) {
    console.error('Error loading classes', err);
  }
};

  return (
    <View style={styles.container}>
      <Header title="View Classes" showBack onBackPress={() => navigation.goBack()} />

      <FlatList
        data={classes}
        keyExtractor={(item) => String(item.class_id)}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.class_name}</Text>
            <Text style={styles.subtitle}>Section: {item.section_name}</Text>
            <Text style={styles.subtitle}>Students: {item.student_count || 0}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  card: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textLight },
});

export default ViewClassScreen;
