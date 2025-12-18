import express from 'express';
import {
  createSubject,
  getAllSubjects,
  getSubjectsByClass,
  getSubjectsByTeacher,
  updateSubject,
  deleteSubject,
} from '../controllers/subjectController.js';
import { authenticateToken, isTeacher } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (Teacher only)
router.post('/', authenticateToken, isTeacher, createSubject);
router.get('/my-subjects', authenticateToken, isTeacher, getSubjectsByTeacher);
router.put('/:id', authenticateToken, isTeacher, updateSubject);
router.delete('/:id', authenticateToken, isTeacher, deleteSubject);

// Protected routes (All authenticated users)
router.get('/', authenticateToken, getAllSubjects);
router.get('/class/:classId', authenticateToken, getSubjectsByClass);

export default router;