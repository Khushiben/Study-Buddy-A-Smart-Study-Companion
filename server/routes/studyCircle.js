const express = require("express");
const mongoose = require("mongoose");

const authMiddleware = require("../middleware/authMiddleware");
const Group = require("../models/Group");
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const User = require("../models/User");

const router = express.Router();

router.use(authMiddleware);

const buildMemberQuery = (userId) => ({ members: userId });
const getUnreadCount = (group, userId) => {
  const state = group.memberStates?.find((entry) => entry.user.toString() === userId);
  return state?.unreadCount || 0;
};

const ensureMemberState = async (group, userId) => {
  const exists = group.memberStates?.some((entry) => entry.user.toString() === userId);
  if (!exists) {
    group.memberStates.push({ user: userId, unreadCount: 0, lastReadAt: new Date() });
  }
};

router.post("/groups", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Group name is required" });
    }

    const group = await Group.create({
      name: name.trim(),
      creator: req.userId,
      members: [req.userId],
      memberStates: [{ user: req.userId, unreadCount: 0, lastReadAt: new Date() }],
    });

    const populatedGroup = await Group.findById(group._id)
      .populate("creator", "name email")
      .populate("members", "name email");

    return res.status(201).json(populatedGroup);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create group" });
  }
});

router.get("/groups", async (req, res) => {
  try {
    const groups = await Group.find(buildMemberQuery(req.userId))
      .populate("creator", "name email")
      .populate("members", "name email")
      .sort({ updatedAt: -1 });

    for (const group of groups) {
      await ensureMemberState(group, req.userId);
      await group.save();
    }

    const withUnread = groups.map((group) => ({
      ...group.toObject(),
      unreadCount: getUnreadCount(group, req.userId),
    }));

    return res.json(withUnread);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch groups" });
  }
});

router.post("/groups/:groupId/join", async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group id" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.members.some((memberId) => memberId.toString() === req.userId)) {
      group.members.push(req.userId);
      group.memberStates.push({ user: req.userId, unreadCount: 0, lastReadAt: new Date() });
      await group.save();
    }

    const populatedGroup = await Group.findById(group._id)
      .populate("creator", "name email")
      .populate("members", "name email");

    return res.json(populatedGroup);
  } catch (error) {
    return res.status(500).json({ message: "Failed to join group" });
  }
});

router.post("/groups/:groupId/invite", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { email } = req.body;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group id" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.creator.toString() !== req.userId) {
      return res.status(403).json({ message: "Only the creator can invite users" });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    const invitedUser = await User.findOne({ email: email.trim().toLowerCase() });

    if (!invitedUser) {
      return res.status(404).json({ message: "User with this email not found" });
    }

    const alreadyMember = group.members.some(
      (memberId) => memberId.toString() === invitedUser._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({ message: "User is already a member" });
    }

    const alreadyPending = group.pendingInvites?.some(
      (invite) => invite.user.toString() === invitedUser._id.toString()
    );

    if (alreadyPending) {
      return res.status(400).json({ message: "Invitation already sent" });
    }

    group.pendingInvites.push({ user: invitedUser._id, invitedBy: req.userId });
    await group.save();

    const notification = await Notification.create({
      type: "invite",
      userId: invitedUser._id,
      fromUser: req.userId,
      groupId: group._id,
      status: "pending",
      text: `You were invited to join ${group.name}`,
    });

    const io = req.app.get("io");
    if (io) {
      io.to(`user:${invitedUser._id.toString()}`).emit("studyCircle:newNotification", notification);
    }

    const populatedGroup = await Group.findById(group._id)
      .populate("creator", "name email")
      .populate("members", "name email");

    return res.json(populatedGroup);
  } catch (error) {
    return res.status(500).json({ message: "Failed to invite user" });
  }
});

router.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .populate("fromUser", "name email")
      .populate("groupId", "name")
      .sort({ createdAt: -1 })
      .limit(80);

    return res.json(notifications);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

router.get("/invitations", async (req, res) => {
  try {
    const invitations = await Notification.find({
      userId: req.userId,
      type: "invite",
      status: "pending",
    })
      .populate("fromUser", "name email")
      .populate("groupId", "name")
      .sort({ createdAt: -1 });

    return res.json(invitations);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch invitations" });
  }
});

router.patch("/notifications/:notificationId/read", async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.notificationId, userId: req.userId },
      { status: "read" },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.json(notification);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update notification" });
  }
});

