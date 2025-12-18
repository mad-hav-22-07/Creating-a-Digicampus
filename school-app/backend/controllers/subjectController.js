import pool from '../config/db.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

// Create a new subject
export const createSubject = asyncHandler(async (req, res, next) => {
  const { subject_name, class_id, teacher_id } = req.body;

  if (!subject_name || !class_id) {
    return next(new AppError('Subject name and class_id are required', 400));
  }

  const result = await pool.query(
    'INSERT INTO subjects (subject_name, class_id, teacher_id) VALUES ($1, $2, $3) RETURNING *',
    [subject_name, class_id, teacher_id || null]
  );

  res.status(201).json({
    status: 'success',
    message: 'Subject created successfully',
    data: result.rows[0],
  });
});

// Get all subjects
export const getAllSubjects = asyncHandler(async (req, res, next) => {
  const result = await pool.query(`
    SELECT 
      s.*,
      c.class_name,
      c.section_name,
      t.full_name as teacher_name
    FROM subjects s
    JOIN classes c ON s.class_id = c.class_id
    LEFT JOIN teachers t ON s.teacher_id = t.teacher_id
    ORDER BY c.class_name, c.section_name, s.subject_name
  `);

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows,
  });
});

// Get subjects by class ID
export const getSubjectsByClass = asyncHandler(async (req, res, next) => {
  const { classId } = req.params;

  const result = await pool.query(
    `SELECT 
      s.*,
      t.full_name as teacher_name
    FROM subjects s
    LEFT JOIN teachers t ON s.teacher_id = t.teacher_id
    WHERE s.class_id = $1
    ORDER BY s.subject_name`,
    [classId]
  );

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows,
  });
});

// Get subjects taught by a teacher
export const getSubjectsByTeacher = asyncHandler(async (req, res, next) => {
  const teacherId = req.user.userId;

  const result = await pool.query(
    `SELECT 
      s.*,
      c.class_name,
      c.section_name
    FROM subjects s
    JOIN classes c ON s.class_id = c.class_id
    WHERE s.teacher_id = $1
    ORDER BY c.class_name, c.section_name, s.subject_name`,
    [teacherId]
  );

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows,
  });
});

// Update subject
export const updateSubject = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { subject_name, teacher_id } = req.body;

  const result = await pool.query(
    'UPDATE subjects SET subject_name = COALESCE($1, subject_name), teacher_id = COALESCE($2, teacher_id) WHERE subject_id = $3 RETURNING *',
    [subject_name, teacher_id, id]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Subject not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Subject updated successfully',
    data: result.rows[0],
  });
});

// Delete subject
export const deleteSubject = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    'DELETE FROM subjects WHERE subject_id = $1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Subject not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Subject deleted successfully',
  });
});