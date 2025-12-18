import express from 'express';
import {
  markAttendance,
  getAttendanceByClassAndDate,
  getStudentAttendance,
  getClassAttendanceStats,
  getAttendanceByStudentId,
  deleteAttendance,
} from '../controllers/attendanceController.js';
import { authenticateToken, isTeacher, isStudent } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (Teacher only)
router.post('/mark', authenticateToken, isTeacher, markAttendance);
router.get('/class/:classId/date/:date', authenticateToken, isTeacher, getAttendanceByClassAndDate);
router.get('/class/:classId/stats', authenticateToken, isTeacher, getClassAttendanceStats);
router.get('/student/:studentId', authenticateToken, isTeacher, getAttendanceByStudentId);
router.delete('/:id', authenticateToken, isTeacher, deleteAttendance);

// Protected routes (Student only)
router.get('/my-attendance', authenticateToken, isStudent, getStudentAttendance);

export default router;