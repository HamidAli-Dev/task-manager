import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./utils/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const BASE_PATH = "/api/v1";

const port = 8000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("TaskFlow API Server");
});

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/tasks`, taskRoutes);

app.listen(port, async () => {
  console.log(`Server is listening on port ${port}`);
  await connectDB();
});
