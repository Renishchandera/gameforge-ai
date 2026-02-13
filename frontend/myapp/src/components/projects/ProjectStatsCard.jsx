export default function ProjectStatsCard({ stats, project }) {
  if (!stats || stats.total === 0) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-2">Project Progress</h2>
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-3">📊</div>
          <p className="text-gray-500">No tasks yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Add tasks to track project progress
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Project Progress</h2>
        <span className="text-3xl font-bold text-gray-900">
          {stats.completionPercentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-black rounded-full h-3 transition-all duration-500 ease-out"
          style={{ width: `${stats.completionPercentage}%` }}
        />
      </div>

      {/* Task Breakdown */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-900">{stats.todo}</div>
          <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <span>📋</span> To Do
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-900">{stats.inProgress}</div>
          <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <span>⚙️</span> In Progress
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-900">{stats.done}</div>
          <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <span>✅</span> Done
          </div>
        </div>
      </div>

      {/* Priority Breakdown */}
      {stats.byPriority && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-gray-500 mb-2">By Priority</p>
          <div className="flex gap-3">
            <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
              High: {stats.byPriority.high || 0}
            </span>
            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
              Medium: {stats.byPriority.medium || 0}
            </span>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
              Low: {stats.byPriority.low || 0}
            </span>
          </div>
        </div>
      )}

      {/* Timeline Info */}
      <div className="mt-4 pt-4 border-t text-xs text-gray-400 flex justify-between">
        <span>Started: {new Date(project.createdAt).toLocaleDateString()}</span>
        <span>Last activity: {new Date(project.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}