import { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router";
import ProjectDetailsCard from "../../components/projects/ProjectDetailsCard";
import ProjectStatsCard from "../../components/projects/ProjectStatsCard";
import TaskBoard from "../../components/tasks/TaskBoard";
import { getProjectStatsAPI } from "../../features/projects/projectAPI";

export default function ProjectOverview() {
  const { projectId } = useParams();
  const { project, refreshProject } = useOutletContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [projectId]);

  const fetchStats = async () => {
    try {
      const res = await getProjectStatsAPI(projectId);
      setStats(res.stats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectUpdate = (updatedProject) => {
    refreshProject();
    fetchStats();
  };

  return (
    <div className="space-y-8">
      {/* Project Details Card - Now with full edit capabilities */}
      <ProjectDetailsCard 
        project={project} 
        onProjectUpdate={handleProjectUpdate}
      />

      {/* Two Column Layout for Stats and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Card - 2 columns on large screens */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="bg-white rounded-lg border p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          ) : (
            <ProjectStatsCard stats={stats} project={project} />
          )}
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
              <span>➕</span>
              Add Task
            </button>
            <button className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
              <span>📧</span>
              Share Project
            </button>
            <button className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
              <span>📊</span>
              Generate Report
            </button>
          </div>

          {/* Project Info */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-xs font-medium text-gray-500 mb-3">PROJECT INFO</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Created by</span>
                <span className="text-gray-900">You</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Project ID</span>
                <span className="text-gray-600 font-mono text-xs">
                  {project._id.slice(-8)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Board */}
      {/* <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold">Task Board</h2>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop tasks to update their status
            </p>
          </div>
          <button className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
        </div>
        <TaskBoard projectId={projectId} />
      </div> */}
    </div>
  );
}