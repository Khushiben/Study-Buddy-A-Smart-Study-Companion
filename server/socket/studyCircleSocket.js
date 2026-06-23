const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Group = require("../models/Group");
const Message = require("../models/Message");
const Note = require("../models/Note");
const Notification = require("../models/Notification");

const activeGroupSessions = new Map();

const activateGroupForUser = (userId, groupId, socket) => {
  const previousGroupId = socket.activeGroupId;
  if (previousGroupId) {
    const previousByGroup = activeGroupSessions.get(userId);
    if (previousByGroup?.has(previousGroupId)) {
      const nextCount = previousByGroup.get(previousGroupId) - 1;
      if (nextCount <= 0) {
        previousByGroup.delete(previousGroupId);
      } else {
        previousByGroup.set(previousGroupId, nextCount);
      }
    }
    if (previousByGroup && previousByGroup.size === 0) {
      activeGroupSessions.delete(userId);
    }
  }

  if (groupId) {
    const userGroups = activeGroupSessions.get(userId) || new Map();
    const currentCount = userGroups.get(groupId) || 0;
    userGroups.set(groupId, currentCount + 1);
    activeGroupSessions.set(userId, userGroups);
  }

  socket.activeGroupId = groupId;
};

const isUserActiveInGroup = (userId, groupId) => {
  const userGroups = activeGroupSessions.get(userId);
  if (!userGroups) {
    return false;
  }

  return (userGroups.get(groupId) || 0) > 0;
};

const extractToken = (socket) => {
  const authToken = socket.handshake?.auth?.token;
  if (authToken) {
    return authToken;
  }

  const headerToken = socket.handshake?.headers?.authorization;
  if (headerToken && headerToken.startsWith("Bearer ")) {
    return headerToken.split(" ")[1];
  }

  return null;
};

const authorizeSocket = async (socket, next) => {
  try {
    const token = extractToken(socket);

    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    return next();
  } catch (error) {
    return next(new Error("Authentication failed"));
  }
};

const roomNameForGroup = (groupId) => `group:${groupId}`;

const registerStudyCircleSocket = (io) => {
  io.use(authorizeSocket);

  io.on("connection", (socket) => {
    const userRoom = `user:${socket.userId}`;
    socket.join(userRoom);

    socket.on("studyCircle:joinGroup", async (payload = {}) => {
      const { groupId } = payload;

      if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) {
        socket.emit("studyCircle:error", { message: "Invalid group id" });
        return;
      }

      const isMember = await Group.exists({ _id: groupId, members: socket.userId });
      if (!isMember) {
        socket.emit("studyCircle:error", { message: "You are not a member of this group" });
        return;
      }

      socket.join(roomNameForGroup(groupId));
      activateGroupForUser(socket.userId, groupId, socket);
      socket.emit("studyCircle:joined", { groupId });
    });

    socket.on("studyCircle:leaveGroup", ({ groupId } = {}) => {
      if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) {
        return;
      }

      socket.leave(roomNameForGroup(groupId));
      if (socket.activeGroupId === groupId) {
        activateGroupForUser(socket.userId, null, socket);
      }
    });

    socket.on("studyCircle:markRead", async ({ groupId } = {}) => {
      try {
        if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) {
          return;
        }

        const group = await Group.findOne({ _id: groupId, members: socket.userId });
        if (!group) {
          return;
        }

        const state = group.memberStates?.find((entry) => entry.user.toString() === socket.userId);
        if (state) {
          state.unreadCount = 0;
          state.lastReadAt = new Date();
        } else {
          group.memberStates.push({ user: socket.userId, unreadCount: 0, lastReadAt: new Date() });
        }

        await group.save();

        await Message.updateMany(
          { group: groupId, sender: { $ne: socket.userId } },
          { $addToSet: { seenBy: socket.userId } }
        );

        await Notification.updateMany(
          { userId: socket.userId, groupId, type: "message", status: "pending" },
          { $set: { status: "read" } }
        );

        io.to(userRoom).emit("studyCircle:unreadUpdated", { groupId, unreadCount: 0 });
      } catch (error) {
        socket.emit("studyCircle:error", { message: "Failed to mark messages as read" });
      }
    });

    socket.on("studyCircle:sendMessage", async (payload = {}) => {
      try {
        const { groupId, text = "", noteId = null } = payload;
        const trimmedText = text.trim();

        if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) {
          socket.emit("studyCircle:error", { message: "Invalid group id" });
          return;
        }

        if (!trimmedText && !noteId) {
          socket.emit("studyCircle:error", { message: "Message text or note is required" });
          return;
        }

        const group = await Group.findOne({ _id: groupId, members: socket.userId });
        if (!group) {
          socket.emit("studyCircle:error", { message: "Group not found or access denied" });
          return;
        }

        let statesChanged = false;
        for (const memberId of group.members) {
          const exists = group.memberStates?.some(
            (entry) => entry.user.toString() === memberId.toString()
          );
          if (!exists) {
            group.memberStates.push({ user: memberId, unreadCount: 0, lastReadAt: new Date() });
            statesChanged = true;
          }
        }
        if (statesChanged) {
          await group.save();
        }

        let note = null;
        if (noteId) {
          if (!mongoose.Types.ObjectId.isValid(noteId)) {
            socket.emit("studyCircle:error", { message: "Invalid note id" });
            return;
          }

          note = await Note.findOne({ _id: noteId, userId: socket.userId });
          if (!note) {
            socket.emit("studyCircle:error", { message: "Note not found or access denied" });
            return;
          }
        }

        const message = await Message.create({
          group: groupId,
          sender: socket.userId,
          text: trimmedText,
          note: note ? note._id : null,
          seenBy: [socket.userId],
        });

        const populatedMessage = await Message.findById(message._id)
          .populate("sender", "name email")
          .populate("note", "subject content fileUrl fileName createdAt");

        io.to(roomNameForGroup(groupId)).emit("studyCircle:newMessage", populatedMessage);

        const receiverIds = group.members
          .map((memberId) => memberId.toString())
          .filter((memberId) => memberId !== socket.userId);

        for (const receiverId of receiverIds) {
          const receiverIsActive = isUserActiveInGroup(receiverId, groupId);

          if (receiverIsActive) {
            await Message.updateOne(
              { _id: message._id },
              { $addToSet: { seenBy: receiverId } }
            );
            continue;
          }

          await Group.updateOne(
            { _id: groupId, "memberStates.user": receiverId },
            { $inc: { "memberStates.$.unreadCount": 1 } }
          );

          await Notification.create({
            type: "message",
            userId: receiverId,
            fromUser: socket.userId,
            groupId,
            messageId: message._id,
            status: "pending",
            text: trimmedText ? `New message in ${group.name}` : `${group.name}: shared a note`,
          });

          const refreshedGroup = await Group.findById(groupId).select("memberStates");
          const receiverState = refreshedGroup?.memberStates?.find(
            (entry) => entry.user.toString() === receiverId
          );

          io.to(`user:${receiverId}`).emit("studyCircle:unreadUpdated", {
            groupId,
            unreadCount: receiverState?.unreadCount || 0,
          });

          io.to(`user:${receiverId}`).emit("studyCircle:newNotification", {
            type: "message",
            groupId,
          });
        }
      } catch (error) {
        socket.emit("studyCircle:error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      if (socket.activeGroupId) {
        activateGroupForUser(socket.userId, null, socket);
      }
    });
  });
};

module.exports = registerStudyCircleSocket;