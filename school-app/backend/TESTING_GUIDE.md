# Testing Guide

## Quick Start Testing

### 1. Start the Server
```bash
npm run dev
```

### 2. Test Health Check
```bash
curl http://localhost:8000/api/v1/health
```

---

## Step-by-Step Testing Flow

### Step 1: Register a Teacher
```bash
curl -X POST http://localhost:8000/api/v1/auth/teacher/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "teacher1",
    "password": "password123",
    "full_name": "John Doe"
  }'
```

**Save the token from response!**

### Step 2: Create a Class (use teacher token)
```bash
curl -X POST http://localhost:8000/api/v1/classes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TEACHER_TOKEN" \
  -d '{
    "class_name": "10",
    "section_name": "A",
    "class_teacher_id": 1
  }'
```

**Save the class_id!**

### Step 3: Register Students
```bash
curl -X POST http://localhost:8000/api/v1/auth/student/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student1",
    "password": "password123",
    "full_name": "Jane Smith",
    "roll_no": "2024001",
    "class_id": 1
  }'
```

### Step 4: Create Subject
```bash
curl -X POST http://localhost:8000/api/v1/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TEACHER_TOKEN" \
  -d '{
    "subject_name": "Mathematics",
    "class_id": 1,
    "teacher_id": 1
  }'
```

### Step 5: Create Timetable Entry
```bash
curl -X POST http://localhost:8000/api/v1/timetable \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TEACHER_TOKEN" \
  -d '{
    "class_id": 1,
    "subject_id": 1,
    "day_of_week": "Monday",
    "period_number": 1,
    "start_time": "09:00:00",
    "end_time": "10:00:00"
  }'
```

### Step 6: Mark Attendance
```bash
curl -X POST http://localhost:8000/api/v1/attendance/mark \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TEACHER_TOKEN" \
  -d '{
    "class_id": 1,
    "date": "2024-12-12",
    "attendance_records": [
      { "student_id": 1, "status": "Present" }
    ]
  }'
```

### Step 7: Create Exam
```bash
curl -X POST http://localhost:8000/api/v1/exams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TEACHER_TOKEN" \
  -d '{
    "exam_name": "Mid Term 2024",
    "class_id": 1,
    "max_marks": 100,
    "grade_scale": "A-F"
  }'
```

### Step 8: Add Marks
```bash
curl -X POST http://localhost:8000/api/v1/marks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TEACHER_TOKEN" \
  -d '{
    "exam_id": 1,
    "marks_records": [
      { "student_id": 1, "subject_id": 1, "marks_scored": 85.5 }
    ]
  }'
```

### Step 9: Student Login and Check Dashboard
```bash
# Login as student
curl -X POST http://localhost:8000/api/v1/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student1",
    "password": "password123"
  }'

# Get student dashboard (use student token)
curl http://localhost:8000/api/v1/students/dashboard \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

### Step 10: Create Leave Request (Student)
```bash
curl -X POST http://localhost:8000/api/v1/notifications/leave-request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" \
  -d '{
    "content": "I am sick and need leave for 2 days",
    "target_teacher_id": 1
  }'
```

### Step 11: Approve Leave Request (Teacher)
```bash
# Get leave requests
curl http://localhost:8000/api/v1/notifications/leave-requests \
  -H "Authorization: Bearer YOUR_TEACHER_TOKEN"

# Approve leave request
curl -X PUT http://localhost:8000/api/v1/notifications/leave-request/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TEACHER_TOKEN" \
  -d '{
    "status": "APPROVED"
  }'
```

### Step 12: Create Announcement (Teacher)
```bash
curl -X POST http://localhost:8000/api/v1/notifications/announcement \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TEACHER_TOKEN" \
  -d '{
    "content": "Tomorrow is a holiday",
    "target_class_id": 1
  }'
```

---

## Testing with Postman

### 1. Import Environment Variables
Create a new environment in Postman with:
- `base_url`: `http://localhost:8000/api/v1`
- `teacher_token`: (will be set after login)
- `student_token`: (will be set after login)

### 2. Set Authorization Automatically
After login, add this to the "Tests" tab:
```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
  const response = pm.response.json();
  if (response.data && response.data.token) {
    pm.environment.set("teacher_token", response.data.token);
    // or pm.environment.set("student_token", response.data.token);
  }
}
```

### 3. Use Token in Requests
In Authorization tab:
- Type: Bearer Token
- Token: `{{teacher_token}}` or `{{student_token}}`

---

## Common Test Scenarios

### Teacher Workflow
1. Register → Login
2. Create Class
3. Create Subjects
4. Add Students
5. Create Timetable
6. Mark Attendance
7. Create Exams
8. Add Marks
9. View Dashboard
10. Approve Leave Requests

### Student Workflow
1. Register → Login
2. View Dashboard
3. Check Timetable
4. Check Marks
5. Check Attendance
6. Submit Leave Request
7. View Announcements

---

## Debugging Tips

### Check Database
```sql
-- Connect to PostgreSQL
psql -U your_username -d school_management

-- View all tables
\dt

-- View students
SELECT * FROM students;

-- View classes
SELECT * FROM classes;

-- View attendance
SELECT * FROM attendance;
```

### Common Issues

**Issue: "Access token is missing"**
- Solution: Add Authorization header with Bearer token

**Issue: "Invalid credentials"**
- Solution: Check username and password

**Issue: "Route not found"**
- Solution: Check URL and HTTP method

**Issue: "Migration failed"**
- Solution: Check database connection in .env file

---

## Load Testing

### Simple Load Test with curl
```bash
# Test 100 concurrent requests
for i in {1..100}; do
  curl http://localhost:8000/api/v1/health &
done
wait
```

### Using Apache Bench
```bash
ab -n 1000 -c 10 http://localhost:8000/api/v1/health
```

---

## Expected Response Times
- Authentication: < 200ms
- Simple GET requests: < 100ms
- Complex queries (dashboard): < 300ms
- Bulk operations (attendance/marks): < 500ms