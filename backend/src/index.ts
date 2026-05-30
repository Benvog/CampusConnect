import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import universityRoutes from './routes/universities';
import swipeRoutes from './routes/swipes';
import userRoutes from './routes/user';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CampusConnect API is running' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// University routes
app.use('/api/universities', universityRoutes);

// Swipe/Discovery routes
app.use('/api/swipes', swipeRoutes);

// User routes (stats, settings)
app.use('/api/user', userRoutes);

// Protected route example
app.get('/api/protected', (req, res) => {
  res.json({ message: 'This is a protected route' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
