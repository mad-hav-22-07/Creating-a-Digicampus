import pool from '../config/db.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

// Create announcement (Teacher to class)
export const createAnnouncement = asyncHandler(async (req, res, next) => {
  const { content, target_class_id } = req.body;
  const teacherId = req.user.userId;

  if (!content || !target_class_id) {
    return next(new AppError('Content and target class are required', 400));
  }

  const result = await pool.query(
    'INSERT INTO notifications (type, content, created_by_teacher, target_class_id) VALUES ($1, $2, $3, $4) RETURNING *',
    ['ANNOUNCEMENT', content, teacherId, target_class_id]
  );

  res.status(201).json({
    status: 'success',
    message: 'Announcement created successfully',
    data: result.rows[0],
  });
});

// Create leave request (Student to teacher)
export const createLeaveRequest = asyncHandler(async (req, res, next) => {
  const { content, target_teacher_id } = req.body;
  const studentId = req.user.userId;

  if (!content) {
    return next(new AppError('Content is required', 400));
  }

  const result = await pool.query(
    'INSERT INTO notifications (type, content, created_by_student, target_teacher_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    ['LEAVE_REQUEST', content, studentId, target_teacher_id || null, 'PENDING']
  );

  res.status(201).json({
    status: 'success',
    message: 'Leave request submitted successfully',
    data: result.rows[0],
  });
});

// Get all announcements for a student's class
export const getStudentAnnouncements = asyncHandler(async (req, res, next) => {
  const studentId = req.user.userId;

  // Get student's class
  const studentResult = await pool.query(
    'SELECT class_id FROM students WHERE student_id = $1',
    [studentId]
  );

  if (studentResult.rows.length === 0) {
    return next(new AppError('Student not found', 404));
  }

  const classId = studentResult.rows[0].class_id;

  const result = await pool.query(
    `SELECT 
      n.*,
      t.full_name as teacher_name
    FROM notifications n
    LEFT JOIN teachers t ON n.created_by_teacher = t.teacher_id
    WHERE n.type = 'ANNOUNCEMENT' AND n.target_class_id = $1
    ORDER BY n.created_at DESC`,
    [classId]
  );

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows,
  });
});

// Get student's own leave requests
export const getStudentLeaveRequests = asyncHandler(async (req, res, next) => {
  const studentId = req.user.userId;

  const result = await pool.query(
    `SELECT 
      n.*,
      t.full_name as teacher_name
    FROM notifications n
    LEFT JOIN teachers t ON n.target_teacher_id = t.teacher_id
    WHERE n.type = 'LEAVE_REQUEST' AND n.created_by_student = $1
    ORDER BY n.created_at DESC`,
    [studentId]
  );

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows,
  });
});

// Get leave requests for a teacher
export const getTeacherLeaveRequests = asyncHandler(async (req, res, next) => {
  const teacherId = req.user.userId;

  const result = await pool.query(
    `SELECT 
      n.*,
      s.full_name as student_name,
      s.roll_no,
      c.class_name,
      c.section_name
    FROM notifications n
    JOIN students s ON n.created_by_student = s.student_id
    JOIN classes c ON s.class_id = c.class_id
    WHERE n.type = 'LEAVE_REQUEST' 
    AND (n.target_teacher_id = $1 OR n.target_teacher_id IS NULL)
    ORDER BY 
      CASE n.status
        WHEN 'PENDING' THEN 1
        WHEN 'APPROVED' THEN 2
        WHEN 'REJECTED' THEN 3
      END,
      n.created_at DESC`,
    [teacherId]
  );

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows,
  });
});

// Get announcements created by teacher
export const getTeacherAnnouncements = asyncHandler(async (req, res, next) => {
  const teacherId = req.user.userId;

  const result = await pool.query(
    `SELECT 
      n.*,
      c.class_name,
      c.section_name
    FROM notifications n
    JOIN classes c ON n.target_class_id = c.class_id
    WHERE n.type = 'ANNOUNCEMENT' AND n.created_by_teacher = $1
    ORDER BY n.created_at DESC`,
    [teacherId]
  );

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows,
  });
});

// Update leave request status (Teacher)
export const updateLeaveRequestStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
    return next(new AppError('Valid status (APPROVED/REJECTED) is required', 400));
  }

  const result = await pool.query(
    'UPDATE notifications SET status = $1 WHERE notification_id = $2 AND type = $3 RETURNING *',
    [status, id, 'LEAVE_REQUEST']
  );

  if (result.rows.length === 0) {
    return next(new AppError('Leave request not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: `Leave request ${status.toLowerCase()} successfully`,
    data: result.rows[0],
  });
});

// Get all notifications for a specific class (Teacher view)
export const getNotificationsByClass = asyncHandler(async (req, res, next) => {
  const { classId } = req.params;

  const result = await pool.query(
    `SELECT 
      n.*,
      t.full_name as teacher_name,
      s.full_name as student_name,
      s.roll_no
    FROM notifications n
    LEFT JOIN teachers t ON n.created_by_teacher = t.teacher_id
    LEFT JOIN students s ON n.created_by_student = s.student_id
    WHERE n.target_class_id = $1
    ORDER BY n.created_at DESC`,
    [classId]
  );

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows,
  });
});

// Delete notification
export const deleteNotification = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    'DELETE FROM notifications WHERE notification_id = $1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Notification not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Notification deleted successfully',
  });
});