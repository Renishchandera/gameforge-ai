import { Outlet, useParams } from "react-router";
import { useEffect, useState } from "react";
import ProjectTabs from "../../components/projects/ProjectTabs";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "../../services/axiosInstance";

export default function ProjectLayout() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    const res = await axios.get(`/projects/${projectId}`);
    setProject(res.data.project);
  };

  if (!project) return <DashboardLayout>Loading...</DashboardLayout>;

  return (
    <DashboardLayout>
      {/* Tabs */}
      <ProjectTabs projectId={projectId} />
      {/* Content */}
      <div className="mt-6">
        <Outlet context={{ project }} />
      </div>
    </DashboardLayout>
  );
}
