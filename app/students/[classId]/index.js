import { useLocalSearchParams } from "expo-router";
import EditStudentList from "../../../src/screens/EditStudentList";

export default function EditStudentListPage() {
  const params = useLocalSearchParams();
  const { classId } = params;

  // Parse classes that were passed from select
  const classes = params.classes ? JSON.parse(params.classes) : [];

  return (
    <EditStudentList
      classId={classId}
      classes={classes}
      setClasses={() => {}}
    />
  );
}
