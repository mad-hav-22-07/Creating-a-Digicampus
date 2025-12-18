import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { COLORS } from '../constants/colors';

const TIMETABLE_DATA = {
  Monday: [
    { subject: 'Mathematics', time: '08:00 - 09:00', teacher: 'Mr. Kumar', room: 'Room 201' },
    { subject: 'Physics', time: '09:15 - 10:15', teacher: 'Ms. Sharma', room: 'Lab 1' },
    { subject: 'English', time: '10:30 - 11:30', teacher: 'Mrs. Patel', room: 'Room 105' },
    { subject: 'Chemistry', time: '11:45 - 12:45', teacher: 'Dr. Singh', room: 'Lab 2' },
    { subject: 'Lunch Break', time: '12:45 - 01:30', teacher: '', room: '' },
    { subject: 'History', time: '01:30 - 02:30', teacher: 'Mr. Reddy', room: 'Room 303' },
    { subject: 'Computer Science', time: '02:45 - 03:45', teacher: 'Ms. Gupta', room: 'Lab 3' },
  ],
  Tuesday: [
    { subject: 'Chemistry', time: '08:00 - 09:00', teacher: 'Dr. Singh', room: 'Lab 2' },
    { subject: 'Mathematics', time: '09:15 - 10:15', teacher: 'Mr. Kumar', room: 'Room 201' },
    { subject: 'Physical Education', time: '10:30 - 11:30', teacher: 'Coach Verma', room: 'Ground' },
    { subject: 'Biology', time: '11:45 - 12:45', teacher: 'Dr. Joshi', room: 'Lab 4' },
    { subject: 'Lunch Break', time: '12:45 - 01:30', teacher: '', room: '' },
    { subject: 'English', time: '01:30 - 02:30', teacher: 'Mrs. Patel', room: 'Room 105' },
    { subject: 'Physics', time: '02:45 - 03:45', teacher: 'Ms. Sharma', room: 'Lab 1' },
  ],
  Wednesday: [
    { subject: 'English', time: '08:00 - 09:00', teacher: 'Mrs. Patel', room: 'Room 105' },
    { subject: 'History', time: '09:15 - 10:15', teacher: 'Mr. Reddy', room: 'Room 303' },
    { subject: 'Mathematics', time: '10:30 - 11:30', teacher: 'Mr. Kumar', room: 'Room 201' },
    { subject: 'Computer Science', time: '11:45 - 12:45', teacher: 'Ms. Gupta', room: 'Lab 3' },
    { subject: 'Lunch Break', time: '12:45 - 01:30', teacher: '', room: '' },
    { subject: 'Chemistry', time: '01:30 - 02:30', teacher: 'Dr. Singh', room: 'Lab 2' },
    { subject: 'Physics', time: '02:45 - 03:45', teacher: 'Ms. Sharma', room: 'Lab 1' },
  ],
  Thursday: [
    { subject: 'Biology', time: '08:00 - 09:00', teacher: 'Dr. Joshi', room: 'Lab 4' },
    { subject: 'Mathematics', time: '09:15 - 10:15', teacher: 'Mr. Kumar', room: 'Room 201' },
    { subject: 'English', time: '10:30 - 11:30', teacher: 'Mrs. Patel', room: 'Room 105' },
    { subject: 'History', time: '11:45 - 12:45', teacher: 'Mr. Reddy', room: 'Room 303' },
    { subject: 'Lunch Break', time: '12:45 - 01:30', teacher: '', room: '' },
    { subject: 'Physics', time: '01:30 - 02:30', teacher: 'Ms. Sharma', room: 'Lab 1' },
    { subject: 'Computer Science', time: '02:45 - 03:45', teacher: 'Ms. Gupta', room: 'Lab 3' },
  ],
  Friday: [
    { subject: 'Mathematics', time: '08:00 - 09:00', teacher: 'Mr. Kumar', room: 'Room 201' },
    { subject: 'Chemistry', time: '09:15 - 10:15', teacher: 'Dr. Singh', room: 'Lab 2' },
    { subject: 'Computer Science', time: '10:30 - 11:30', teacher: 'Ms. Gupta', room: 'Lab 3' },
    { subject: 'English', time: '11:45 - 12:45', teacher: 'Mrs. Patel', room: 'Room 105' },
    { subject: 'Lunch Break', time: '12:45 - 01:30', teacher: '', room: '' },
    { subject: 'Biology', time: '01:30 - 02:30', teacher: 'Dr. Joshi', room: 'Lab 4' },
    { subject: 'Physical Education', time: '02:45 - 03:45', teacher: 'Coach Verma', room: 'Ground' },
  ],
  Saturday: [
    { subject: 'Physics', time: '08:00 - 09:00', teacher: 'Ms. Sharma', room: 'Lab 1' },
    { subject: 'History', time: '09:15 - 10:15', teacher: 'Mr. Reddy', room: 'Room 303' },
    { subject: 'Mathematics', time: '10:30 - 11:30', teacher: 'Mr. Kumar', room: 'Room 201' },
    { subject: 'Library Period', time: '11:45 - 12:45', teacher: 'Librarian', room: 'Library' },
  ],
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const StudentTimetableScreen = ({ navigation }) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const [selectedDay, setSelectedDay] = useState(DAYS.includes(today) ? today : 'Monday');

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': '#3b82f6',
      'Physics': '#8b5cf6',
      'Chemistry': '#10b981',
      'Biology': '#06b6d4',
      'English': '#f59e0b',
      'History': '#ef4444',
      'Computer Science': '#6366f1',
      'Physical Education': '#14b8a6',
      'Lunch Break': '#9ca3af',
      'Library Period': '#a855f7',
    };
    return colors[subject] || '#64748b';
  };

  const renderPeriod = (period, index) => {
    const color = getSubjectColor(period.subject);
    const isBreak = period.subject === 'Lunch Break';

    return (
      <View
        key={index}
        style={[
          styles.periodCard,
          isBreak && styles.breakCard,
        ]}
      >
        <View style={[styles.periodIndicator, { backgroundColor: color }]} />
        
        <View style={styles.periodContent}>
          <View style={styles.periodHeader}>
            <Text style={[styles.periodSubject, isBreak && styles.breakText]}>
              {period.subject}
            </Text>
            <Text style={styles.periodTime}>{period.time}</Text>
          </View>

          {!isBreak && (
            <View style={styles.periodDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="person-outline" size={14} color={COLORS.textLight} />
                <Text style={styles.detailText}>{period.teacher}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={14} color={COLORS.textLight} />
                <Text style={styles.detailText}>{period.room}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  const periods = TIMETABLE_DATA[selectedDay] || [];

  return (
    <View style={styles.container}>
      <Header title="Timetable" showBack onBackPress={() => navigation.goBack()} />

      <View style={styles.content}>
        {/* Day Selector */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.daySelector}
          contentContainerStyle={styles.daySelectorContent}
        >
          {DAYS.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                selectedDay === day && styles.dayButtonActive,
                day === today && styles.dayButtonToday,
              ]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[
                styles.dayButtonText,
                selectedDay === day && styles.dayButtonTextActive,
              ]}>
                {day.substring(0, 3)}
              </Text>
              {day === today && (
                <View style={styles.todayDot} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Timetable */}
        <ScrollView 
          style={styles.timetableContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.dayHeader}>
            <Ionicons name="calendar" size={20} color={COLORS.primary} />
            <Text style={styles.dayTitle}>{selectedDay}</Text>
            {selectedDay === today && (
              <View style={styles.todayBadge}>
                <Text style={styles.todayBadgeText}>Today</Text>
              </View>
            )}
          </View>

          {periods.map((period, index) => renderPeriod(period, index))}

          <View style={styles.footer}>
            <Ionicons name="information-circle-outline" size={16} color={COLORS.textLight} />
            <Text style={styles.footerText}>
              Total {periods.filter(p => p.subject !== 'Lunch Break').length} periods
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default StudentTimetableScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  daySelector: {
    marginVertical: 16,
  },
  daySelectorContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    minWidth: 70,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dayButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dayButtonToday: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  dayButtonTextActive: {
    color: COLORS.white,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },
  timetableContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  todayBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  todayBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  periodCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  breakCard: {
    opacity: 0.7,
  },
  periodIndicator: {
    width: 4,
  },
  periodContent: {
    flex: 1,
    padding: 14,
  },
  periodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  periodSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  breakText: {
    fontStyle: 'italic',
    color: COLORS.textLight,
  },
  periodTime: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  periodDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textLight,
  },
});