router.post("/invitations/:notificationId/respond", async (req, res) => {
  try {
    const { action } = req.body;

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({ message: "Action must be accept or reject" });
    }

    const notification = await Notification.findOne({
      _id: req.params.notificationId,
      userId: req.userId,
      type: "invite",
      status: "pending",
    });

    if (!notification) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    const group = await Group.findById(notification.groupId);
    if (!group) {
      notification.status = "read";
      await notification.save();
      return res.status(404).json({ message: "Group not found" });
    }

    group.pendingInvites = (group.pendingInvites || []).filter(
      (invite) => invite.user.toString() !== req.userId
    );

    if (action === "accept") {
      if (!group.members.some((memberId) => memberId.toString() === req.userId)) {
        group.members.push(req.userId);
      }
      await ensureMemberState(group, req.userId);
    }

    await group.save();

    notification.status = "read";
    await notification.save();

    // Prepare response before socket operations (so errors don't affect response)
    const populatedGroup = await Group.findById(group._id)
      .populate("creator", "name email")
      .populate("members", "name email");

    const responseData = {
      message: action === "accept" ? "Invitation accepted" : "Invitation rejected",
      group: action === "accept" ? populatedGroup : null,
      success: true,
    };

    // Send notification to inviter with user's name
    // Do this asynchronously so socket errors don't break the API response
    (async () => {
      try {
        const invitedUser = await User.findById(req.userId).select("name");
        const inviterNotificationType = action === "accept" ? "invitation_accepted" : "invitation_rejected";

        const inviterNotification = await Notification.create({
          type: inviterNotificationType,
          userId: notification.fromUser,
          fromUser: req.userId,
          groupId: group._id,
          status: "pending",
          text: `${invitedUser.name} ${action === "accept" ? "accepted your invitation to join" : "rejected your invitation to join"} ${group.name}`,
        });

        // Populate the notification before emitting
        const populatedInviterNotification = await Notification.findById(inviterNotification._id)
          .populate("fromUser", "name email")
          .populate("groupId", "name");

        const io = req.app.get("io");
        if (io) {
          io.to(`user:${notification.fromUser.toString()}`).emit("studyCircle:newNotification", populatedInviterNotification);
        }
      } catch (socketError) {
        console.error("Error notifying inviter:", socketError);
        // Don't fail the response if socket notification fails
      }
    })();

    return res.json(responseData);
  } catch (error) {
    console.error("Error responding to invitation:", error);
    return res.status(500).json({ message: "Failed to respond to invitation", error: process.env.NODE_ENV === "development" ? error.message : undefined });
  }
});

router.get("/groups/:groupId/messages", async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group id" });
    }

    const group = await Group.findOne({ _id: groupId, members: req.userId });
    if (!group) {
      return res.status(404).json({ message: "Group not found or access denied" });
    }

    const messages = await Message.find({ group: groupId })
      .populate("sender", "name email")
      .populate("note", "subject content fileUrl fileName createdAt")
      .sort({ createdAt: 1 })
      .limit(300);

    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch messages" });
  }
});

router.patch("/groups/:groupId/read", async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group id" });
    }

    const group = await Group.findOne({ _id: groupId, members: req.userId });
    if (!group) {
      return res.status(404).json({ message: "Group not found or access denied" });
    }

    const existingState = group.memberStates.find((entry) => entry.user.toString() === req.userId);
    if (existingState) {
      existingState.unreadCount = 0;
      existingState.lastReadAt = new Date();
    } else {
      group.memberStates.push({ user: req.userId, unreadCount: 0, lastReadAt: new Date() });
    }

    await group.save();

    await Message.updateMany(
      { group: groupId, sender: { $ne: req.userId } },
      { $addToSet: { seenBy: req.userId } }
    );

    await Notification.updateMany(
      { userId: req.userId, groupId, type: "message", status: "pending" },
      { $set: { status: "read" } }
    );

    return res.json({ message: "Group marked as read" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to mark group as read" });
  }
});

router.post("/groups/:groupId/leave", async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group id" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is a member
    if (!group.members.some((memberId) => memberId.toString() === req.userId)) {
      return res.status(400).json({ message: "You are not a member of this group" });
    }

    // Remove user from members
    group.members = group.members.filter((memberId) => memberId.toString() !== req.userId);

    // Remove user's member state
    group.memberStates = (group.memberStates || []).filter(
      (state) => state.user.toString() !== req.userId
    );

    // Remove user from pending invites if any
    group.pendingInvites = (group.pendingInvites || []).filter(
      (invite) => invite.user.toString() !== req.userId
    );

    await group.save();

    return res.json({ message: "Successfully left the group" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to leave group" });
  }
});

router.delete("/groups/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group id" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Only creator can delete group
    if (group.creator.toString() !== req.userId) {
      return res.status(403).json({ message: "Only the creator can delete this group" });
    }

    // Delete all messages in the group
    await Message.deleteMany({ group: groupId });

    // Delete all notifications related to this group
    await Notification.deleteMany({ groupId });

    // Delete the group
    await Group.findByIdAndDelete(groupId);

    return res.json({ message: "Group deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete group" });
  }
});

module.exports = router;