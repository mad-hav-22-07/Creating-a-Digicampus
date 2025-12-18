import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import { examAPI } from '../services/api';
import { COLORS } from '../constants/colors';

const SetMarksScreen = ({ navigation }) => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    const data = await examAPI.getAllExams();
    setExams(data || []);
  };

  return (
    <View style={styles.container}>
      <Header title="Set Marks" showBack onBackPress={() => navigation.goBack()} />

      <FlatList
        data={exams}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('MarksEntry', { examId: item.id })}
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>Class: {item.class?.name}</Text>
          </TouchableOpacity>
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

export default SetMarksScreen;
