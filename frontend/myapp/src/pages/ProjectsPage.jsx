import { useEffect, useState } from "react";
import { Link } from "react-router";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProjectCard from "../components/projects/ProjectCard";
import axios from "../services/axiosInstance";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("/projects");
      setProjects(res.data.projects);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Projects</h1>

        <Link
          to="/projects/new"
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 text-sm"
        >
          + Create Project
        </Link>
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded text-center">
          <p className="mb-4 text-gray-600">No projects yet</p>
          <Link
            to="/projects/new"
            className="px-4 py-2 bg-black text-white rounded"
          >
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
