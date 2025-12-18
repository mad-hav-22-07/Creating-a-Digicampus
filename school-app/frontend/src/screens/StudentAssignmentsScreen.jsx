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

const DUMMY_ASSIGNMENTS = [
  {
    id: 1,
    title: 'Mathematics Chapter 5 Problems',
    subject: 'Mathematics',
    description: 'Complete exercises 5.1 to 5.3',
    dueDate: '2025-12-20',
    status: 'pending',
    marks: 20,
  },
  {
    id: 2,
    title: 'Physics Lab Report',
    subject: 'Physics',
    description: 'Submit lab report on Newton\'s Laws',
    dueDate: '2025-12-18',
    status: 'submitted',
    marks: 15,
    submittedDate: '2025-12-17',
  },
  {
    id: 3,
    title: 'English Essay Writing',
    subject: 'English',
    description: 'Write an essay on "Climate Change"',
    dueDate: '2025-12-22',
    status: 'pending',
    marks: 25,
  },
  {
    id: 4,
    title: 'Chemistry Practical',
    subject: 'Chemistry',
    description: 'Complete titration experiment',
    dueDate: '2025-12-15',
    status: 'graded',
    marks: 20,
    scoredMarks: 18,
    submittedDate: '2025-12-14',
  },
  {
    id: 5,
    title: 'History Project',
    subject: 'History',
    description: 'Research on World War II',
    dueDate: '2025-12-25',
    status: 'pending',
    marks: 30,
  },
];

const StudentAssignmentsScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('all'); // all, pending, submitted, graded

  const filterAssignments = () => {
    if (selectedTab === 'all') return DUMMY_ASSIGNMENTS;
    return DUMMY_ASSIGNMENTS.filter(a => a.status === selectedTab);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'submitted': return '#3b82f6';
      case 'graded': return '#10b981';
      default: return COLORS.textLight;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'time-outline';
      case 'submitted': return 'checkmark-circle-outline';
      case 'graded': return 'trophy-outline';
      default: return 'document-outline';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'submitted': return 'Submitted';
      case 'graded': return 'Graded';
      default: return status;
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days left`;
  };

  const renderAssignment = (item) => {
    const statusColor = getStatusColor(item.status);
    const daysUntil = getDaysUntilDue(item.dueDate);
    const isOverdue = daysUntil === 'Overdue' && item.status === 'pending';

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.assignmentCard,
          isOverdue && styles.overdueCard,
        ]}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.subjectBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.subjectText, { color: statusColor }]}>
              {item.subject}
            </Text>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Ionicons name={getStatusIcon(item.status)} size={14} color={statusColor} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
        </View>

        <Text style={styles.assignmentTitle}>{item.title}</Text>
        <Text style={styles.assignmentDescription}>{item.description}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.footerItem}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.textLight} />
            <Text style={[
              styles.footerText,
              isOverdue && { color: '#ef4444', fontWeight: '600' }
            ]}>
              {daysUntil}
            </Text>
          </View>

          <View style={styles.footerItem}>
            <Ionicons name="document-text-outline" size={16} color={COLORS.textLight} />
            <Text style={styles.footerText}>
              {item.status === 'graded' 
                ? `${item.scoredMarks}/${item.marks} marks`
                : `${item.marks} marks`
              }
            </Text>
          </View>
        </View>

        {item.status === 'pending' && (
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit Assignment</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const filteredAssignments = filterAssignments();
  const stats = {
    all: DUMMY_ASSIGNMENTS.length,
    pending: DUMMY_ASSIGNMENTS.filter(a => a.status === 'pending').length,
    submitted: DUMMY_ASSIGNMENTS.filter(a => a.status === 'submitted').length,
    graded: DUMMY_ASSIGNMENTS.filter(a => a.status === 'graded').length,
  };

  return (
    <View style={styles.container}>
      <Header title="Assignments" showBack onBackPress={() => navigation.goBack()} />

      <View style={styles.content}>
        {/* Stats Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
          <View style={styles.statsContainer}>
            <TouchableOpacity
              style={[styles.statCard, selectedTab === 'all' && styles.statCardActive]}
              onPress={() => setSelectedTab('all')}
            >
              <Text style={[styles.statValue, selectedTab === 'all' && styles.statTextActive]}>
                {stats.all}
              </Text>
              <Text style={[styles.statLabel, selectedTab === 'all' && styles.statTextActive]}>
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statCard, selectedTab === 'pending' && styles.statCardActive]}
              onPress={() => setSelectedTab('pending')}
            >
              <Text style={[styles.statValue, selectedTab === 'pending' && styles.statTextActive]}>
                {stats.pending}
              </Text>
              <Text style={[styles.statLabel, selectedTab === 'pending' && styles.statTextActive]}>
                Pending
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statCard, selectedTab === 'submitted' && styles.statCardActive]}
              onPress={() => setSelectedTab('submitted')}
            >
              <Text style={[styles.statValue, selectedTab === 'submitted' && styles.statTextActive]}>
                {stats.submitted}
              </Text>
              <Text style={[styles.statLabel, selectedTab === 'submitted' && styles.statTextActive]}>
                Submitted
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statCard, selectedTab === 'graded' && styles.statCardActive]}
              onPress={() => setSelectedTab('graded')}
            >
              <Text style={[styles.statValue, selectedTab === 'graded' && styles.statTextActive]}>
                {stats.graded}
              </Text>
              <Text style={[styles.statLabel, selectedTab === 'graded' && styles.statTextActive]}>
                Graded
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Assignments List */}
        <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map(renderAssignment)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={64} color="#e5e7eb" />
              <Text style={styles.emptyTitle}>No assignments</Text>
              <Text style={styles.emptySubtitle}>
                {selectedTab === 'all'
                  ? 'No assignments available yet'
                  : `No ${selectedTab} assignments`
                }
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default StudentAssignmentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  statsScroll: {
    marginVertical: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
  },
  statCard: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 90,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statCardActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  statTextActive: {
    color: COLORS.white,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  assignmentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  overdueCard: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  subjectText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  assignmentDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    gap: 6,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});