import express from "express";
import {
  getCommunityTasks,
  createCommunityTask,
  updateCommunityTask,
  deleteCommunityTask,
} from "../controllers/communityTaskController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getCommunityTasks);
router.post("/", createCommunityTask);
router.put("/:id", updateCommunityTask);
router.delete("/:id", deleteCommunityTask);

export default router;
