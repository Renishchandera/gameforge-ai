import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Link } from "react-router";

export default function HomePage() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600 text-sm">
          Welcome back. What do you want to work on today?
        </p>
      </div>

      {/* Main actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <DashboardCard
          title="Generate Game Idea"
          description="Use AI to generate a new game idea based on your inputs."
          action={
            <Link
              to="/generate/idea"
              className="inline-block px-4 py-2 bg-black text-white rounded hover:bg-gray-800 text-sm"
            >
              Generate Idea →
            </Link>
          }
        />

        <DashboardCard
          title="Saved Ideas"
          description="View and manage ideas you've previously saved."
          action={
            <Link
              to="/my/ideas"
              className="inline-block px-4 py-2 border rounded hover:bg-gray-100 text-sm"
            >
              View Ideas →
            </Link>
          }
        />

        <DashboardCard
          title="Projects"
          description="Create or manage your game development projects."
          action={
            <Link
              to="/projects"
              className="inline-block px-4 py-2 border rounded hover:bg-gray-100 text-sm"
            >
              Go to Projects →
            </Link>
          }
        />
      </div>

      {/* Future section
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-3">Coming Next</h2>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>AI Success Prediction</li>
          <li>GDD Generator</li>
          <li>Task & Todo Management</li>
          <li>Design Documents</li>
        </ul>
      </div> */}
    </DashboardLayout>
  );
}
