import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();
app.use(cors(
  {
    origin: "http://localhost:8081",
    credentials: true
  }
));
app.use(express.json());
app.use(cookieParser())

// MongoDB Connection
await connectDB()

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Quiz Game Schema
const quizGameSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  topic: String,
  answers: [{
    questionId: String,
    question: String,
    userAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean
  }],
  completedAt: { type: Date, default: Date.now }
});

const QuizGame = mongoose.model('QuizGame', quizGameSchema);

// Picture Game Schema
const pictureGameSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  level: { type: Number, default: 1 },
  imagesIdentified: [{
    imageId: String,
    imageName: String,
    category: String,
    isCorrect: Boolean,
    timeSpent: Number // in seconds
  }],
  totalTime: Number, // total time in seconds
  completedAt: { type: Date, default: Date.now }
});

const PictureGame = mongoose.model('PictureGame', pictureGameSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// ==================== AUTH ROUTES ====================

// Sign Up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      username,
      password: hashedPassword
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("authToken", token, {
      httpOnly: true, // prevent JS to access the cookie
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiration time
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        username: user.username,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Sign In
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Logout User - /api/auth/logout
app.post("/api/auth/logout", async (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged Out Successfully" });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
})

// auth user
app.post("/api/auth/is-auth", async (req, res) => {
  const { authToken } = req.cookies;

  if (!authToken) return res.json({ success: false, message: "Please Login First" });

  try {
    const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
    if (decodedToken.id) {
      const user = await User.findById(decodedToken.id).select("-password")
      res.json({ success: true, user });
    } else {
      res.json({ success: false, message: "Not Authorized" });
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
})

// ==================== QUIZ GAME ROUTES ====================

// Save Quiz Game Result
app.post('/api/quiz/save', authenticateToken, async (req, res) => {
  try {
    const { score, totalQuestions, difficulty, topic, answers } = req.body;

    const quizGame = new QuizGame({
      userId: req.user.id,
      score,
      totalQuestions,
      difficulty,
      topic,
      answers
    });

    await quizGame.save();

    res.status(201).json({
      message: 'Quiz results saved successfully',
      data: quizGame
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving quiz results', error: error.message });
  }
});

// Get User's Quiz History
app.get('/api/quiz/history', authenticateToken, async (req, res) => {
  try {
    const quizzes = await QuizGame.find({ userId: req.user.id })
      .sort({ completedAt: -1 })
      .limit(20);

    res.json({ data: quizzes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz history', error: error.message });
  }
});

// Get Quiz Statistics
app.get('/api/quiz/stats', authenticateToken, async (req, res) => {
  try {
    const quizzes = await QuizGame.find({ userId: req.user.id });

    const stats = {
      totalGames: quizzes.length,
      totalScore: quizzes.reduce((sum, quiz) => sum + quiz.score, 0),
      averageScore: quizzes.length > 0
        ? (quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / quizzes.length).toFixed(2)
        : 0,
      bestScore: quizzes.length > 0
        ? Math.max(...quizzes.map(q => q.score))
        : 0,
      byDifficulty: {
        easy: quizzes.filter(q => q.difficulty === 'easy').length,
        medium: quizzes.filter(q => q.difficulty === 'medium').length,
        hard: quizzes.filter(q => q.difficulty === 'hard').length
      }
    };

    res.json({ data: stats });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz stats', error: error.message });
  }
});

// ==================== PICTURE GAME ROUTES ====================

// Save Picture Game Result
app.post('/api/picture/save', authenticateToken, async (req, res) => {
  try {
    const { score, level, imagesIdentified, totalTime } = req.body;

    const pictureGame = new PictureGame({
      userId: req.user.id,
      score,
      level,
      imagesIdentified,
      totalTime
    });

    await pictureGame.save();

    res.status(201).json({
      message: 'Picture game results saved successfully',
      data: pictureGame
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving picture game results', error: error.message });
  }
});

// Get User's Picture Game History
app.get('/api/picture/history', authenticateToken, async (req, res) => {
  try {
    const games = await PictureGame.find({ userId: req.user.id })
      .sort({ completedAt: -1 })
      .limit(20);

    res.json({ data: games });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching picture game history', error: error.message });
  }
});

// Get Picture Game Statistics
app.get('/api/picture/stats', authenticateToken, async (req, res) => {
  try {
    const games = await PictureGame.find({ userId: req.user.id });

    const stats = {
      totalGames: games.length,
      totalScore: games.reduce((sum, game) => sum + game.score, 0),
      averageScore: games.length > 0
        ? (games.reduce((sum, game) => sum + game.score, 0) / games.length).toFixed(2)
        : 0,
      bestScore: games.length > 0
        ? Math.max(...games.map(g => g.score))
        : 0,
      highestLevel: games.length > 0
        ? Math.max(...games.map(g => g.level))
        : 0,
      totalImagesIdentified: games.reduce((sum, game) => sum + game.imagesIdentified.length, 0)
    };

    res.json({ data: stats });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching picture game stats', error: error.message });
  }
});

// ==================== USER PROFILE ROUTES ====================

// Get User Profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Get Combined Statistics
app.get('/api/user/overall-stats', authenticateToken, async (req, res) => {
  try {
    const quizzes = await QuizGame.find({ userId: req.user.id });
    const pictureGames = await PictureGame.find({ userId: req.user.id });

    const stats = {
      quiz: {
        totalGames: quizzes.length,
        averageScore: quizzes.length > 0
          ? (quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / quizzes.length).toFixed(2)
          : 0,
        bestScore: quizzes.length > 0 ? Math.max(...quizzes.map(q => q.score)) : 0
      },
      picture: {
        totalGames: pictureGames.length,
        averageScore: pictureGames.length > 0
          ? (pictureGames.reduce((sum, game) => sum + game.score, 0) / pictureGames.length).toFixed(2)
          : 0,
        bestScore: pictureGames.length > 0 ? Math.max(...pictureGames.map(g => g.score)) : 0
      },
      totalGamesPlayed: quizzes.length + pictureGames.length
    };

    res.json({ data: stats });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching overall stats', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});