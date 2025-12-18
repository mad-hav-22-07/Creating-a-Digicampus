import pool from '../config/db.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';





// ✅ Get ALL students (Teacher only)
export const getFullStudents = asyncHandler(async (req, res, next) => {
  const result = await pool.query(`
    SELECT 
      s.student_id,
      s.username,
      s.full_name,
      s.roll_no,
      s.class_id,
      c.class_name,
      c.section_name
    FROM students s
    LEFT JOIN classes c ON s.class_id = c.class_id
    ORDER BY 
      c.class_name NULLS FIRST,
      c.section_name NULLS FIRST,
      s.roll_no NULLS LAST
  `);

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows,
  });
});



// Get all students
export const getAllStudents = asyncHandler(async (req, res, next) => {
  const result = await pool.query(`
    SELECT 
      s.student_id,
      s.username,
      s.full_name,
      s.roll_no,
      s.class_id,
      c.class_name,
      c.section_name
    FROM students s
    JOIN classes c ON s.class_id = c.class_id
    ORDER BY c.class_name, c.section_name, s.roll_no
  `);

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows,
  });
});

// Get students by class
export const getStudentsByClass = asyncHandler(async (req, res, next) => {
  const { classId } = req.params;

  const result = await pool.query(
    `SELECT 
      student_id,
      username,
      full_name,
      roll_no
    FROM students
    WHERE class_id = $1
    ORDER BY roll_no`,
    [classId]
  );

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows,
  });
});

// Get student profile (own)
export const getStudentProfile = asyncHandler(async (req, res, next) => {
  const studentId = req.user.userId;

  const result = await pool.query(
    `SELECT 
      s.student_id,
      s.username,
      s.full_name,
      s.roll_no,
      c.class_id,
      c.class_name,
      c.section_name,
      t.full_name as class_teacher_name
    FROM students s
    JOIN classes c ON s.class_id = c.class_id
    LEFT JOIN teachers t ON c.class_teacher_id = t.teacher_id
    WHERE s.student_id = $1`,
    [studentId]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Student not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: result.rows[0],
  });
});

// Get student by ID (Teacher can view)
export const getStudentById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    `SELECT 
      s.student_id,
      s.username,
      s.full_name,
      s.roll_no,
      c.class_id,
      c.class_name,
      c.section_name,
      t.full_name as class_teacher_name
    FROM students s
    JOIN classes c ON s.class_id = c.class_id
    LEFT JOIN teachers t ON c.class_teacher_id = t.teacher_id
    WHERE s.student_id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Student not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: result.rows[0],
  });
});

// Update student (Teacher only)
export const updateStudent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { full_name, roll_no, class_id } = req.body;

  const result = await pool.query(
    'UPDATE students SET full_name = COALESCE($1, full_name), roll_no = COALESCE($2, roll_no), class_id = COALESCE($3, class_id) WHERE student_id = $4 RETURNING *',
    [full_name, roll_no, class_id, id]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Student not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Student updated successfully',
    data: result.rows[0],
  });
});

// Delete student (Teacher only)
export const deleteStudent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    'DELETE FROM students WHERE student_id = $1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Student not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Student deleted successfully',
  });
});

// Get student dashboard (combined info)
export const getStudentDashboard = asyncHandler(async (req, res, next) => {
  const studentId = req.user.userId;

  // Get student info
  const studentInfo = await pool.query(
    `SELECT 
      s.student_id,
      s.full_name,
      s.roll_no,
      c.class_name,
      c.section_name,
      t.full_name as class_teacher_name
    FROM students s
    JOIN classes c ON s.class_id = c.class_id
    LEFT JOIN teachers t ON c.class_teacher_id = t.teacher_id
    WHERE s.student_id = $1`,
    [studentId]
  );

  if (studentInfo.rows.length === 0) {
    return next(new AppError('Student not found', 404));
  }

  const student = studentInfo.rows[0];

  // Get attendance stats
  const attendanceStats = await pool.query(
    `SELECT 
      COUNT(*) as total_days,
      SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present_days,
      ROUND((SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END)::numeric / COUNT(*)::numeric) * 100, 2) as percentage
    FROM attendance
    WHERE student_id = $1`,
    [studentId]
  );

  // Get recent marks
  const recentMarks = await pool.query(
    `SELECT 
      m.marks_scored,
      e.exam_name,
      e.max_marks,
      sub.subject_name
    FROM marks m
    JOIN exams e ON m.exam_id = e.exam_id
    JOIN subjects sub ON m.subject_id = sub.subject_id
    WHERE m.student_id = $1
    ORDER BY m.created_at DESC
    LIMIT 5`,
    [studentId]
  );

  // Get pending leave requests
  const pendingLeaves = await pool.query(
    `SELECT COUNT(*) as count
    FROM notifications
    WHERE type = 'LEAVE_REQUEST' AND created_by_student = $1 AND status = 'PENDING'`,
    [studentId]
  );

  res.status(200).json({
    status: 'success',
    data: {
      student: student,
      attendance: attendanceStats.rows[0] || { total_days: 0, present_days: 0, percentage: 0 },
      recentMarks: recentMarks.rows,
      pendingLeaves: parseInt(pendingLeaves.rows[0].count),
    },
  });
});