import express from 'express';
import authRoutes from './authRoutes.js';
import studentRoutes from './studentRoutes.js';
import teacherRoutes from './teacherRoutes.js';
import classRoutes from './classRoutes.js';
import subjectRoutes from './subjectRoutes.js';
import timetableRoutes from './timetableRoutes.js';
import attendanceRoutes from './attendanceRoutes.js';
import examRoutes from './examRoutes.js';
import marksRoutes from './marksRoutes.js';
import notificationRoutes from './notificationRoutes.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/classes', classRoutes);
router.use('/subjects', subjectRoutes);
router.use('/timetable', timetableRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/exams', examRoutes);
router.use('/marks', marksRoutes);
router.use('/notifications', notificationRoutes);

export default router;