export const up = (pgm) => {
  // Teachers Table
  pgm.createTable('teachers', {
    teacher_id: { type: 'serial', primaryKey: true },
    username: { type: 'varchar(100)', notNull: true, unique: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    full_name: { type: 'varchar(255)', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });

  // Classes Table
  pgm.createTable('classes', {
    class_id: { type: 'serial', primaryKey: true },
    class_name: { type: 'varchar(50)', notNull: true },
    section_name: { type: 'varchar(10)', notNull: true },
    class_teacher_id: {
      type: 'integer',
      references: 'teachers(teacher_id)',
      onDelete: 'SET NULL',
    },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });

  // Students Table
  pgm.createTable('students', {
    student_id: { type: 'serial', primaryKey: true },
    username: { type: 'varchar(100)', notNull: true, unique: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    full_name: { type: 'varchar(255)', notNull: true },
    roll_no: { type: 'varchar(50)', notNull: true },
    class_id: {
      type: 'integer',
      references: 'classes(class_id)',
      onDelete: 'CASCADE',
      notNull: true,
    },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });

  // Subjects Table
  pgm.createTable('subjects', {
    subject_id: { type: 'serial', primaryKey: true },
    subject_name: { type: 'varchar(100)', notNull: true },
    class_id: {
      type: 'integer',
      references: 'classes(class_id)',
      onDelete: 'CASCADE',
      notNull: true,
    },
    teacher_id: {
      type: 'integer',
      references: 'teachers(teacher_id)',
      onDelete: 'SET NULL',
    },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });

  // Timetable Table
  pgm.createTable('timetable', {
    timetable_id: { type: 'serial', primaryKey: true },
    class_id: {
      type: 'integer',
      references: 'classes(class_id)',
      onDelete: 'CASCADE',
      notNull: true,
    },
    subject_id: {
      type: 'integer',
      references: 'subjects(subject_id)',
      onDelete: 'CASCADE',
      notNull: true,
    },
    day_of_week: {
      type: 'varchar(10)',
      notNull: true,
      check: "day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')",
    },
    period_number: { type: 'integer', notNull: true },
    start_time: { type: 'time', notNull: true },
    end_time: { type: 'time', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });

  // Exams Table
  pgm.createTable('exams', {
    exam_id: { type: 'serial', primaryKey: true },
    exam_name: { type: 'varchar(255)', notNull: true },
    class_id: {
      type: 'integer',
      references: 'classes(class_id)',
      onDelete: 'CASCADE',
      notNull: true,
    },
    max_marks: { type: 'integer', notNull: true },
    grade_scale: { type: 'varchar(50)' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });

  // Marks Table
  pgm.createTable('marks', {
    mark_id: { type: 'serial', primaryKey: true },
    exam_id: {
      type: 'integer',
      references: 'exams(exam_id)',
      onDelete: 'CASCADE',
      notNull: true,
    },
    student_id: {
      type: 'integer',
      references: 'students(student_id)',
      onDelete: 'CASCADE',
      notNull: true,
    },
    subject_id: {
      type: 'integer',
      references: 'subjects(subject_id)',
      onDelete: 'CASCADE',
      notNull: true,
    },
    marks_scored: { type: 'decimal(5,2)', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });

  // Attendance Table
  pgm.createTable('attendance', {
    attendance_id: { type: 'serial', primaryKey: true },
    student_id: {
      type: 'integer',
      references: 'students(student_id)',
      onDelete: 'CASCADE',
      notNull: true,
    },
    class_id: {
      type: 'integer',
      references: 'classes(class_id)',
      onDelete: 'CASCADE',
      notNull: true,
    },
    date: { type: 'date', notNull: true },
    status: {
      type: 'varchar(10)',
      notNull: true,
      check: "status IN ('Present', 'Absent')",
    },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });

  // Notifications Table
  pgm.createTable('notifications', {
    notification_id: { type: 'serial', primaryKey: true },
    type: {
      type: 'varchar(20)',
      notNull: true,
      check: "type IN ('LEAVE_REQUEST', 'ANNOUNCEMENT')",
    },
    content: { type: 'text', notNull: true },
    created_by_student: {
      type: 'integer',
      references: 'students(student_id)',
      onDelete: 'CASCADE',
    },
    created_by_teacher: {
      type: 'integer',
      references: 'teachers(teacher_id)',
      onDelete: 'CASCADE',
    },
    target_class_id: {
      type: 'integer',
      references: 'classes(class_id)',
      onDelete: 'CASCADE',
    },
    target_teacher_id: {
      type: 'integer',
      references: 'teachers(teacher_id)',
      onDelete: 'CASCADE',
    },
    status: {
      type: 'varchar(10)',
      default: 'PENDING',
      check: "status IN ('PENDING', 'APPROVED', 'REJECTED')",
    },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });

  // Create indexes for better query performance
  pgm.createIndex('students', 'class_id');
  pgm.createIndex('subjects', ['class_id', 'teacher_id']);
  pgm.createIndex('timetable', ['class_id', 'day_of_week']);
  pgm.createIndex('marks', ['exam_id', 'student_id']);
  pgm.createIndex('attendance', ['student_id', 'date']);
  pgm.createIndex('notifications', ['type', 'target_class_id']);
};

export const down = (pgm) => {
  pgm.dropTable('notifications');
  pgm.dropTable('attendance');
  pgm.dropTable('marks');
  pgm.dropTable('exams');
  pgm.dropTable('timetable');
  pgm.dropTable('subjects');
  pgm.dropTable('students');
  pgm.dropTable('classes');
  pgm.dropTable('teachers');
};