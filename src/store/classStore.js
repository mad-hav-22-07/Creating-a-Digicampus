import { create } from "zustand";

export const useClassStore = create((set) => ({
  // =========================================
  // GLOBAL CLASS STATE
  // =========================================
  classes: [
    {
      id: "8",
      name: "Class 8",
      students: [
        { id: "1", roll: 1, name: "Rahul" },
        { id: "2", roll: 2, name: "Meera" },
      ],
    },
    {
      id: "9",
      name: "Class 9",
      students: [{ id: "1", roll: 1, name: "Anju" }],
    },
  ],

  // =========================================
  // SET ALL CLASSES
  // =========================================
  setClasses: (newValue) =>
    set((state) => ({
      classes:
        typeof newValue === "function" ? newValue(state.classes) : newValue,
    })),

  // =========================================
  // ADD NEW CLASS
  // =========================================
  addClass: (classId, students = []) =>
    set((state) => {
      if (state.classes.some((c) => c.id === classId)) return state;
      return {
        classes: [
          ...state.classes,
          {
            id: classId,
            name: `Class ${classId}`,
            students: [...students].sort((a, b) => a.roll - b.roll),
          },
        ],
      };
    }),

  // =========================================
  // REPLACE STUDENTS OF A CLASS (auto-sort)
  // =========================================
  replaceClassStudents: (classId, newStudents) =>
    set((state) => ({
      classes: state.classes.map((cls) =>
        cls.id === classId
          ? {
              ...cls,
              students: [...newStudents].sort((a, b) => a.roll - b.roll),
            }
          : cls
      ),
    })),

  // =========================================
  // ADD ONE STUDENT (validate + auto-sort)
  // =========================================
  addStudent: (classId, student) =>
    set((state) => {
      const cls = state.classes.find((c) => c.id === classId);
      if (!cls) return state;

      // ❌ prevent duplicate roll
      if (cls.students.some((s) => s.roll === student.roll)) {
        alert(`Roll number ${student.roll} already exists.`);
        return state;
      }

      // ❌ prevent invalid roll
      if (student.roll < 1 || !Number.isInteger(student.roll)) {
        alert("Invalid roll number.");
        return state;
      }

      const updated = [...cls.students, student].sort(
        (a, b) => a.roll - b.roll
      );

      return {
        classes: state.classes.map((c) =>
          c.id === classId ? { ...c, students: updated } : c
        ),
      };
    }),

  // =========================================
  // UPDATE ONE STUDENT (validate + auto-sort)
  // =========================================
  updateStudent: (classId, studentId, updates) =>
    set((state) => {
      const cls = state.classes.find((c) => c.id === classId);
      if (!cls) return state;

      const newRoll = updates.roll;

      // ❌ invalid roll
      if (newRoll < 1 || !Number.isInteger(newRoll)) {
        alert("Roll number must be a positive integer.");
        return state;
      }

      // ❌ duplicate roll (ignore if same student)
      const duplicate = cls.students.some(
        (s) => s.id !== studentId && s.roll === newRoll
      );
      if (duplicate) {
        alert(`Roll number ${newRoll} already exists.`);
        return state;
      }

      const updatedStudents = cls.students
        .map((s) => (s.id === studentId ? { ...s, ...updates } : s))
        .sort((a, b) => a.roll - b.roll);

      return {
        classes: state.classes.map((c) =>
          c.id === classId ? { ...c, students: updatedStudents } : c
        ),
      };
    }),

  // =========================================
  // DELETE ONE STUDENT
  // =========================================
  deleteStudent: (classId, studentId) =>
    set((state) => ({
      classes: state.classes.map((cls) =>
        cls.id === classId
          ? {
              ...cls,
              students: cls.students.filter((s) => s.id !== studentId),
            }
          : cls
      ),
    })),

  // =========================================
  // DELETE ENTIRE CLASS
  // =========================================
  deleteClass: (classId) =>
    set((state) => ({
      classes: state.classes.filter((cls) => cls.id !== classId),
    })),
}));
