import express from "express";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";
import cors from "cors";
import {
  errorResponserHandler,
  invalidPathHandler,
} from "./middleware/errorHandler.js";

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
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running...");
});
{
app.use("/api/users", userRoutes); // Protect user routes
app.use("/api/posts",  postRoutes); // Protect post routes
app.use("/api/comments", commentRoutes); // Protect comment routes
app.use("/api/post-categories",  postCategoriesRoutes); // Protect post categories routes
};
// static assets
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
{
app.get("*", (req, res) => {
<<<<<<< HEAD
  res.sendFile(path.resolve(__dirname, "../frontend-app/public", "index.html"), { status: 200 });
=======
  res.sendFile(path.resolve(__dirname, "build", "index.html"), { status: 200 });
>>>>>>> f8c42a908a24bab534eadcf61c4df5c47ada91e7
});
}
app.use(invalidPathHandler);
app.use(errorResponserHandler);

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
