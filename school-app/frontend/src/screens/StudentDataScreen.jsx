import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import Header from '../components/Header';
import { DUMMY_STUDENTS } from '../constants/dummyData';

const StudentDataScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header
        title="Student Data"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />
      
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="cloud-upload-outline" size={24} color={COLORS.primary} />
          <Text style={styles.actionButtonText}>Upload Class Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="create-outline" size={24} color={COLORS.primary} />
          <Text style={styles.actionButtonText}>Add and Edit Records</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>CLASS RECORDS</Text>
      </View>

      <ScrollView style={styles.content}>
        {['Class 8A', 'Class 8B', 'Class 9A', 'Class 10A'].map((className, index) => (
          <TouchableOpacity key={index} style={styles.classCard}>
            <Text style={styles.classCardText}>{className}</Text>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  actionsRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 8,
    textAlign: 'center',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  classCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  classCardText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
});

export default StudentDataScreen;