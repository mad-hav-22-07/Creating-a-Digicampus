// app/admin/classManagement/styles.js
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // ---------- SCREEN + HEADER ----------
  screenWrapper: {
    flex: 1,
    backgroundColor: "#1C5A52",
  },

  headerBackground: {
    width: "100%",
    height: 250,
    justifyContent: "flex-start",
    paddingTop: 70,
    paddingHorizontal: 20,
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    marginBottom: 6,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1C",
    fontFamily: "Poppins_600SemiBold",
  },

  headerImageStyle: {
    width: "115%",
    height: "160%",
    resizeMode: "cover",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  dateRightBox: {
    width: "100%",
    alignItems: "flex-end",
    paddingRight: 8,
    marginBottom: 10,
  },

  dateText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
  },

  headerTitleBox: {
    alignItems: "center",
    marginTop: 6,
  },

  headerTitleText: {
    fontSize: 26,
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    marginTop: 4,
  },

  // ---------- WHITE CONTENT CONTAINER ----------
  whiteContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: -24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 26,
  },

  // ---------- GRID MENU ----------
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 18,
    marginTop: 14,
  },

  menuCard: {
    width: "47%",
    backgroundColor: "#FFEBDD",
    paddingVertical: 22,
    paddingHorizontal: 16,
    borderRadius: 18,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  menuCardIcon: {
    marginBottom: 10,
  },

  menuCardLabel: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
    color: "#1C1C1C",
    lineHeight: 20,
  },

  // ---------- SECTION TITLE ----------
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: "#1C1C1C",
    marginBottom: 12,
  },

  // ---------- INPUT ----------
  inputGroup: { marginBottom: 14 },

  label: {
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 6,
    color: "#1C1C1C",
  },

  textInput: {
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 14,
  },

  // ---------- BUTTONS ----------
  primaryButton: {
    backgroundColor: "#1C5A52",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },

  addButtonText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#1C5A52",
  },

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
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#fff",
    fontFamily: "Poppins_400Regular",
  },

  // ---------- LIST ----------
  listRow: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  itemTitle: {
    fontSize: 17,
    color: "#1C1C1C",
    fontFamily: "Poppins_700Bold",
  },

  itemMeta: {
    color: "#6b7280",
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
    marginTop: 2,
  },

  itemSubjects: {
    color: "#1C5A52",
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
    marginTop: 6,
  },

  rowActions: {
    justifyContent: "space-between",
    marginLeft: 8,
  },

  // ---------- CHECKBOX ----------
  checkboxUnchecked: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#1C5A52",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxChecked: {
    width: 22,
    height: 22,
    backgroundColor: "#1C5A52",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  // ---------- SCHEDULE ----------
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  scheduleText: {
    flex: 1,
    fontFamily: "Poppins_600SemiBold",
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
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },

  gradeTag: {
    backgroundColor: "#E7F7F5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 6,
    marginTop: 6,
  },

  gradeTagText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#1C5A52",
    fontSize: 12,
  },

  emptyText: {
    color: "#6b7280",
    fontFamily: "Poppins_400Regular",
    fontStyle: "italic",
  },

  emptyTextRed: {
    color: "#ef4444",
    fontFamily: "Poppins_600SemiBold",
  },

  // ---------- BACK BUTTON ----------
  backAbsolute: {
    position: "absolute",
    top: 45, // perfect position
    left: 20,
    zIndex: 999,
  },
});
