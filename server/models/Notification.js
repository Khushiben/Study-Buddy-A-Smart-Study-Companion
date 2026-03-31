const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["invite", "message"],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "read"],
      default: "pending",
    },
    text: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);