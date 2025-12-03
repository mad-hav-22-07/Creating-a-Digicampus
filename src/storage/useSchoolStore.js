import { create } from "zustand";
import { saveJSON, loadJSON } from "./storage";
import { KEY_CLASSES, KEY_EXAMS } from "./ids";

export const useSchoolStore = create((set, get) => ({
  // ---------- STATE ----------
  classes: [],
  exams: [],

  // ---------- SETTERS ----------
  setClasses: (list) => {
    if (!Array.isArray(list)) list = [];
    saveJSON(KEY_CLASSES, list);
    set({ classes: list });
  },

  setExams: (list) => {
    if (!Array.isArray(list)) list = [];
    saveJSON(KEY_EXAMS, list);
    set({ exams: list });
  },

  // ---------- CRUD: CLASSES ----------
  addClass: (cls) => {
    const updated = [cls, ...get().classes];
    saveJSON(KEY_CLASSES, updated);
    set({ classes: updated });
  },

  updateClass: (cls) => {
    const updated = get().classes.map((c) => (c.id === cls.id ? cls : c));
    saveJSON(KEY_CLASSES, updated);
    set({ classes: updated });
  },

  deleteClass: (id) => {
    const updated = get().classes.filter((c) => c.id !== id);
    saveJSON(KEY_CLASSES, updated);
    set({ classes: updated });
  },

  // ---------- CRUD: EXAMS ----------
  addExam: (exam) => {
    const updated = [exam, ...get().exams];
    saveJSON(KEY_EXAMS, updated);
    set({ exams: updated });
  },

  updateExam: (exam) => {
    const updated = get().exams.map((e) => (e.id === exam.id ? exam : e));
    saveJSON(KEY_EXAMS, updated);
    set({ exams: updated });
  },

  deleteExam: (id) => {
    const updated = get().exams.filter((e) => e.id !== id);
    saveJSON(KEY_EXAMS, updated);
    set({ exams: updated });
  },

  // ---------- LOAD FROM STORAGE ----------
  loadData: async () => {
    try {
      const storedClasses = (await loadJSON(KEY_CLASSES)) || [];
      const storedExams = (await loadJSON(KEY_EXAMS)) || [];

      // Ensure arrays
      set({
        classes: Array.isArray(storedClasses) ? storedClasses : [],
        exams: Array.isArray(storedExams) ? storedExams : [],
      });
    } catch (err) {
      console.log("Load Error:", err);
      set({ classes: [], exams: [] });
    }
  },
}));
