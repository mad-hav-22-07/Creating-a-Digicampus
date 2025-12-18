import express from 'express';
import {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  getTeacherClasses,
} from '../controllers/classController.js';
import { authenticateToken, isTeacher } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (Teacher only)
router.post('/', authenticateToken, isTeacher, createClass);
router.get('/my-classes', authenticateToken, isTeacher, getTeacherClasses);
router.put('/:id', authenticateToken, isTeacher, updateClass);
router.delete('/:id', authenticateToken, isTeacher, deleteClass);

// Protected routes (All authenticated users)
router.get('/', authenticateToken, getAllClasses);
router.get('/:id', authenticateToken, getClassById);


// Update class
router.put('/assign-class', authenticateToken, isTeacher, async (req, res) => {
  const { class_id, student_ids } = req.body;

  await pool.query(
    'UPDATE students SET class_id = $1 WHERE student_id = ANY($2::int[])',
    [class_id, student_ids]
  );

  res.status(200).json({
    status: 'success',
    message: 'Students assigned to class',
  });
});



export default router;