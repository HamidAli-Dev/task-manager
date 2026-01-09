import mongoose from "mongoose";

const communityTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["pending", "in progress", "completed"],
      default: "pending",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Only return non-deleted tasks by default
// communityTaskSchema.pre(/^find/, function(next) {
//   this.find({ isDeleted: { $ne: true } });
//   next();
// });

export default mongoose.model("CommunityTask", communityTaskSchema);
