import CommunityTask from "../models/communityTask.model.js";

export const getCommunityTasks = async (req, res) => {
  try {
    const tasks = await CommunityTask.find({ isDeleted: { $ne: true } })
      .populate("creator", "name email")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createCommunityTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const task = new CommunityTask({
      title,
      description,
      status,
      creator: req.user._id,
    });

    await task.save();
    await task.populate("creator", "name email");

    // Emit real-time event to community room only
    req.io.to("community").emit("task:create", {
      task,
      user: { id: req.user._id, name: req.user.name },
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateCommunityTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const task = await CommunityTask.findById(id).populate(
      "creator",
      "name email"
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Only creator can update
    if (task.creator._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;

    await task.save();

    // Emit real-time event to community room only
    req.io.to("community").emit("task:update", {
      task,
      user: { id: req.user._id, name: req.user.name },
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteCommunityTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await CommunityTask.findById(id).populate(
      "creator",
      "name email"
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Only creator can delete
    if (task.creator._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    // Soft delete
    task.isDeleted = true;
    await task.save();

    // Emit real-time event to community room only
    req.io.to("community").emit("task:delete", {
      taskId: id,
      user: { id: req.user._id, name: req.user.name },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
