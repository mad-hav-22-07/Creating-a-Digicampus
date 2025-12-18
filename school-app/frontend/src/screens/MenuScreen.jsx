import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { authAPI } from '../services/api';

const MenuScreen = ({ navigation }) => {
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const profileData = await authAPI.getCurrentUser();
      setUserRole(profileData.role);
      setUserData({
        name: profileData.userName,
        email: profileData.email,
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

const teacherMenuItems = [
  { icon: 'people-outline', label: 'Attendance', screen: 'Attendance', color: '#10b981' },
  { icon: 'create-outline', label: 'Marks Entry', screen: 'MarksEntry', color: '#f59e0b' },
  { icon: 'document-text-outline', label: 'View Grades', screen: 'ViewGrades', color: '#ef4444' },
  { icon: 'school-outline', label: 'Class Management', screen: 'ClassManagement', color: '#8b5cf6' },
  { icon: 'person-outline', label: 'Student Data', screen: 'StudentData', color: '#3b82f6' },
  { icon: 'notifications-outline', label: 'Notifications', screen: 'Notifications', color: '#ec4899' },
  { icon: 'person-circle-outline', label: 'My Profile', screen: 'Profile', color: '#06b6d4' }, // Add this line
];
const studentMenuItems = [
  { icon: 'document-text-outline', label: 'My Grades', screen: 'StudentGrades', color: '#3b82f6' },
  { icon: 'calendar-outline', label: 'Timetable', screen: 'StudentTimetable', color: '#10b981' },
  { icon: 'checkmark-done-outline', label: 'My Attendance', screen: 'StudentAttendance', color: '#8b5cf6' },
  { icon: 'book-outline', label: 'Assignments', screen: 'StudentAssignments', color: '#f59e0b' },
  { icon: 'notifications-outline', label: 'Notifications', screen: 'Notifications', color: '#ec4899' },
  { icon: 'person-outline', label: 'My Profile', screen: 'Profile', color: '#06b6d4' }, // Changed from 'StudentProfile' to 'Profile'
];

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const getCurrentDate = () => {
    const date = new Date();
    const options = { day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Menu</Text>
          <View style={styles.headerDate}>
            <Text style={styles.dateText}>{getCurrentDate()}</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.white} />
        </View>
      </View>
    );
  }

  const menuItems = userRole === 'teacher' ? teacherMenuItems : studentMenuItems;
  const isTeacher = userRole === 'teacher';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menu</Text>
        <View style={styles.headerDate}>
          <Text style={styles.dateText}>{getCurrentDate()}</Text>
        </View>
      </View>

      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.avatarContainer}>
          <Ionicons 
            name={isTeacher ? 'person' : 'school'} 
            size={32} 
            color={COLORS.primary} 
          />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userData?.name || 'User'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {isTeacher ? '👨‍🏫 Teacher' : '👨‍🎓 Student'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Menu Section Title */}
        <Text style={styles.sectionTitle}>Quick Access</Text>

        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon} size={22} color={item.color} />
              </View>
              <Text style={styles.menuItemText}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.5)" />
          </TouchableOpacity>
        ))}

        {/* Settings Section */}
        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Settings</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.iconContainer, { backgroundColor: '#64748b20' }]}>
              <Ionicons name="settings-outline" size={22} color="#64748b" />
            </View>
            <Text style={styles.menuItemText}>Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.5)" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Help')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.iconContainer, { backgroundColor: '#64748b20' }]}>
              <Ionicons name="help-circle-outline" size={22} color="#64748b" />
            </View>
            <Text style={styles.menuItemText}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.5)" />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity 
          style={styles.logoutItem} 
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.iconContainer, { backgroundColor: '#ef444420' }]}>
              <Ionicons name="log-out-outline" size={22} color="#ef4444" />
            </View>
            <Text style={[styles.menuItemText, { color: '#ef4444' }]}>Log Out</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ef444480" />
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '700',
  },
  headerDate: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dateText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  roleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 13,
    color: COLORS.white,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  versionText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default MenuScreen;