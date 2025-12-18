import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl, 
  Alert,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import ActionCard from '../components/ActionCard';
import { getToken } from '../utils/auth';
import { BASE_URL } from '../services/api';
import { authAPI } from '../services/api';

const { width } = Dimensions.get('window');

// Dummy data for today's classes
const DUMMY_CLASSES = [
  {
    id: 1,
    subject: 'Mathematics',
    className: 'Class 10-A',
    time: '08:00 AM - 09:00 AM',
    room: 'Room 201',
    type: 'lecture',
  },
  {
    id: 2,
    subject: 'Physics',
    className: 'Class 10-B',
    time: '09:15 AM - 10:15 AM',
    room: 'Lab 1',
    type: 'practical',
  },
  {
    id: 3,
    subject: 'English',
    className: 'Class 9-A',
    time: '11:00 AM - 12:00 PM',
    room: 'Room 105',
    type: 'lecture',
  },
  {
    id: 4,
    subject: 'Chemistry',
    className: 'Class 11-C',
    time: '02:00 PM - 03:00 PM',
    room: 'Lab 2',
    type: 'practical',
  },
];

const DashboardScreen = ({ navigation, route }) => {
  const [userRole, setUserRole] = useState(route.params?.role || 'teacher');
  const [userData, setUserData] = useState(null);
  const [todayClasses, setTodayClasses] = useState(DUMMY_CLASSES);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const headers = {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      };

      // Profile data
      const profileData = await authAPI.getCurrentUser();
      setUserRole(profileData.role || 'teacher');
      setUserData({
        name: profileData.userName,
      });

      // Using dummy classes for now
      setTodayClasses(DUMMY_CLASSES);

      // Notifications - different endpoint based on role
      try {
if (profileData.role === 'student') {
  // STUDENT → announcements
  const announcementsRes = await fetch(
    `${BASE_URL}/notifications/announcements`,
    { headers }
  );
  const announcementsBody = await announcementsRes.json().catch(() => ({ data: [] }));
  const announcements = announcementsBody?.data ?? [];

  setNotifications(
    announcements.slice(0, 3).map(a => ({
      type: 'announcement',
      message: a.content,
      created_at: a.created_at,
      teacher_name: a.teacher_name,
    }))
  );
} else {
  // TEACHER → leave requests
  const leaveRes = await fetch(
    `${BASE_URL}/notifications/leave-requests`,
    { headers }
  );
  const leaveBody = await leaveRes.json().catch(() => ({ data: [] }));
  const leaves = leaveBody?.data ?? [];

  setNotifications(
    leaves.slice(0, 3).map(l => ({
      type: 'leave',
      student_name: l.student_name,
      content: l.content,
      status: l.status,
      created_at: l.created_at,
    }))
  );
}

      } catch (error) {
        console.log('No notifications available');
      }

    } catch (error) {
      console.error('Error loading dashboard:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleMarkAttendance = async (classId) => {
    navigation.navigate('Attendance', { classId });
  };

  const teacherActions = [
    { icon: 'people-outline', label: 'Attendance', screen: 'Attendance', color: '#10b981' },
    { icon: 'create-outline', label: 'Marks Entry', screen: 'MarksEntry', color: '#f59e0b' },
    { icon: 'school-outline', label: 'Classes', screen: 'ClassManagement', color: '#8b5cf6' },
    { icon: 'document-text-outline', label: 'Reports', screen: 'ViewGrades', color: '#ef4444' },
  ];

  const studentActions = [
    { icon: 'document-text-outline', label: 'My Grades', screen: 'StudentGrades', color: '#3b82f6' },
    { icon: 'calendar-outline', label: 'Timetable', screen: 'StudentTimetable', color: '#10b981' },
    { icon: 'checkmark-done-outline', label: 'Attendance', screen: 'StudentAttendance', color: '#8b5cf6' },
    { icon: 'book-outline', label: 'Assignments', screen: 'StudentAssignments', color: '#f59e0b' },
  ];

  const actions = userRole === 'teacher' ? teacherActions : studentActions;

  const getClassIcon = (type) => {
    return type === 'practical' ? 'flask-outline' : 'book-outline';
  };

  const getClassColor = (index) => {
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];
    return colors[index % colors.length];
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good Morning 👋</Text>
            <Text style={styles.userName}>{userData?.name || 'Loading...'}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                {userRole === 'teacher' ? '👨‍🏫 Teacher' : '👨‍🎓 Student'}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation.navigate('Menu', { role: userRole })}
          >
            <Ionicons name="menu" size={28} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionCard, { backgroundColor: action.color }]}
                onPress={() => navigation.navigate(action.screen)}
                activeOpacity={0.8}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons name={action.icon} size={28} color={COLORS.white} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Today's Classes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {userRole === 'teacher' ? "Today's Classes" : "Today's Schedule"}
            </Text>
            <TouchableOpacity onPress={() => {
              if (userRole === 'student') {
                navigation.navigate('StudentTimetable');
              }
            }}>
              <Text style={styles.viewAll}>View All →</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.classesScrollContainer}
          >
            {todayClasses.map((classItem, index) => (
              <TouchableOpacity 
                key={classItem.id} 
                style={[
                  styles.classCardHorizontal,
                  { borderLeftColor: getClassColor(index) }
                ]}
                onPress={() => userRole === 'teacher' && handleMarkAttendance(classItem.id)}
                activeOpacity={0.7}
              >
                <View style={styles.classCardHeader}>
                  <View style={[styles.classIconBadge, { backgroundColor: getClassColor(index) + '20' }]}>
                    <Ionicons 
                      name={getClassIcon(classItem.type)} 
                      size={24} 
                      color={getClassColor(index)} 
                    />
                  </View>
                  <View style={[styles.classTypeBadge, { backgroundColor: getClassColor(index) }]}>
                    <Text style={styles.classTypeText}>
                      {classItem.type === 'practical' ? 'Lab' : 'Lecture'}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.classSubject}>{classItem.subject}</Text>
                <Text style={styles.classNameText}>{classItem.className}</Text>
                
                <View style={styles.classDetailsRow}>
                  <View style={styles.classDetail}>
                    <Ionicons name="time-outline" size={16} color={COLORS.textLight} />
                    <Text style={styles.classDetailText}>{classItem.time.split(' - ')[0]}</Text>
                  </View>
                  <View style={styles.classDetail}>
                    <Ionicons name="location-outline" size={16} color={COLORS.textLight} />
                    <Text style={styles.classDetailText}>{classItem.room}</Text>
                  </View>
                </View>

                {userRole === 'teacher' && (
                  <View style={styles.classAction}>
                    <Text style={styles.classActionText}>Mark Attendance</Text>
                    <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: '#dcfce7' }]}>
              <View style={styles.statIconContainer}>
                <Ionicons name="calendar-outline" size={24} color="#10b981" />
              </View>
              <Text style={styles.statNumber}>{todayClasses.length}</Text>
              <Text style={styles.statLabel}>Classes Today</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: '#dbeafe' }]}>
              <View style={styles.statIconContainer}>
                <Ionicons name="checkmark-circle-outline" size={24} color="#3b82f6" />
              </View>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: '#fef3c7' }]}>
              <View style={styles.statIconContainer}>
                <Ionicons name="time-outline" size={24} color="#f59e0b" />
              </View>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Upcoming</Text>
            </View>
          </View>
        </View>

        {/* Recent Notifications/Announcements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
       <Text style={styles.sectionTitle}>
  {userRole === 'student' ? 'Recent Announcements' : 'Leave Requests'}
</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Text style={styles.viewAll}>View All →</Text>
            </TouchableOpacity>
          </View>
          
      {notifications.map((item, index) => (
  <TouchableOpacity
    key={index}
    style={styles.notificationCard}
    onPress={() => navigation.navigate('Notifications')}
  >
    <View style={[styles.notificationIconBg, { backgroundColor: '#f0f9ff' }]}>
      <Ionicons
        name={
          userRole === 'teacher'
            ? 'document-text-outline'
            : 'megaphone-outline'
        }
        size={24}
        color={COLORS.primary}
      />
    </View>

    <View style={styles.notificationContent}>
      {userRole === 'teacher' ? (
        <>
          <Text style={styles.notificationText} numberOfLines={2}>
            {item.content}
          </Text>
          <Text style={styles.notificationTeacher}>
            {item.student_name} • {item.status}
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.notificationText} numberOfLines={2}>
            {item.message}
          </Text>
          {item.teacher_name && (
            <Text style={styles.notificationTeacher}>
              From: {item.teacher_name}
            </Text>
          )}
        </>
      )}

      <Text style={styles.notificationDate}>
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  </TouchableOpacity>
))}

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  userName: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 13,
    color: COLORS.white,
    fontWeight: '600',
  },
  menuButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },
  viewAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 52) / 2,
    aspectRatio: 1.4,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  classesScrollContainer: {
    paddingRight: 20,
  },
  classCardHorizontal: {
    width: width * 0.75,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  classCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  classIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  classTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  classTypeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
  classSubject: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  classNameText: {
    fontSize: 15,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  classDetailsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  classDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  classDetailText: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  classAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  classActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  notificationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 4,
    fontWeight: '500',
  },
  notificationTeacher: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  notificationDate: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  emptyNotifications: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textLight,
    marginTop: 12,
  },
});

export default DashboardScreen;