import pool from '../config/db.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

// Mark attendance for multiple students (Teacher)
export const markAttendance = asyncHandler(async (req, res, next) => {
  const { class_id, date, attendance_records } = req.body;
  // attendance_records = [{ student_id, status }, ...]

  if (!class_id || !date || !attendance_records || !Array.isArray(attendance_records)) {
    return next(new AppError('Invalid data format', 400));
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const results = [];

    for (const record of attendance_records) {
      const { student_id, status } = record;

      // Check if attendance already exists for this date
      const existing = await client.query(
        'SELECT * FROM attendance WHERE student_id = $1 AND date = $2',
        [student_id, date]
      );

      if (existing.rows.length > 0) {
        // Update existing
        const updated = await client.query(
          'UPDATE attendance SET status = $1 WHERE student_id = $2 AND date = $3 RETURNING *',
          [status, student_id, date]
        );
        results.push(updated.rows[0]);
      } else {
        // Insert new
        const inserted = await client.query(
          'INSERT INTO attendance (student_id, class_id, date, status) VALUES ($1, $2, $3, $4) RETURNING *',
          [student_id, class_id, date, status]
        );
        results.push(inserted.rows[0]);
      }
    }

    await client.query('COMMIT');

    res.status(200).json({
      status: 'success',
      message: 'Attendance marked successfully',
      data: results,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

// Get attendance for a specific class and date
export const getAttendanceByClassAndDate = asyncHandler(async (req, res, next) => {
  const { classId, date } = req.params;

  const result = await pool.query(
    `SELECT 
      a.*,
      s.full_name,
      s.roll_no
    FROM attendance a
    JOIN students s ON a.student_id = s.student_id
    WHERE a.class_id = $1 AND a.date = $2
    ORDER BY s.roll_no`,
    [classId, date]
  );

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows,
  });
});

// Get attendance for a specific student
export const getStudentAttendance = asyncHandler(async (req, res, next) => {
  const studentId = req.user.userId;

  const result = await pool.query(
    `SELECT * FROM attendance 
     WHERE student_id = $1 
     ORDER BY date DESC`,
    [studentId]
  );

  // Calculate statistics
  const total = result.rows.length;
  const present = result.rows.filter(r => r.status === 'Present').length;
  const absent = total - present;
  const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

  res.status(200).json({
    status: 'success',
    data: {
      records: result.rows,
      statistics: {
        total,
        present,
        absent,
        percentage: parseFloat(percentage),
      },
    },
  });
});

// Get attendance statistics for a class
export const getClassAttendanceStats = asyncHandler(async (req, res, next) => {
  const { classId } = req.params;
  const { startDate, endDate } = req.query;

  let query = `
    SELECT 
      s.student_id,
      s.full_name,
      s.roll_no,
      COUNT(*) as total_days,
      SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) as present_days,
      SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) as absent_days,
      ROUND((SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END)::numeric / COUNT(*)::numeric) * 100, 2) as percentage
    FROM students s
    LEFT JOIN attendance a ON s.student_id = a.student_id
    WHERE s.class_id = $1
  `;

  const params = [classId];

  if (startDate && endDate) {
    query += ' AND a.date BETWEEN $2 AND $3';
    params.push(startDate, endDate);
  }

  query += ' GROUP BY s.student_id, s.full_name, s.roll_no ORDER BY s.roll_no';

  const result = await pool.query(query, params);

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows,
  });
});

// Get attendance for specific student by ID (Teacher can view)
export const getAttendanceByStudentId = asyncHandler(async (req, res, next) => {
  const { studentId } = req.params;

  const result = await pool.query(
    `SELECT 
      a.*,
      c.class_name,
      c.section_name
    FROM attendance a
    JOIN classes c ON a.class_id = c.class_id
    WHERE a.student_id = $1
    ORDER BY a.date DESC`,
    [studentId]
  );

  // Calculate statistics
  const total = result.rows.length;
  const present = result.rows.filter(r => r.status === 'Present').length;
  const absent = total - present;
  const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

  res.status(200).json({
    status: 'success',
    data: {
      records: result.rows,
      statistics: {
        total,
        present,
        absent,
        percentage: parseFloat(percentage),
      },
    },
  });
});

// Delete attendance record
export const deleteAttendance = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    'DELETE FROM attendance WHERE attendance_id = $1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Attendance record not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Attendance record deleted successfully',
  });
});