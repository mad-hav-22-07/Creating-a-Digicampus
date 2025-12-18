import pool from '../config/db.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

// Create timetable entry
export const createTimetableEntry = asyncHandler(async (req, res, next) => {
  const { class_id, subject_id, day_of_week, period_number, start_time, end_time } = req.body;

  if (!class_id || !subject_id || !day_of_week || !period_number || !start_time || !end_time) {
    return next(new AppError('All fields are required', 400));
  }

  // Check for conflicts
  const conflict = await pool.query(
    'SELECT * FROM timetable WHERE class_id = $1 AND day_of_week = $2 AND period_number = $3',
    [class_id, day_of_week, period_number]
  );

  if (conflict.rows.length > 0) {
    return next(new AppError('Time slot already occupied for this class', 409));
  }

  const result = await pool.query(
    'INSERT INTO timetable (class_id, subject_id, day_of_week, period_number, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [class_id, subject_id, day_of_week, period_number, start_time, end_time]
  );

  res.status(201).json({
    status: 'success',
    message: 'Timetable entry created successfully',
    data: result.rows[0],
  });
});

// Get timetable for a specific class
export const getTimetableByClass = asyncHandler(async (req, res, next) => {
  const { classId } = req.params;

  const result = await pool.query(
    `SELECT 
      t.*,
      s.subject_name,
      te.full_name as teacher_name
    FROM timetable t
    JOIN subjects s ON t.subject_id = s.subject_id
    LEFT JOIN teachers te ON s.teacher_id = te.teacher_id
    WHERE t.class_id = $1
    ORDER BY 
      CASE day_of_week
        WHEN 'Monday' THEN 1
        WHEN 'Tuesday' THEN 2
        WHEN 'Wednesday' THEN 3
        WHEN 'Thursday' THEN 4
        WHEN 'Friday' THEN 5
      END,
      t.period_number`,
    [classId]
  );

  // Group by day
  const timetable = result.rows.reduce((acc, row) => {
    if (!acc[row.day_of_week]) {
      acc[row.day_of_week] = [];
    }
    acc[row.day_of_week].push(row);
    return acc;
  }, {});

  res.status(200).json({
    status: 'success',
    data: timetable,
  });
});

// Get timetable for a student (based on their class)
export const getStudentTimetable = asyncHandler(async (req, res, next) => {
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
      t.*,
      s.subject_name,
      te.full_name as teacher_name
    FROM timetable t
    JOIN subjects s ON t.subject_id = s.subject_id
    LEFT JOIN teachers te ON s.teacher_id = te.teacher_id
    WHERE t.class_id = $1
    ORDER BY 
      CASE day_of_week
        WHEN 'Monday' THEN 1
        WHEN 'Tuesday' THEN 2
        WHEN 'Wednesday' THEN 3
        WHEN 'Thursday' THEN 4
        WHEN 'Friday' THEN 5
      END,
      t.period_number`,
    [classId]
  );

  // Group by day
  const timetable = result.rows.reduce((acc, row) => {
    if (!acc[row.day_of_week]) {
      acc[row.day_of_week] = [];
    }
    acc[row.day_of_week].push(row);
    return acc;
  }, {});

  res.status(200).json({
    status: 'success',
    data: timetable,
  });
});

// Get teacher's timetable (all classes they teach)
export const getTeacherTimetable = asyncHandler(async (req, res, next) => {
  const teacherId = req.user.userId;

  const result = await pool.query(
    `SELECT 
      t.*,
      s.subject_name,
      c.class_name,
      c.section_name
    FROM timetable t
    JOIN subjects s ON t.subject_id = s.subject_id
    JOIN classes c ON t.class_id = c.class_id
    WHERE s.teacher_id = $1
    ORDER BY 
      CASE day_of_week
        WHEN 'Monday' THEN 1
        WHEN 'Tuesday' THEN 2
        WHEN 'Wednesday' THEN 3
        WHEN 'Thursday' THEN 4
        WHEN 'Friday' THEN 5
      END,
      t.period_number`,
    [teacherId]
  );

  // Group by day
  const timetable = result.rows.reduce((acc, row) => {
    if (!acc[row.day_of_week]) {
      acc[row.day_of_week] = [];
    }
    acc[row.day_of_week].push(row);
    return acc;
  }, {});

  res.status(200).json({
    status: 'success',
    data: timetable,
  });
});

// Get today's schedule for teacher
export const getTeacherTodaySchedule = asyncHandler(async (req, res, next) => {
  const teacherId = req.user.userId;
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];

  const result = await pool.query(
    `SELECT 
      t.*,
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

  res.status(200).json({
    status: 'success',
    day: today,
    results: result.rows.length,
    data: result.rows,
  });
});

// Update timetable entry
export const updateTimetableEntry = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { subject_id, day_of_week, period_number, start_time, end_time } = req.body;

  const result = await pool.query(
    'UPDATE timetable SET subject_id = COALESCE($1, subject_id), day_of_week = COALESCE($2, day_of_week), period_number = COALESCE($3, period_number), start_time = COALESCE($4, start_time), end_time = COALESCE($5, end_time) WHERE timetable_id = $6 RETURNING *',
    [subject_id, day_of_week, period_number, start_time, end_time, id]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Timetable entry not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Timetable updated successfully',
    data: result.rows[0],
  });
});

// Delete timetable entry
export const deleteTimetableEntry = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    'DELETE FROM timetable WHERE timetable_id = $1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Timetable entry not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Timetable entry deleted successfully',
  });
});