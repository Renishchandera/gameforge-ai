import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Generate Idea", path: "/generate/idea" },
  { label: "Saved Ideas", path: "/my/ideas" },
  { label: "Projects", path: "/projects" }
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 border-r bg-white min-h-screen px-4 py-6">
      <h2 className="text-xl font-bold mb-6">GameForge</h2>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "block px-3 py-2 rounded text-sm font-medium hover:bg-gray-100",
              location.pathname === item.path && "bg-gray-200"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
