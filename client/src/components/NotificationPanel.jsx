import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NotificationPanel.css";

const API_BASE_URL = "http://localhost:5000";

function NotificationPanel() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setNotifications(data || []);
    } catch (error) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

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
      const res = await fetch(
        `${API_BASE_URL}/api/study-circle/invitations/${notificationId}/respond`,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({ action }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update invitation");
      }

      const payload = await res.json();

      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );

      if (action === "accept" && payload.group?._id) {
        navigate("/study-circle", { state: { groupId: payload.group._id } });
      }
    } catch (error) {
      return;
    }
  };

  return (
    <section className="notification-panel">
      <div className="notification-panel-header">
        <h3>Notifications</h3>
        <button type="button" onClick={loadNotifications}>
          Refresh
        </button>
      </div>

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
                {notification.type === "invite" ? "Group Invitation" : "New Message"}
              </h4>
              <p>{notification.text || "Open to view details"}</p>
              <small>
                {notification.groupId?.name ? `${notification.groupId.name} • ` : ""}
                {new Date(notification.createdAt).toLocaleString()}
              </small>
            </div>

            {notification.type === "invite" && notification.status === "pending" ? (
              <div className="notification-actions">
                <button
                  type="button"
                  className="accept"
                  onClick={() => handleInviteResponse(notification._id, "accept")}
                >
                  Accept
                </button>
                <button
                  type="button"
                  className="reject"
                  onClick={() => handleInviteResponse(notification._id, "reject")}
                >
                  Reject
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export default NotificationPanel;
