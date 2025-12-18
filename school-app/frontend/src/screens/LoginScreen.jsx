import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { authAPI } from '../services/api';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('teacher');

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);

    try {
      if (selectedRole === 'teacher') {
        const response = await authAPI.loginTeacher({ username, password });
        const teacher = response?.teacher;

        if (!teacher) {
          Alert.alert('Error', 'Unexpected server response');
          return;
        }

        navigation.replace('Dashboard', { role: 'teacher' });
        Alert.alert('Success', `Welcome back, ${teacher.full_name}!`);
      } else {
        const response = await authAPI.loginStudent({ username, password });
        const student = response?.student;

        if (!student) {
          Alert.alert('Error', 'Unexpected server response');
          return;
        }

        navigation.replace('Dashboard', { role: 'student' });
        Alert.alert('Success', `Welcome back, ${student.full_name}!`);
      }
    } catch (error) {
      Alert.alert(
        'Login Failed',
        error.message || 'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register', { role: selectedRole });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* HEADER */}
      <View style={styles.headerSection}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons
            name="school"
            size={32}
            color={COLORS.white}
          />
        </View>

        <Text style={styles.welcomeTitle}>Welcome</Text>
        <Text style={styles.welcomeSubtitle}>Sign in to continue</Text>

        <View style={styles.illustrationContainer}>
          <View style={[styles.floatingIcon, { top: 30, right: 60 }]}>
            <Ionicons
              name="book-outline"
              size={28}
              color={COLORS.primary}
              opacity={0.7}
            />
          </View>

          <View style={[styles.floatingIcon, { top: 60, right: 15 }]}>
            <Ionicons
              name="laptop-outline"
              size={32}
              color={COLORS.primary}
              opacity={0.7}
            />
          </View>

          <MaterialCommunityIcons
            name="book-open-page-variant"
            size={96}
            color={COLORS.primary}
            opacity={0.8}
          />
        </View>
      </View>

      {/* FORM */}
      <View style={styles.formSection}>
        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>Login as:</Text>

          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole === 'teacher' && styles.roleButtonActive,
              ]}
              onPress={() => setSelectedRole('teacher')}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={
                  selectedRole === 'teacher'
                    ? COLORS.white
                    : COLORS.primary
                }
              />
              <Text
                style={[
                  styles.roleButtonText,
                  selectedRole === 'teacher' &&
                    styles.roleButtonTextActive,
                ]}
              >
                Teacher
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole === 'student' && styles.roleButtonActive,
              ]}
              onPress={() => setSelectedRole('student')}
            >
              <Ionicons
                name="school-outline"
                size={20}
                color={
                  selectedRole === 'student'
                    ? COLORS.white
                    : COLORS.primary
                }
              />
              <Text
                style={[
                  styles.roleButtonText,
                  selectedRole === 'student' &&
                    styles.roleButtonTextActive,
                ]}
              >
                Student
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor={COLORS.textMuted}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={COLORS.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        <Text style={styles.forgotPassword}>Forgot Password?</Text>

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.registerLinkText}>
            Don't have an account?{' '}
            <Text style={styles.registerLinkBold}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    flexGrow: 1,
  },

  /* HEADER */
  headerSection: {
    paddingTop: 60,
    paddingBottom: 20, // ✅ reduced
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.white,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 4,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginTop: 20,
    height: 140,
    position: 'relative',
  },
  floatingIcon: {
    position: 'absolute',
  },

  /* FORM CARD */
  formSection: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: -30, // ✅ overlap fix
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  roleContainer: {
    marginBottom: 16,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 10,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    gap: 8,
  },
  roleButtonActive: {
    backgroundColor: COLORS.primary,
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  roleButtonTextActive: {
    color: COLORS.white,
  },

  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.text,
  },

  forgotPassword: {
    textAlign: 'right',
    color: COLORS.textLight,
    fontSize: 14,
    marginBottom: 24,
  },

  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },

  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerLinkText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  registerLinkBold: {
    fontWeight: '700',
    color: COLORS.primary,
  },
});

export default LoginScreen;
