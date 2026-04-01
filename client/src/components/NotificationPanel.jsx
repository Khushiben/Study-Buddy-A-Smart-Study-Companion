import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "../styles/NotificationPanel.css";

const API_BASE_URL = "http://localhost:5000";

function NotificationPanel() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const socketRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissTimers, setDismissTimers] = useState({});
  const [respondingTo, setRespondingTo] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/study-circle/notifications`, {
        headers: authHeaders,
      });
      if (!res.ok) {
        throw new Error("Failed to load notifications");
      }
      const data = await res.json();
      // Only show pending notifications on load
      const pendingNotifications = (data || []).filter((n) => n.status === "pending");
      setNotifications(pendingNotifications);
    } catch (error) {
      console.error("Error loading notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Setup socket connection for real-time notifications
  useEffect(() => {
    if (!token) return;

    const socket = io(API_BASE_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    // Listen for new notifications in real-time
    socket.on("studyCircle:newNotification", (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    // Load initial notifications
    loadNotifications();

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const dismissNotification = (notificationId) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification._id !== notificationId)
    );
    
    // Clear any pending timer
    if (dismissTimers[notificationId]) {
      clearTimeout(dismissTimers[notificationId]);
      setDismissTimers((prev) => {
        const newTimers = { ...prev };
        delete newTimers[notificationId];
        return newTimers;
      });
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`${API_BASE_URL}/api/study-circle/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers: authHeaders,
      });
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, status: "read" }
            : notification
        )
      );

      // Auto-dismiss after 4 seconds
      const timer = setTimeout(() => {
        dismissNotification(notificationId);
      }, 4000);

      setDismissTimers((prev) => ({
        ...prev,
        [notificationId]: timer,
      }));
    } catch (error) {
      return;
    }
  };

  const handleOpenNotification = async (notification) => {
    await markAsRead(notification._id);
    if (notification.groupId?._id) {
      navigate("/study-circle", { state: { groupId: notification.groupId._id } });
    }
  };

  const handleInviteResponse = async (notificationId, action) => {
    try {
      setRespondingTo(notificationId);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const res = await fetch(
        `${API_BASE_URL}/api/study-circle/invitations/${notificationId}/respond`,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({ action }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      let payload;
      try {
        payload = await res.json();
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        throw new Error("Invalid server response");
      }

      // Check if response indicates success (either res.ok or success flag)
      const isSuccessful = res.ok || payload?.success === true;

      if (!isSuccessful) {
        throw new Error(payload?.message || `Failed to ${action} invitation`);
      }

      // Remove the notification from UI after successful response
      dismissNotification(notificationId);
      setRespondingTo(null);

      // Show success message
      if (action === "accept") {
        showStatusMessage("✅ Invitation accepted! Redirecting to group...", "success");
        // Navigate to the group after a short delay
        setTimeout(() => {
          if (payload.group?._id) {
            try {
              navigate("/study-circle", { state: { groupId: payload.group._id } });
            } catch (navError) {
              console.error("Navigation error:", navError);
              navigate("/study-circle");
            }
          } else {
            navigate("/study-circle");
          }
        }, 500);
      } else if (action === "reject") {
        showStatusMessage("✅ Invitation rejected", "success");
      }
    } catch (error) {
      setRespondingTo(null);
      const errorMessage = error.name === "AbortError" 
        ? "Request timeout - please try again" 
        : error.message;
      showStatusMessage(
        `❌ ${errorMessage}`,
        "error"
      );
      console.error(`Error responding to ${action} invitation:`, error);
    }
  };

  const showStatusMessage = (message, type = "info") => {
    setStatusMessage({ text: message, type });
    // Auto-clear after 4 seconds
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  return (
    <section className="notification-panel">
      <div className="notification-panel-header">
        <h3>Notifications</h3>
        <button type="button" onClick={loadNotifications}>
          Refresh
        </button>
      </div>

      {statusMessage && (
        <div className={`notification-status notification-status-${statusMessage.type}`}>
          {statusMessage.text}
        </div>
      )}

      {loading ? <p className="notification-muted">Loading notifications...</p> : null}

      {!loading && notifications.length === 0 ? (
        <p className="notification-muted">No notifications yet.</p>
      ) : null}

      <div className="notification-list">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className={`notification-item ${notification.status === "pending" ? "pending" : "read"}`}
          >
            <div
              className="notification-content"
              onClick={() => handleOpenNotification(notification)}
            >
              <h4>
                {notification.type === "invite" ? "Group Invitation" : 
                 notification.type === "invitation_accepted" ? "Invitation Accepted" :
                 notification.type === "invitation_rejected" ? "Invitation Rejected" :
                 "New Message"}
              </h4>
              <p>{notification.text || "Open to view details"}</p>
              <small>
                {notification.groupId?.name ? `${notification.groupId.name} • ` : ""}
                {new Date(notification.createdAt).toLocaleString()}
              </small>
            </div>

            <div className="notification-actions">
              {notification.type === "invite" && notification.status === "pending" ? (
                <>
                  <button
                    type="button"
                    className="accept"
                    onClick={() => handleInviteResponse(notification._id, "accept")}
                    disabled={respondingTo === notification._id}
                  >
                    {respondingTo === notification._id ? "Processing..." : "Accept"}
                  </button>
                  <button
                    type="button"
                    className="reject"
                    onClick={() => handleInviteResponse(notification._id, "reject")}
                    disabled={respondingTo === notification._id}
                  >
                    {respondingTo === notification._id ? "Processing..." : "Reject"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="close"
                  onClick={() => dismissNotification(notification._id)}
                  title="Close notification"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default NotificationPanel;
