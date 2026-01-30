import { Outlet, useParams } from "react-router";
import { useEffect, useState } from "react";
import ProjectTabs from "../../components/projects/ProjectTabs";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "../../services/axiosInstance";

export default function ProjectLayout() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try{
    const res = await axios.get(`/projects/${projectId}`);
    setProject(res.data.project);
    }catch(e)
    {
      setError(true);
    }
  };

  if (!project) return <DashboardLayout>Loading...</DashboardLayout>;
  if(error) return <DashboardLayout>!!!!!ERROR FETCHING PROJECT</DashboardLayout>
  return (
    <DashboardLayout>
      {/* Tabs */}
      <ProjectTabs projectId={projectId} />
      {/* Content */}
      <div className="mt-6">
        <Outlet context={{ project, refreshProject: fetchProject}} />
      </div>
    </DashboardLayout>
  );
}
