import express from 'express';
import {
  addOrUpdateMarks,
  getMarksByExam,
  getStudentMarks,
  getMarksByStudentId,
  getMarksByExamAndStudent,
  getClassPerformance,
  deleteMarks,
  getRankListByExam,
  getMyMarksByExam,
} from '../controllers/marksController.js';
import { authenticateToken, isTeacher, isStudent } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (Teacher only)
router.post('/', authenticateToken, isTeacher, addOrUpdateMarks);
router.get('/exam/:examId', authenticateToken, isTeacher, getMarksByExam);
router.get('/student/:studentId', authenticateToken, isTeacher, getMarksByStudentId);
router.get('/exam/:examId/student/:studentId', authenticateToken, isTeacher, getMarksByExamAndStudent);
router.get('/exam/:examId/performance', authenticateToken, isTeacher, getClassPerformance);
router.delete('/:id', authenticateToken, isTeacher, deleteMarks);
router.get('/exam/:examId/ranklist', authenticateToken, isTeacher, getRankListByExam);

// Protected routes (Student only)
router.get('/my-marks', authenticateToken, isStudent, getStudentMarks);
router.get('/exam/:examId/my-marks', authenticateToken, isStudent, getMyMarksByExam);

export default router;