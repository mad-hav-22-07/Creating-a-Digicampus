// app/index.jsx
import { Redirect } from "expo-router";

export default function Index() {
  // Immediately redirect to Class Management home
  return <Redirect href="/admin/classManagement" />;
}
