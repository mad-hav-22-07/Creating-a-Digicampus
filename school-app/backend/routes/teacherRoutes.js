import express from 'express';
import {
  getAllTeachers,
  getTeacherProfile,
  getTeacherById,
  getTeacherDashboard,
  updateTeacherProfile,
  deleteTeacher,
} from '../controllers/teacherController.js';
import { authenticateToken, isTeacher } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (Teacher only)
router.get('/profile', authenticateToken, isTeacher, getTeacherProfile);
router.get('/dashboard', authenticateToken, isTeacher, getTeacherDashboard);
router.put('/profile', authenticateToken, isTeacher, updateTeacherProfile);

// Protected routes (All authenticated users)
router.get('/', authenticateToken, getAllTeachers);
router.get('/:id', authenticateToken, getTeacherById);

// Admin-only route (for now, any teacher can delete)
router.delete('/:id', authenticateToken, isTeacher, deleteTeacher);

export default router;