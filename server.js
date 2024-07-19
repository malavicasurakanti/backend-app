import express from "express";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";
import cors from "cors";
import authRoutes from './routes/authRoutes.js'; // Import the authRoutes
import {
  errorResponserHandler,
  invalidPathHandler,
} from "./middleware/errorHandler.js";
import { authGuard, adminGuard } from  './middleware/authMiddleware.js';

// Routes
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import postCategoriesRoutes from "./routes/postCategoriesRoutes.js";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
connectDB();
const app = express();
app.use(express.json());

const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:10000', 'https://wwwdatavicacom.netlify.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`Origin not allowed by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.options('*', cors(corsOptions)); // Handle OPTIONS requests globally
app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/api/users", userRoutes); // Protect user routes
app.use("/api/posts",  postRoutes); // Protect post routes
app.use("/api/comments", commentRoutes); // Protect comment routes
app.use("/api/post-categories",  postCategoriesRoutes); // Protect post categories routes
app.use('/api/auth', authRoutes); // Public auth routes

app.use(express.static(path.join(__dirname, "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"), { status: 200 });
});

app.use(invalidPathHandler);
app.use(errorResponserHandler);

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
