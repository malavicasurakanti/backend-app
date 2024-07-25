import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDB from './config/db.js';
import {
  errorResponserHandler,
  invalidPathHandler,
} from './middleware/errorHandler.js';

// Routes
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import postCategoriesRoutes from './routes/postCategoriesRoutes.js';

// Environment configuration
{dotenv.config()};

{connectDB()};

const app = express();

// Middleware
app.use(express.json());
app.use(cors( // Enable CORS
 {
  origin: ['https://frontend-80y2vu8qe-malavicasurakantis-projects.vercel.app'],
  methods:['POST','GET','PUT','DELETE'],
  credentials: true
});

// Basic route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/post-categories', postCategoriesRoutes);

// Serve frontend static files
const frontendPath = path.join(__dirname, '../frontend-app/build');
app.use(express.static(frontendPath));

// Handle SPA (Single Page Application) - all other routes should serve the frontend's index.html app.get('*', (req, res) => {res.sendFile(path.resolve(, 'index.html'));});
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(9000);

// Error handling middleware
app.use(invalidPathHandler);
app.use(errorResponserHandler);

// Start the server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
