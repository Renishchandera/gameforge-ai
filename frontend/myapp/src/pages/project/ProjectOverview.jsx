import { useOutletContext } from "react-router";

export default function ProjectOverview() {
  const { project } = useOutletContext();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-1">Game Details</h3>
              {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
        {project.description}
        </pre>
      </div>
        <p><strong>Genre:</strong> {project.genre || "—"}</p>
        <p><strong>Platform:</strong> {project.platform || "—"}</p>
        <p><strong>Monetization:</strong> {project.monetization || "—"}</p>
      </div>

      <div>
        <h3 className="font-semibold mb-1">Status</h3>
        <p className="capitalize">{project.status}</p>
      </div>
    </div>
  );
}
