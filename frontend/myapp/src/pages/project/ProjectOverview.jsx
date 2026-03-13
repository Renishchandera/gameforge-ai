import { useState, useEffect } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router";
import ProjectDetailsCard from "../../components/projects/ProjectDetailsCard";
import ProjectStatsCard from "../../components/projects/ProjectStatsCard";
import TaskBoard from "../../components/tasks/TaskBoard";
import { getProjectStatsAPI, deleteProjectAPI } from "../../features/projects/projectAPI";

export default function ProjectOverview() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { project, refreshProject } = useOutletContext();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleProjectUpdate = () => {
    refreshProject();
    fetchStats();
  };

  /**
   * Delete Project
   */
  const handleDeleteProject = async () => {
    try {
      setDeleting(true);
      await deleteProjectAPI(projectId);

      setShowDeleteModal(false);
      navigate("/projects");

    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* Project Details */}
      <ProjectDetailsCard
        project={project}
        onProjectUpdate={handleProjectUpdate}
      />

         {/* Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
      </div>

 

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">

            <h2 className="text-lg font-semibold mb-2">
              Delete Project
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this project?  
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteProject}
                disabled={deleting}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>

            </div>
          </div>

        </div>
      )}


  {/* Delete Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Delete Project
        </button>
      </div>
    </div>
  );
}