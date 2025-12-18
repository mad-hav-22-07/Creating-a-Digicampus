import express from 'express';
import {
  createTimetableEntry,
  getTimetableByClass,
  getStudentTimetable,
  getTeacherTimetable,
  getTeacherTodaySchedule,
  updateTimetableEntry,
  deleteTimetableEntry,
} from '../controllers/timetableController.js';
import { authenticateToken, isTeacher, isStudent } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (Teacher only)
router.post('/', authenticateToken, isTeacher, createTimetableEntry);
router.get('/my-timetable', authenticateToken, isTeacher, getTeacherTimetable);
router.get('/today', authenticateToken, isTeacher, getTeacherTodaySchedule);
router.put('/:id', authenticateToken, isTeacher, updateTimetableEntry);
router.delete('/:id', authenticateToken, isTeacher, deleteTimetableEntry);

// Protected routes (Student only)
router.get('/student/my-timetable', authenticateToken, isStudent, getStudentTimetable);

// Protected routes (All authenticated users)
router.get('/class/:classId', authenticateToken, getTimetableByClass);

export default router;