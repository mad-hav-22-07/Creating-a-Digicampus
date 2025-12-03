// app/admin/classManagement/styles.js
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // ---------- SCREEN + CURVED HEADER ----------
  screenWrapper: {
    flex: 1,
    backgroundColor: "#1C5A52",
  },

  curvedHeader: {
    backgroundColor: "#1C5A52",
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-end", // pushes everything to the right
    alignItems: "center",
    width: "100%",
    position: "absolute",
    top: 55,
    right: 20,
  },

  dateText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  headerTitleBox: {
    marginTop: 16,
    alignItems: "center",
  },

  headerTitleIcon: {
    fontSize: 40,
    color: "#fff",
  },

  headerTitleText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    marginTop: 6,
    textAlign: "center",
  },

  whiteContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginTop: -24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  // ---------- GRID MENU ----------
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 18,
    marginTop: 10,
  },

  menuCard: {
    width: "47%",
    backgroundColor: "#FFEBDD",
    paddingVertical: 22,
    paddingHorizontal: 16,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  menuCardIcon: {
    fontSize: 30,
    marginBottom: 10,
  },

  menuCardLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C1C1C",
    lineHeight: 20,
  },

  // ---------- TOP BAR (if still used) ----------
  topBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 12,
    backgroundColor: "#1C5A52",
  },
  topButton: { flex: 1, alignItems: "center", paddingVertical: 10 },
  topButtonActive: { backgroundColor: "#174A44" },
  topButtonText: { fontWeight: "600", color: "#fff" },

  // ---------- TITLES ----------
  mainTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1C5A52",
    marginBottom: 4,
  },
  paragraph: { marginTop: 8, color: "#4b5563", fontSize: 14 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1C",
    marginBottom: 10,
  },

  // ---------- INPUT ----------
  inputGroup: { marginBottom: 14 },
  label: { fontWeight: "700", marginBottom: 6, color: "#1C1C1C" },

  textInput: {
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#ffffff",
    fontSize: 15,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 14,
  },

  // ---------- BUTTONS ----------
  primaryButton: {
    backgroundColor: "#1C5A52",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#ECECEC",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  cancelButtonText: { color: "#374151", fontWeight: "700", fontSize: 16 },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 6,
  },
  addButtonText: { fontWeight: "700", color: "#1C5A52" },

  // ---------- SUBJECT ROW ----------
  subjectRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  subjectInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
  },
  smallCircle: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: "#FCECEC",
  },

  // ---------- LIST ITEMS ----------
  listRow: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 14,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  itemTitle: { fontWeight: "800", fontSize: 17, color: "#1C1C1C" },
  itemMeta: { color: "#6b7280", fontSize: 13, marginTop: 2 },
  itemSubjects: {
    color: "#1C5A52",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "600",
  },

  rowActions: { justifyContent: "space-between", marginLeft: 10 },

  iconButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#E9F4F2",
    alignItems: "center",
  },
  smallIconText: { fontSize: 11, marginTop: 2, color: "#374151" },

  emptyText: {
    color: "#6b7280",
    fontStyle: "italic",
    marginTop: 8,
  },

  emptyTextRed: { color: "#ef4444", fontWeight: "600" },

  subjectsBox: {
    borderWidth: 1,
    borderColor: "#DDE7E5",
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#F7FFFD",
    marginBottom: 12,
  },

  // ---------- CHECKBOX ----------
  checkboxUnchecked: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#1C5A52",
    borderRadius: 6,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: "#1C5A52",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  // ---------- EXAM SCHEDULE ----------
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
    justifyContent: "space-between",
  },
  scheduleText: {
    flex: 1,
    fontWeight: "600",
    color: "#1C1C1C",
  },

  // ---------- GRADE SCALE ----------
  gradesBox: { marginBottom: 16 },
  gradeRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  gradeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    textAlign: "center",
    fontSize: 14,
  },

  smallBold: { fontWeight: "700", marginBottom: 6 },

  gradeTag: {
    backgroundColor: "#E7F7F5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 6,
    marginTop: 6,
  },
  gradeTagText: {
    fontWeight: "700",
    color: "#1C5A52",
    fontSize: 12,
  },

  // ---------- BACK BUTTON ----------
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,

    // ⬆️ move upward
    marginTop: -5, // adjust between -5 to -20 depending on your design
  },
  backAbsolute: {
    position: "absolute",
    top: 20, // ← raise it higher
    left: 20,
    zIndex: 999,
  },
  headerRowRight: {
    width: "100%",
    alignItems: "flex-end",
    paddingRight: 4,
  },

  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C5A52",
  },
});
