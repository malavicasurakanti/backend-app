import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import connectDB from './config/db.js';
import {
  errorResponserHandler,
  invalidPathHandler,
} from './middleware/errorHandler.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ... other imports ...

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Environment configuration
{dotenv.config()};

{connectDB()};

const app = express();

// Middleware
app.use(express.json());
app.use(cors) // Enable CORS
 {
  origin: ['https://frontend-80y2vu8qe-malavicasurakantis-projects.vercel.app']
  credentials: true
};

// Basic route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/post-categories', postCategoriesRoutes);
// static assets
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
// ... rest of your server setup ...

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));


{
// Error handling middleware
app.use(invalidPathHandler);
app.use(errorResponserHandler);
}
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
