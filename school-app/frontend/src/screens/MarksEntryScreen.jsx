import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import { COLORS } from '../constants/colors';

const BASE_URL = 'http://169.254.121.159:8000/api/v1';

const MarksEntryScreen = ({ navigation }) => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [marks, setMarks] = useState('');

  const [searchClass, setSearchClass] = useState('');
  const [searchStudent, setSearchStudent] = useState('');
  const [searchExam, setSearchExam] = useState('');

  const [open, setOpen] = useState(null); // 'class' | 'student' | 'exam'

  /* ================= LOAD CLASSES ================= */
  useEffect(() => {
    loadClasses();
  }, []);

  const getToken = async () => AsyncStorage.getItem('userToken');

  const loadClasses = async () => {
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/classes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    setClasses(json.data || []);
  };

  /* ================= LOAD STUDENTS ================= */
  const loadStudents = async (id) => {
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/classes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    setStudents(json.data.students || []);
  };

  /* ================= LOAD EXAMS ================= */
  const loadExams = async (id) => {
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/exams/class/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    setExams(json.data || []);
  };

  /* ================= SAVE MARKS ================= */
  const saveMarks = async () => {
    if (!selectedClass || !selectedStudent || !selectedExam || !marks) {
      return Alert.alert('Error', 'All fields are required');
    }

    const token = await getToken();

    await fetch(`${BASE_URL}/marks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        exam_id: selectedExam.exam_id,
        marks_records: [
          {
            student_id: selectedStudent.student_id,
            subject_id: 1, // 🔴 TEMP (subject handling later)
            marks_scored: Number(marks),
          },
        ],
      }),
    });

    Alert.alert('Success', 'Marks saved successfully');
    setMarks('');
  };

  /* ================= DROPDOWN ITEM ================= */
  const DropdownItem = ({ label, onPress, isSelected }) => (
    <TouchableOpacity 
      style={[styles.option, isSelected && styles.optionSelected]} 
      onPress={onPress}
    >
      <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
        {label}
      </Text>
      {isSelected && <Text style={styles.checkmark}>✓</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Marks Entry" showBack onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* ===== CLASS ===== */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Select Class</Text>
          <TouchableOpacity
            style={[styles.dropdown, selectedClass && styles.dropdownFilled]}
            onPress={() => setOpen(open === 'class' ? null : 'class')}
          >
            <Text style={[styles.dropdownText, selectedClass && styles.dropdownTextFilled]}>
              {selectedClass 
                ? `Class ${selectedClass.class_name}-${selectedClass.section_name}` 
                : 'Choose class'}
            </Text>
            <Text style={styles.arrow}>{open === 'class' ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {open === 'class' && (
            <View style={styles.dropdownBox}>
              <TextInput
                placeholder="Search class..."
                value={searchClass}
                onChangeText={setSearchClass}
                style={styles.search}
                placeholderTextColor="#9ca3af"
              />
              <FlatList
                data={classes.filter((c) =>
                  `${c.class_name}${c.section_name}`
                    .toLowerCase()
                    .includes(searchClass.toLowerCase())
                )}
                keyExtractor={(i) => i.class_id.toString()}
                renderItem={({ item }) => (
                  <DropdownItem
                    label={`Class ${item.class_name}-${item.section_name}`}
                    isSelected={selectedClass?.class_id === item.class_id}
                    onPress={() => {
                      setSelectedClass(item);
                      setSelectedStudent(null);
                      setSelectedExam(null);
                      setStudents([]);
                      setExams([]);
                      loadStudents(item.class_id);
                      loadExams(item.class_id);
                      setOpen(null);
                      setSearchClass('');
                    }}
                  />
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No classes found</Text>
                }
              />
            </View>
          )}
        </View>

        {/* ===== STUDENT ===== */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Select Student</Text>
          <TouchableOpacity
            style={[
              styles.dropdown, 
              selectedStudent && styles.dropdownFilled,
              !selectedClass && styles.dropdownDisabled
            ]}
            onPress={() => selectedClass && setOpen(open === 'student' ? null : 'student')}
            disabled={!selectedClass}
          >
            <Text style={[
              styles.dropdownText, 
              selectedStudent && styles.dropdownTextFilled,
              !selectedClass && styles.dropdownTextDisabled
            ]}>
              {selectedStudent ? selectedStudent.full_name : 'Choose student'}
            </Text>
            <Text style={styles.arrow}>{open === 'student' ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {open === 'student' && (
            <View style={styles.dropdownBox}>
              <TextInput
                placeholder="Search student..."
                value={searchStudent}
                onChangeText={setSearchStudent}
                style={styles.search}
                placeholderTextColor="#9ca3af"
              />
              <FlatList
                data={students.filter((s) =>
                  s.full_name.toLowerCase().includes(searchStudent.toLowerCase())
                )}
                keyExtractor={(i) => i.student_id.toString()}
                renderItem={({ item }) => (
                  <DropdownItem
                    label={item.full_name}
                    isSelected={selectedStudent?.student_id === item.student_id}
                    onPress={() => {
                      setSelectedStudent(item);
                      setOpen(null);
                      setSearchStudent('');
                    }}
                  />
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No students found</Text>
                }
              />
            </View>
          )}
        </View>

        {/* ===== EXAM ===== */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Select Exam</Text>
          <TouchableOpacity
            style={[
              styles.dropdown, 
              selectedExam && styles.dropdownFilled,
              !selectedClass && styles.dropdownDisabled
            ]}
            onPress={() => selectedClass && setOpen(open === 'exam' ? null : 'exam')}
            disabled={!selectedClass}
          >
            <Text style={[
              styles.dropdownText, 
              selectedExam && styles.dropdownTextFilled,
              !selectedClass && styles.dropdownTextDisabled
            ]}>
              {selectedExam ? selectedExam.exam_name : 'Choose exam'}
            </Text>
            <Text style={styles.arrow}>{open === 'exam' ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {open === 'exam' && (
            <View style={styles.dropdownBox}>
              <TextInput
                placeholder="Search exam..."
                value={searchExam}
                onChangeText={setSearchExam}
                style={styles.search}
                placeholderTextColor="#9ca3af"
              />
              <FlatList
                data={exams.filter((e) =>
                  e.exam_name.toLowerCase().includes(searchExam.toLowerCase())
                )}
                keyExtractor={(i) => i.exam_id.toString()}
                renderItem={({ item }) => (
                  <DropdownItem
                    label={item.exam_name}
                    isSelected={selectedExam?.exam_id === item.exam_id}
                    onPress={() => {
                      setSelectedExam(item);
                      setOpen(null);
                      setSearchExam('');
                    }}
                  />
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No exams found</Text>
                }
              />
            </View>
          )}
        </View>

        {/* ===== MARKS ===== */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Marks Scored</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={marks}
            onChangeText={setMarks}
            placeholder="Enter marks scored"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <TouchableOpacity 
          style={[
            styles.saveBtn,
            (!selectedClass || !selectedStudent || !selectedExam || !marks) && styles.saveBtnDisabled
          ]} 
          onPress={saveMarks}
          disabled={!selectedClass || !selectedStudent || !selectedExam || !marks}
        >
          <Text style={styles.saveText}>Save Marks</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default MarksEntryScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  content: { 
    padding: 16,
    paddingBottom: 32,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: { 
    fontWeight: '600', 
    marginBottom: 8, 
    color: COLORS.text,
    fontSize: 15,
  },
  dropdown: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownFilled: {
    borderColor: COLORS.primary,
    backgroundColor: '#f0f9ff',
  },
  dropdownDisabled: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
  },
  dropdownText: {
    color: '#9ca3af',
    fontSize: 15,
    flex: 1,
  },
  dropdownTextFilled: {
    color: COLORS.text,
    fontWeight: '500',
  },
  dropdownTextDisabled: {
    color: '#d1d5db',
  },
  arrow: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  dropdownBox: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  search: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 15,
  },
  option: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: '#f0f9ff',
  },
  optionText: {
    color: COLORS.text,
    fontSize: 15,
  },
  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  checkmark: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    padding: 16,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 14,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    fontSize: 15,
    color: COLORS.text,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveBtnDisabled: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 16,
    letterSpacing: 0.5,
  },
});