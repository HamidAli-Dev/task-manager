import mongoose from "mongoose";

const presenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    socketId: {
      type: String,
      required: true,
    },
    isOnline: {
      type: Boolean,
      default: true,
    },
    currentView: {
      type: String,
      enum: ["my-tasks", "community", "offline"],
      default: "offline",
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-cleanup old presence records
presenceSchema.index({ lastSeen: 1 }, { expireAfterSeconds: 3600 }); // 1 hour

export default mongoose.model("Presence", presenceSchema);
