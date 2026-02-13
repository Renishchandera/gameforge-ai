import { useState } from "react";

export default function TaskColumn({ 
  title, 
  status, 
  tasks, 
  onStatusChange, 
  onDelete,
  onQuickMove,
  nextStatus,
  prevStatus,
  nextLabel = "Move",
  prevLabel = "Move Back"
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "todo": return "📋";
      case "in-progress": return "⚙️";
      case "done": return "✅";
      default: return "•";
    }
  };

  const toggleExpand = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  return (
    <div className="bg-gray-50 rounded-xl p-5 h-full flex flex-col border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Column Header */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getStatusIcon(status)}</span>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="bg-gray-200 text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-colors"
          aria-label={collapsed ? "Expand" : "Collapse"}
        >
          <svg 
            className={`w-5 h-5 transform transition-transform ${collapsed ? '' : 'rotate-180'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Tasks Container */}
      {!collapsed && (
        <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] pr-1">
          {tasks.length === 0 ? (
            <div className="text-center py-8 px-4">
              <div className="text-gray-400 text-4xl mb-2">📭</div>
              <p className="text-gray-400 text-sm">No tasks yet</p>
              {status === "todo" && (
                <p className="text-xs text-gray-400 mt-1">Add a task to get started</p>
              )}
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                columnStatus={status}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
                onQuickMove={onQuickMove}
                nextStatus={nextStatus}
                prevStatus={prevStatus}
                nextLabel={nextLabel}
                prevLabel={prevLabel}
                isExpanded={expandedTaskId === task._id}
                onToggleExpand={() => toggleExpand(task._id)}
                getPriorityColor={getPriorityColor}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------ TASK CARD COMPONENT ------------------ */

function TaskCard({ 
  task, 
  columnStatus, 
  onStatusChange, 
  onDelete,
  onQuickMove,
  nextStatus,
  prevStatus,
  nextLabel,
  prevLabel,
  isExpanded,
  onToggleExpand,
  getPriorityColor 
}) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date() && columnStatus !== 'done';
  };

  return (
    <div 
      className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 ${
        isHovered ? 'border-gray-300' : 'border-gray-200'
      } ${columnStatus === 'done' ? 'opacity-75' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Content */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          {/* Title and Priority */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-gray-900 break-words pr-2">
              {task.title}
            </h4>
            <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>

          {/* Description (expanded or truncated) */}
          {task.description && (
            <div className="mt-2">
              <p className={`text-sm text-gray-600 ${!isExpanded ? 'line-clamp-2' : ''}`}>
                {task.description}
              </p>
              {task.description.length > 100 && (
                <button
                  onClick={onToggleExpand}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-1 font-medium"
                >
                  {isExpanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <div className="mt-3 flex items-center gap-1">
              <span className="text-gray-400 text-xs">📅</span>
              <span className={`text-xs ${
                isOverdue(task.dueDate) 
                  ? 'text-red-600 font-medium' 
                  : 'text-gray-500'
              }`}>
                {formatDate(task.dueDate)}
                {isOverdue(task.dueDate) && ' ⏰ Overdue'}
              </span>
            </div>
          )}

          {/* Quick Action Buttons (Visible on Hover) */}
          <div className={`flex gap-2 mt-3 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            {prevStatus && (
              <button
                onClick={() => onStatusChange(task._id, prevStatus)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
              >
                <span>←</span> {prevLabel}
              </button>
            )}
            {nextStatus && (
              <button
                onClick={() => onStatusChange(task._id, nextStatus)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 ${
                  nextStatus === 'done' 
                    ? 'bg-green-100 hover:bg-green-200 text-green-700' 
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                }`}
              >
                {nextLabel} <span>→</span>
              </button>
            )}
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(task._id)}
          className={`text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50 ${
            isHovered ? 'opacity-100' : 'opacity-50'
          }`}
          aria-label="Delete task"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Status Badge (Mobile/Always visible alternative) */}
      <div className="md:hidden flex gap-2 mt-3 pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
          {task.status.replace('-', ' ')}
        </span>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          className="text-xs border rounded px-2 py-1 bg-white"
          aria-label="Change status"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  );
}