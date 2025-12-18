import pool from '../config/db.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

// Add/Update marks for students (Teacher)
export const addOrUpdateMarks = asyncHandler(async (req, res, next) => {
  const { exam_id, marks_records } = req.body;
  // marks_records = [{ student_id, subject_id, marks_scored }, ...]

  if (!exam_id || !marks_records || !Array.isArray(marks_records)) {
    return next(new AppError('Invalid data format', 400));
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const results = [];

    for (const record of marks_records) {
      const { student_id, subject_id, marks_scored } = record;

      // Check if marks already exist
      const existing = await client.query(
        'SELECT * FROM marks WHERE exam_id = $1 AND student_id = $2 AND subject_id = $3',
        [exam_id, student_id, subject_id]
      );

      if (existing.rows.length > 0) {
        // Update existing
        const updated = await client.query(
          'UPDATE marks SET marks_scored = $1 WHERE exam_id = $2 AND student_id = $3 AND subject_id = $4 RETURNING *',
          [marks_scored, exam_id, student_id, subject_id]
        );
        results.push(updated.rows[0]);
      } else {
        // Insert new
        const inserted = await client.query(
          'INSERT INTO marks (exam_id, student_id, subject_id, marks_scored) VALUES ($1, $2, $3, $4) RETURNING *',
          [exam_id, student_id, subject_id, marks_scored]
        );
        results.push(inserted.rows[0]);
      }
    }

    await client.query('COMMIT');

    res.status(200).json({
      status: 'success',
      message: 'Marks added/updated successfully',
      data: results,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

// Get rank list for an exam
export const getRankListByExam = asyncHandler(async (req, res, next) => {
  const { examId } = req.params;

  const result = await pool.query(
    `
    SELECT
      s.student_id,
      s.full_name AS student_name,
      s.roll_no,
      SUM(m.marks_scored) AS total_marks,
      COUNT(m.subject_id) AS subjects_count
    FROM marks m
    JOIN students s ON m.student_id = s.student_id
    WHERE m.exam_id = $1
    GROUP BY s.student_id, s.full_name, s.roll_no
    ORDER BY total_marks DESC, s.roll_no ASC
    `,
    [examId]
  );

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows,
  });
});

// Get marks for a specific exam
export const getMarksByExam = asyncHandler(async (req, res, next) => {
  const { examId } = req.params;

  const result = await pool.query(
    `SELECT 
      m.*,
      s.full_name as student_name,
      s.roll_no,
      sub.subject_name,
      e.max_marks
    FROM marks m
    JOIN students s ON m.student_id = s.student_id
    JOIN subjects sub ON m.subject_id = sub.subject_id
    JOIN exams e ON m.exam_id = e.exam_id
    WHERE m.exam_id = $1
    ORDER BY s.roll_no, sub.subject_name`,
    [examId]
  );

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows,
  });
});

// Get all marks for a specific student (Student view)
export const getStudentMarks = asyncHandler(async (req, res, next) => {
  const studentId = req.user.userId;

  const result = await pool.query(
    `SELECT 
      m.*,
      e.exam_name,
      e.max_marks,
      sub.subject_name,
      c.class_name,
      c.section_name
    FROM marks m
    JOIN exams e ON m.exam_id = e.exam_id
    JOIN subjects sub ON m.subject_id = sub.subject_id
    JOIN classes c ON e.class_id = c.class_id
    WHERE m.student_id = $1
    ORDER BY e.created_at DESC, sub.subject_name`,
    [studentId]
  );

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows,
  });
});

// Get marks for current student for a specific exam (Student view)
export const getMyMarksByExam = asyncHandler(async (req, res, next) => {
  const { examId } = req.params;
  const studentId = req.user.userId; // From JWT token

  const result = await pool.query(
    `SELECT 
      m.mark_id,
      m.marks_scored,
      e.exam_name,
      e.max_marks,
      sub.subject_id,
      sub.subject_name
    FROM marks m
    JOIN exams e ON m.exam_id = e.exam_id
    JOIN subjects sub ON m.subject_id = sub.subject_id
    WHERE m.exam_id = $1 AND m.student_id = $2
    ORDER BY sub.subject_name`,
    [examId, studentId]
  );

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows,
  });
});

// Get marks for a specific student by ID (Teacher can view)
export const getMarksByStudentId = asyncHandler(async (req, res, next) => {
  const { studentId } = req.params;

  const result = await pool.query(
    `SELECT 
      m.*,
      e.exam_name,
      e.max_marks,
      sub.subject_name,
      c.class_name,
      c.section_name
    FROM marks m
    JOIN exams e ON m.exam_id = e.exam_id
    JOIN subjects sub ON m.subject_id = sub.subject_id
    JOIN classes c ON e.class_id = c.class_id
    WHERE m.student_id = $1
    ORDER BY e.created_at DESC, sub.subject_name`,
    [studentId]
  );

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows,
  });
});

// Get marks for a specific exam and student (Teacher view)
export const getMarksByExamAndStudent = asyncHandler(async (req, res, next) => {
  const { examId, studentId } = req.params;

  const result = await pool.query(
    `SELECT 
      m.*,
      e.exam_name,
      e.max_marks,
      sub.subject_name
    FROM marks m
    JOIN exams e ON m.exam_id = e.exam_id
    JOIN subjects sub ON m.subject_id = sub.subject_id
    WHERE m.exam_id = $1 AND m.student_id = $2
    ORDER BY sub.subject_name`,
    [examId, studentId]
  );

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows,
  });
});

// Get class performance for an exam
export const getClassPerformance = asyncHandler(async (req, res, next) => {
  const { examId } = req.params;

  const result = await pool.query(
    `SELECT 
      sub.subject_name,
      e.max_marks,
      AVG(m.marks_scored) as average_marks,
      MAX(m.marks_scored) as highest_marks,
      MIN(m.marks_scored) as lowest_marks,
      COUNT(m.mark_id) as total_students
    FROM marks m
    JOIN subjects sub ON m.subject_id = sub.subject_id
    JOIN exams e ON m.exam_id = e.exam_id
    WHERE m.exam_id = $1
    GROUP BY sub.subject_name, e.max_marks
    ORDER BY sub.subject_name`,
    [examId]
  );

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows,
  });
});

// Delete marks
export const deleteMarks = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    'DELETE FROM marks WHERE mark_id = $1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Marks record not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Marks deleted successfully',
  });
});