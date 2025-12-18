import pool from '../config/db.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

// Get all teachers
export const getAllTeachers = asyncHandler(async (req, res, next) => {
  const result = await pool.query(`
    SELECT 
      teacher_id,
      username,
      full_name,
      created_at
    FROM teachers
    ORDER BY full_name
  `);

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows,
  });
});

// Get teacher profile (own)
export const getTeacherProfile = asyncHandler(async (req, res, next) => {
  const teacherId = req.user.userId;

  const result = await pool.query(
    `SELECT 
      teacher_id,
      username,
      full_name,
      created_at
    FROM teachers
    WHERE teacher_id = $1`,
    [teacherId]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Teacher not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: result.rows[0],
  });
});

// Get teacher by ID
export const getTeacherById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    `SELECT 
      teacher_id,
      username,
      full_name,
      created_at
    FROM teachers
    WHERE teacher_id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Teacher not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: result.rows[0],
  });
});

// Get teacher dashboard (combined info)
export const getTeacherDashboard = asyncHandler(async (req, res, next) => {
  const teacherId = req.user.userId;

  // Get teacher info
  const teacherInfo = await pool.query(
    'SELECT teacher_id, username, full_name FROM teachers WHERE teacher_id = $1',
    [teacherId]
  );

  if (teacherInfo.rows.length === 0) {
    return next(new AppError('Teacher not found', 404));
  }

  const teacher = teacherInfo.rows[0];

  // Get classes where teacher is class teacher
  const classTeacher = await pool.query(
    `SELECT 
      c.class_id,
      c.class_name,
      c.section_name,
      COUNT(s.student_id) as student_count
    FROM classes c
    LEFT JOIN students s ON c.class_id = s.class_id
    WHERE c.class_teacher_id = $1
    GROUP BY c.class_id`,
    [teacherId]
  );

  // Get subjects taught
  const subjects = await pool.query(
    `SELECT 
      sub.subject_id,
      sub.subject_name,
      c.class_name,
      c.section_name
    FROM subjects sub
    JOIN classes c ON sub.class_id = c.class_id
    WHERE sub.teacher_id = $1
    ORDER BY c.class_name, c.section_name`,
    [teacherId]
  );

  // Get today's schedule
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];

  const todaySchedule = await pool.query(
    `SELECT 
      t.period_number,
      t.start_time,
      t.end_time,
      s.subject_name,
      c.class_name,
      c.section_name
    FROM timetable t
    JOIN subjects s ON t.subject_id = s.subject_id
    JOIN classes c ON t.class_id = c.class_id
    WHERE s.teacher_id = $1 AND t.day_of_week = $2
    ORDER BY t.period_number`,
    [teacherId, today]
  );

  // Get pending leave requests
  const pendingLeaves = await pool.query(
    `SELECT COUNT(*) as count
    FROM notifications
    WHERE type = 'LEAVE_REQUEST' 
    AND (target_teacher_id = $1 OR target_teacher_id IS NULL)
    AND status = 'PENDING'`,
    [teacherId]
  );

  res.status(200).json({
    status: 'success',
    data: {
      teacher: teacher,
      classTeacher: classTeacher.rows,
      subjects: subjects.rows,
      todaySchedule: todaySchedule.rows,
      pendingLeaves: parseInt(pendingLeaves.rows[0].count),
    },
  });
});

// Update teacher profile
export const updateTeacherProfile = asyncHandler(async (req, res, next) => {
  const teacherId = req.user.userId;
  const { full_name } = req.body;

  const result = await pool.query(
    'UPDATE teachers SET full_name = COALESCE($1, full_name) WHERE teacher_id = $2 RETURNING teacher_id, username, full_name',
    [full_name, teacherId]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Teacher not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully',
    data: result.rows[0],
  });
});

// Delete teacher
export const deleteTeacher = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    'DELETE FROM teachers WHERE teacher_id = $1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Teacher not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Teacher deleted successfully',
  });
});