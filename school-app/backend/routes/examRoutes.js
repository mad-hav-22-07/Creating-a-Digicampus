import express from 'express';
import {
  createExam,
  getAllExams,
  getExamsByClass,
  getExamById,
  updateExam,
  deleteExam,
} from '../controllers/examController.js';
import { authenticateToken, isTeacher } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (Teacher only)
router.post('/', authenticateToken, isTeacher, createExam);
router.put('/:id', authenticateToken, isTeacher, updateExam);
router.delete('/:id', authenticateToken, isTeacher, deleteExam);

// Protected routes (All authenticated users)
router.get('/', authenticateToken, getAllExams);
router.get('/class/:classId', authenticateToken, getExamsByClass);
router.get('/:id', authenticateToken, getExamById);

export default router;