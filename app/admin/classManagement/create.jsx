import ClassesScreen from "../../../src/Screens/ClassesScreen";
import { useSchoolStore } from "../../../src/storage/useSchoolStore";

export default function CreateClassPage() {
  const { classes, addClass, updateClass, deleteClass } = useSchoolStore();

  return (
    <ClassesScreen
      classes={classes}
      setClasses={(updated) => {
        // Smart sync depending on add/edit/delete
        if (updated.length > classes.length) addClass(updated[0]);
      }}
    />
  );
}
