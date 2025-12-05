import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useState } from "react";

import AddStudentScreen from "./src/screens/AddStudentScreen";
import BulkEditScreen from "./src/screens/BulkEditScreen";
import EditStudentList from "./src/screens/EditStudentList";
import EditStudentScreen from "./src/screens/EditStudentScreen";
import StudentHomeScreen from "./src/screens/StudentHomeScreen";
import UploadClassData from "./src/screens/UploadClassData";
import ViewClassStudents from "./src/screens/ViewClassStudents";

const Stack = createStackNavigator();

export default function App() {
  const [classes, setClasses] = useState([]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="StudentHome">
          {(props) => (
            <StudentHomeScreen
              {...props}
              classes={classes}
              setClasses={setClasses}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="UploadClassData">
          {(props) => (
            <UploadClassData
              {...props}
              classes={classes}
              setClasses={setClasses}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="EditStudentList">
          {(props) => (
            <EditStudentList
              {...props}
              classes={classes}
              setClasses={setClasses}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="AddStudent">
          {(props) => <AddStudentScreen {...props} setClasses={setClasses} />}
        </Stack.Screen>

        <Stack.Screen name="EditStudent">
          {(props) => <EditStudentScreen {...props} setClasses={setClasses} />}
        </Stack.Screen>

        <Stack.Screen name="BulkEdit">
          {(props) => <BulkEditScreen {...props} setClasses={setClasses} />}
        </Stack.Screen>

        <Stack.Screen name="ViewClassStudents">
          {(props) => <ViewClassStudents {...props} classes={classes} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
