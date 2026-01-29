import { NavLink } from "react-router";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Overview", path: "" },
  { label: "Success Prediction", path: "prediction" },
  { label: "Tasks", path: "tasks" },
  { label: "Documents", path: "documents" }
];

export default function ProjectTabs({ projectId }) {
  return (
    <div className="border-b flex gap-6">
      {tabs.map((tab) => (
        <NavLink
          key={tab.label}
          to={`/projects/${projectId}/${tab.path}`}
          end={tab.path === ""}
          className={({ isActive }) =>
            cn(
              "pb-2 text-sm font-medium",
              isActive
                ? "border-b-2 border-black"
                : "text-gray-500 hover:text-black"
            )
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
