import { useState } from "react";
import { updateProjectStatusAPI } from "../../features/projects/projectAPI";
import { PROJECT_STATUSES } from "../../shared/constants/gameConstants";

export default function ProjectStatusManager({ project, onStatusUpdate, isInline = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(project.status);
  const [loading, setLoading] = useState(false);

  const currentStatus = PROJECT_STATUSES.find(s => s.value === project.status) || PROJECT_STATUSES[0];

  const handleUpdateStatus = async () => {
    if (selectedStatus === project.status) {
      setIsEditing(false);
      return;
    }

    try {
      setLoading(true);
      const res = await updateProjectStatusAPI(project._id, selectedStatus);
      onStatusUpdate(res.project);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Inline select for forms
  if (isInline) {
    return (
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        onBlur={handleUpdateStatus}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        disabled={loading}
      >
        {PROJECT_STATUSES.map(status => (
          <option key={status.value} value={status.value}>
            {status.icon} {status.label}
          </option>
        ))}
      </select>
    );
  }

  // View mode with badge
  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${currentStatus.color}`}>
          <span>{currentStatus.icon}</span>
          <span>{currentStatus.label}</span>
        </span>
        <button
          onClick={() => setIsEditing(true)}
          className="text-xs text-gray-500 hover:text-gray-700 hover:underline"
        >
          Change
        </button>
      </div>
    );
  }

  // Edit mode
  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      >
        {PROJECT_STATUSES.map(status => (
          <option key={status.value} value={status.value}>
            {status.icon} {status.label}
          </option>
        ))}
      </select>
      <button
        onClick={handleUpdateStatus}
        disabled={loading}
        className="text-xs bg-black text-white px-2 py-1 rounded hover:bg-gray-800 disabled:bg-gray-400"
      >
        Save
      </button>
      <button
        onClick={() => {
          setIsEditing(false);
          setSelectedStatus(project.status);
        }}
        className="text-xs text-gray-500 hover:text-gray-700"
      >
        Cancel
      </button>
    </div>
  );
}