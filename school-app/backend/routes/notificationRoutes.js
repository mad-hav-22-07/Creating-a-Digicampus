import express from 'express';
import {
  createAnnouncement,
  createLeaveRequest,
  getStudentAnnouncements,
  getStudentLeaveRequests,
  getTeacherLeaveRequests,
  getTeacherAnnouncements,
  updateLeaveRequestStatus,
  getNotificationsByClass,
  deleteNotification,
} from '../controllers/notificationController.js';
import { authenticateToken, isTeacher, isStudent } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (Teacher only)
router.post('/announcement', authenticateToken, isTeacher, createAnnouncement);
router.get('/my-announcements', authenticateToken, isTeacher, getTeacherAnnouncements);
router.get('/leave-requests', authenticateToken, isTeacher, getTeacherLeaveRequests);
router.put('/leave-request/:id/status', authenticateToken, isTeacher, updateLeaveRequestStatus);
router.get('/class/:classId', authenticateToken, isTeacher, getNotificationsByClass);
router.delete('/:id', authenticateToken, isTeacher, deleteNotification);

// Protected routes (Student only)
router.post('/leave-request', authenticateToken, isStudent, createLeaveRequest);
router.get('/announcements', authenticateToken, isStudent, getStudentAnnouncements);
router.get('/my-leave-requests', authenticateToken, isStudent, getStudentLeaveRequests);

export default router;