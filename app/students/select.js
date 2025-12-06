import { useLocalSearchParams } from "expo-router";
import EditClassSelector from "../../src/screens/EditClassSelector";

export default function SelectClassPage() {
  const params = useLocalSearchParams();
  const classes = params.classes ? JSON.parse(params.classes) : [];
  return <EditClassSelector classes={classes} />;
}
