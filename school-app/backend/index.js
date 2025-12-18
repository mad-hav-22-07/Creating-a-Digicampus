import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// ----------- middleware -----------
app.use(cors({
  origin: "*",   // Allow all origins (change later for prod)
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log every request
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ----------- Routes -----------
app.use("/api/v1", routes);

// ----------- 404 Handler -----------
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ----------- Global Error Handler -----------
app.use(errorHandler);

// ----------- Start Server -----------
app.listen(PORT, () => {
  console.log(`🔥 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});