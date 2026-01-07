import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./utils/db.js";

const port = 8000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, async () => {
  console.log(`Server is listening on port ${port}`);
  await connectDB();
});
