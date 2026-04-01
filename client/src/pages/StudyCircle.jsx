import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Marquee from "../components/Marquee";
import Footer from "../components/Footer";
import GroupList from "../components/GroupList";
import ChatWindow from "../components/ChatWindow";
import NoteShareModal from "../components/NoteShareModal";
import "../styles/StudyCircle.css";

const API_BASE_URL = "http://localhost:5000";

function StudyCircle() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("User");
  const [userId, setUserId] = useState("");

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [notes, setNotes] = useState([]);

  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sharing, setSharing] = useState(false);

  const [createGroupName, setCreateGroupName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [messageText, setMessageText] = useState("");
  const [statusText, setStatusText] = useState("");

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [connected, setConnected] = useState(false);

  const socketRef = useRef(null);
  const previousGroupRef = useRef(null);
  const selectedGroupRef = useRef(null);
  const bottomRef = useRef(null);

  const authHeaders = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  const showStatus = (text) => {
    setStatusText(text);
    window.setTimeout(() => {
      setStatusText("");
    }, 2800);
  };

  const handleAuthFailure = (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      showStatus("Session expired. Please login again.");
      window.setTimeout(() => {
        navigate("/login", {
          state: { message: "Session expired. Please login again." },
          replace: true,
        });
      }, 500);
      return true;
    }
    return false;
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/user`, authHeaders);
      setUsername(res.data.name || "User");
      setUserId(res.data._id || "");
    } catch (error) {
      if (handleAuthFailure(error)) return;
      setUsername("User");
    }
  };

  const fetchGroups = async () => {
    try {
      setLoadingGroups(true);
      const res = await axios.get(`${API_BASE_URL}/api/study-circle/groups`, authHeaders);
      setGroups(res.data || []);

      setSelectedGroup((prev) => {
        if (!res.data?.length) return null;
        const groupIdFromNotification = location.state?.groupId;
        if (!prev && groupIdFromNotification) {
          return res.data.find((group) => group._id === groupIdFromNotification) || null;
        }
        if (!prev) return null;
        return res.data.find((group) => group._id === prev._id) || res.data[0];
      });
    } catch (error) {
      if (handleAuthFailure(error)) return;
      showStatus(error.response?.data?.message || "Failed to load groups");
    } finally {
      setLoadingGroups(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/notes`, authHeaders);
      setNotes(res.data || []);
    } catch (error) {
      if (handleAuthFailure(error)) return;
      setNotes([]);
    }
  };

  const fetchMessages = async (groupId) => {
    if (!groupId) return;

    try {
      setLoadingMessages(true);
      const res = await axios.get(
        `${API_BASE_URL}/api/study-circle/groups/${groupId}/messages`,
        authHeaders
      );
      setMessages(res.data || []);
    } catch (error) {
      if (handleAuthFailure(error)) return;
      showStatus(error.response?.data?.message || "Failed to load messages");
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchGroups();
    fetchNotes();
  }, []);

  const markGroupAsRead = async (groupId) => {
    if (!groupId) return;

    try {
      await axios.patch(`${API_BASE_URL}/api/study-circle/groups/${groupId}/read`, {}, authHeaders);
      setGroups((prev) =>
        prev.map((group) =>
          group._id === groupId ? { ...group, unreadCount: 0 } : group
        )
      );
    } catch (error) {
      if (handleAuthFailure(error)) return;
    }
  };

  useEffect(() => {
    selectedGroupRef.current = selectedGroup;
  }, [selectedGroup]);

  useEffect(() => {
    if (!token) return undefined;

    const socket = io(API_BASE_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("studyCircle:newMessage", (message) => {
      setMessages((prev) => {
        if (String(message.group) !== selectedGroupRef.current?._id) {
          return prev;
        }
        return [...prev, message];
      });
    });

    socket.on("studyCircle:error", (payload) => {
      showStatus(payload?.message || "Socket error occurred");
    });

    socket.on("studyCircle:unreadUpdated", ({ groupId, unreadCount }) => {
      setGroups((prev) =>
        prev.map((group) =>
          group._id === String(groupId)
            ? { ...group, unreadCount: Number(unreadCount) || 0 }
            : group
        )
      );
    });

    socket.on("studyCircle:newNotification", () => {
      fetchGroups();
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    const nextGroupId = selectedGroup?._id;
    const previousGroupId = previousGroupRef.current;

    if (!socketRef.current || !nextGroupId) return;

    if (previousGroupId && previousGroupId !== nextGroupId) {
      socketRef.current.emit("studyCircle:leaveGroup", { groupId: previousGroupId });
    }

    previousGroupRef.current = nextGroupId;
    socketRef.current.emit("studyCircle:joinGroup", { groupId: nextGroupId });
    fetchMessages(nextGroupId);
    markGroupAsRead(nextGroupId);
    socketRef.current.emit("studyCircle:markRead", { groupId: nextGroupId });
  }, [selectedGroup?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onCreateGroup = async () => {
    if (!createGroupName.trim()) {
      showStatus("Group name is required");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/study-circle/groups`,
        { name: createGroupName.trim() },
        authHeaders
      );

      setGroups((prev) => [res.data, ...prev]);
      setSelectedGroup(res.data);
      setCreateGroupName("");
      showStatus("Group created");
    } catch (error) {
      if (handleAuthFailure(error)) return;
      showStatus(error.response?.data?.message || "Failed to create group");
    }
  };

  const onInvite = async () => {
    if (!selectedGroup?._id) {
      showStatus("Select a group first");
      return;
    }

    if (!inviteEmail.trim()) {
      showStatus("Enter an email address");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/study-circle/groups/${selectedGroup._id}/invite`,
        { email: inviteEmail.trim() },
        authHeaders
      );

      setGroups((prev) =>
        prev.map((group) => (group._id === res.data._id ? res.data : group))
      );
      setSelectedGroup(res.data);
      setInviteEmail("");
      showStatus("User invited to group");
    } catch (error) {
      if (handleAuthFailure(error)) return;
      showStatus(error.response?.data?.message || "Failed to invite user");
    }
  };



  const onSendMessage = (e) => {
    e.preventDefault();

    if (!selectedGroup?._id) {
      showStatus("Select a group first");
      return;
    }

    if (!messageText.trim()) return;

    socketRef.current?.emit("studyCircle:sendMessage", {
      groupId: selectedGroup._id,
      text: messageText.trim(),
    });

    setMessageText("");
  };

  const onShareNote = (noteId) => {
    if (!selectedGroup?._id) {
      showStatus("Select a group first");
      return;
    }

    setSharing(true);
    socketRef.current?.emit("studyCircle:sendMessage", {
      groupId: selectedGroup._id,
      text: "Shared a note",
      noteId,
    });
    window.setTimeout(() => {
      setSharing(false);
      setNoteModalOpen(false);
    }, 300);
  };

  const onDeleteGroup = async () => {
    if (!selectedGroup?._id) {
      showStatus("Select a group first");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${selectedGroup.name}"? This action cannot be undone and will delete all messages in this group.`
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/study-circle/groups/${selectedGroup._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGroups((prev) => prev.filter((group) => group._id !== selectedGroup._id));
      setSelectedGroup(null);
      showStatus("Group deleted successfully");
    } catch (error) {
      if (handleAuthFailure(error)) return;
      console.error("Delete group error:", error);
      showStatus(error.response?.data?.message || "Failed to delete group");
    }
  };

  const onLeaveGroup = async () => {
    if (!selectedGroup?._id) {
      showStatus("Select a group first");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to leave "${selectedGroup.name}"?`
    );

    if (!confirmed) return;

    try {
      await axios.post(
        `${API_BASE_URL}/api/study-circle/groups/${selectedGroup._id}/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGroups((prev) => prev.filter((group) => group._id !== selectedGroup._id));
      setSelectedGroup(null);
      showStatus("Left group successfully");
    } catch (error) {
      if (handleAuthFailure(error)) return;
      console.error("Leave group error:", error);
      showStatus(error.response?.data?.message || "Failed to leave group");
    }
  };

  const membersText = selectedGroup?.members?.map((member) => member.name).join(", ") || "";

  return (
    <div className="container study-circle-root">
      <Sidebar activePage="Study Circle" />

      <main className="main study-circle-main">
        <Marquee title="Study Circle" username={username} />

        {statusText ? <p className="study-circle-status">{statusText}</p> : null}

        <section className="study-circle-layout">
          <GroupList
            groups={groups}
            activeGroupId={selectedGroup?._id}
            onSelectGroup={setSelectedGroup}
            createGroupName={createGroupName}
            setCreateGroupName={setCreateGroupName}
            onCreateGroup={onCreateGroup}
            loading={loadingGroups}
          />

          <ChatWindow
            selectedGroup={selectedGroup}
            messages={messages}
            currentUserId={userId}
            loadingMessages={loadingMessages}
            messageText={messageText}
            setMessageText={setMessageText}
            onSendMessage={onSendMessage}
            onOpenShareNote={() => setNoteModalOpen(true)}
            connected={connected}
            membersText={membersText}
            inviteEmail={inviteEmail}
            setInviteEmail={setInviteEmail}
            onInviteMember={onInvite}
            onDeleteGroup={onDeleteGroup}
            onLeaveGroup={onLeaveGroup}
            isGroupCreator={selectedGroup?.creator?._id === userId}
          />
        </section>

        <div ref={bottomRef} />
        <Footer />
      </main>

      <NoteShareModal
        open={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        notes={notes}
        onShare={onShareNote}
        sharing={sharing}
      />
    </div>
  );
}

export default StudyCircle;