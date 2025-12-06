import { useLocalSearchParams } from "expo-router";
import ViewClassStudents from "../../src/screens/ViewClassStudents";

export default function ViewClass() {
  const { classId } = useLocalSearchParams();

  return <ViewClassStudents classId={String(classId)} />;
}
