import ExamsScreen from "../../../src/Screens/ExamsScreen";
import { useSchoolStore } from "../../../src/storage/useSchoolStore";

export default function ExamsPage() {
  const { classes, exams, addExam, updateExam, deleteExam } = useSchoolStore();

  return <ExamsScreen classes={classes} exams={exams} setExams={() => {}} />;
}
