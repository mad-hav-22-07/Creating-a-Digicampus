import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Access token is missing',
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: 'error',
        message: 'Invalid or expired token',
      });
    }

    req.user = user; // { userId, role, username }
    next();
  });
};

// Middleware to check if user is a teacher
export const isTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Teachers only.',
    });
  }
  next();
};

// Middleware to check if user is a student
export const isStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Students only.',
    });
  }
  next();
};



