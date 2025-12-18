import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MenuScreen from '../screens/MenuScreen';
import ClassManagementScreen from '../screens/ClassManagementScreen';
import CreateClassScreen from '../screens/CreateClassScreen';
import StudentDataScreen from '../screens/StudentDataScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import NotificationsScreen from '../screens/NotificationScreen';
import ViewGradesScreen from '../screens/ViewGradesScreen';
import MarksEntryScreen from '../screens/MarksEntryScreen';

// Student Screens
import StudentGradesScreen from '../screens/StudentGradesScreen';
import StudentExamDetailsScreen from '../screens/StudentExamDetailsScreen';
import StudentAttendanceScreen from '../screens/StudentAttendanceScreen';
import StudentAssignmentsScreen from '../screens/StudentAssignmentsScreen';
import StudentTimetableScreen from '../screens/StudentTimetableScreen';

import { COLORS } from '../constants/colors';
import EditClassScreen from '../screens/EditClassScreen';
import SetMarksScreen from '../screens/SetMarksScreen';
import ViewClassScreen from '../screens/ViewClassScreen';
import EditClassDetailsScreen from '../screens/EditClassScreen';
import SetMarksByClassScreen from '../screens/SetMarksByClassScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: COLORS.background },
          }}
        >
          {/* Auth Screens */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          
          {/* Common Screens */}
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
<Stack.Screen 
  name="Profile" 
  component={ProfileScreen}
  options={{ headerShown: false }}
/>
          {/* Teacher Screens */}
          <Stack.Screen name="ClassManagement" component={ClassManagementScreen} />
          <Stack.Screen name="CreateClass" component={CreateClassScreen} />
          <Stack.Screen name="EditClassDetails" component={EditClassDetailsScreen} />
          <Stack.Screen name="SetMarksByClass" component={SetMarksByClassScreen} />
          <Stack.Screen name="EditClass" component={EditClassScreen} />
          <Stack.Screen name="SetMarks" component={SetMarksScreen} />
          <Stack.Screen name="ViewClass" component={ViewClassScreen} />
          <Stack.Screen name="StudentData" component={StudentDataScreen} />
          <Stack.Screen name="Attendance" component={AttendanceScreen} />
          <Stack.Screen name="ViewGrades" component={ViewGradesScreen} />
          <Stack.Screen name="MarksEntry" component={MarksEntryScreen} />

          {/* Student Screens */}
          <Stack.Screen name="StudentGrades" component={StudentGradesScreen} />
          <Stack.Screen name="StudentExamDetails" component={StudentExamDetailsScreen} />
          <Stack.Screen name="StudentAttendance" component={StudentAttendanceScreen} />
          <Stack.Screen name="StudentAssignments" component={StudentAssignmentsScreen} />
          <Stack.Screen name="StudentTimetable" component={StudentTimetableScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;