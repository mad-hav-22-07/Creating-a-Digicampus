import express from 'express';
import {
  getAllStudents,
  getStudentsByClass,
  getStudentProfile,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentDashboard,
  getFullStudents
} from '../controllers/studentController.js';
import { authenticateToken, isTeacher, isStudent } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (Student only)
router.get('/profile', authenticateToken, isStudent, getStudentProfile);
router.get('/dashboard', authenticateToken, isStudent, getStudentDashboard);
router.get('/', authenticateToken, isTeacher, getFullStudents);

// Protected routes (Teacher only)
router.get('/', authenticateToken, isTeacher, getAllStudents);
router.get('/class/:classId', authenticateToken, isTeacher, getStudentsByClass);
router.get('/:id', authenticateToken, isTeacher, getStudentById);
router.put('/:id', authenticateToken, isTeacher, updateStudent);
router.delete('/:id', authenticateToken, isTeacher, deleteStudent);

export default router;