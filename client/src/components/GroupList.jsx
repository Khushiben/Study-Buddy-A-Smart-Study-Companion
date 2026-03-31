import React from "react";

function GroupList({
  groups,
  activeGroupId,
  onSelectGroup,
  createGroupName,
  setCreateGroupName,
  onCreateGroup,
  joinGroupId,
  setJoinGroupId,
  onJoinGroup,
  loading,
}) {
  return (
    <aside className="study-circle-groups-panel">
      <div className="study-circle-panel-block">
        <h3>Your Groups</h3>
        {loading ? (
          <p className="muted">Loading groups...</p>
        ) : groups.length === 0 ? (
          <p className="muted">No groups yet. Create one to start chatting.</p>
        ) : (
          <ul className="study-circle-groups-list">
            {groups.map((group) => (
              <li
                key={group._id}
                className={activeGroupId === group._id ? "active" : ""}
                onClick={() => onSelectGroup(group)}
              >
                <div className="group-row-header">
                  <div className="group-name">{group.name}</div>
                  {group.unreadCount > 0 ? (
                    <span className="group-unread-badge">{group.unreadCount}</span>
                  ) : null}
                </div>
                <small>
                  {group.members?.length || 0} member
                  {(group.members?.length || 0) === 1 ? "" : "s"}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="study-circle-panel-block">
        <h4>Create Group</h4>
        <div className="inline-form">
          <input
            value={createGroupName}
            onChange={(e) => setCreateGroupName(e.target.value)}
            placeholder="Group name"
          />
          <button type="button" onClick={onCreateGroup}>
            Create
          </button>
        </div>
      </div>

      <div className="study-circle-panel-block">
        <h4>Join by Group ID</h4>
        <div className="inline-form">
          <input
            value={joinGroupId}
            onChange={(e) => setJoinGroupId(e.target.value)}
            placeholder="Paste group id"
          />
          <button type="button" onClick={onJoinGroup}>
            Join
          </button>
        </div>
      </div>
    </aside>
  );
}

export default GroupList;