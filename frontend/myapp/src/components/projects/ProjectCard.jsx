import { Link } from "react-router";

export default function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project._id}`}
      className="block border rounded-lg bg-white p-4 hover:shadow-sm transition"
    >
      <h3 className="font-semibold text-lg mb-1">
        {project.name}
      </h3>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {project.description || "No description"}
      </p>

      <div className="flex flex-wrap gap-2 text-xs">
        {project.genre && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
            {project.genre}
          </span>
        )}
        {project.platform && (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
            {project.platform}
          </span>
        )}
        <span className="px-2 py-1 bg-gray-100 rounded">
          {project.status}
        </span>
      </div>
    </Link>
  );
}
