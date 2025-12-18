import pool from '../config/db.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

// Create exam
export const createExam = asyncHandler(async (req, res, next) => {
  const { exam_name, class_id, max_marks, grade_scale } = req.body;

  if (!exam_name || !class_id || !max_marks) {
    return next(new AppError('Exam name, class_id, and max_marks are required', 400));
  }

  const result = await pool.query(
    'INSERT INTO exams (exam_name, class_id, max_marks, grade_scale) VALUES ($1, $2, $3, $4) RETURNING *',
    [exam_name, class_id, max_marks, grade_scale || null]
  );

  res.status(201).json({
    status: 'success',
    message: 'Exam created successfully',
    data: result.rows[0],
  });
});

// Get all exams
export const getAllExams = asyncHandler(async (req, res, next) => {
  const result = await pool.query(`
    SELECT 
      e.*,
      c.class_name,
      c.section_name
    FROM exams e
    JOIN classes c ON e.class_id = c.class_id
    ORDER BY e.created_at DESC
  `);

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows,
  });
});

// Get exams by class
export const getExamsByClass = asyncHandler(async (req, res, next) => {
  const { classId } = req.params;

  const result = await pool.query(
    'SELECT * FROM exams WHERE class_id = $1 ORDER BY created_at DESC',
    [classId]
  );

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows,
  });
});

// Get exam by ID with details
export const getExamById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    `SELECT 
      e.*,
      c.class_name,
      c.section_name
    FROM exams e
    JOIN classes c ON e.class_id = c.class_id
    WHERE e.exam_id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Exam not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: result.rows[0],
  });
});

// Update exam
export const updateExam = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { exam_name, max_marks, grade_scale } = req.body;

  const result = await pool.query(
    'UPDATE exams SET exam_name = COALESCE($1, exam_name), max_marks = COALESCE($2, max_marks), grade_scale = COALESCE($3, grade_scale) WHERE exam_id = $4 RETURNING *',
    [exam_name, max_marks, grade_scale, id]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Exam not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Exam updated successfully',
    data: result.rows[0],
  });
});

// Delete exam
export const deleteExam = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    'DELETE FROM exams WHERE exam_id = $1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Exam not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Exam deleted successfully',
  });
});