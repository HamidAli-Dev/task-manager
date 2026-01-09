import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";

import { connectDB } from "./utils/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import communityTaskRoutes from "./routes/communityTaskRoutes.js";
import { socketAuthMiddleware } from "./middleware/socketAuth.js";
import { attachSocketIO } from "./middleware/socketMiddleware.js";
import { handleConnection } from "./sockets/socketHandlers.js";
import presenceService from "./services/presenceService.js";

const BASE_PATH = "/api/v1";
const port = process.env.PORT;
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(attachSocketIO(io));

app.get("/", (req, res) => {
  res.send("TaskFlow API Server");
});

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/tasks`, taskRoutes);
app.use(`${BASE_PATH}/community/tasks`, communityTaskRoutes);

io.use(socketAuthMiddleware);
io.on("connection", (socket) => handleConnection(io, socket));

// Cleanup stale presence every 5 minutes
setInterval(() => {
  presenceService.cleanupStalePresence();
}, 5 * 60 * 1000);

server.listen(port, async () => {
  console.log(`Server is listening on port ${port}`);
  await connectDB();
});
