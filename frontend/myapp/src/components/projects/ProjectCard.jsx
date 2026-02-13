import { Link } from "react-router";
import ProjectStatusBadge from "./ProjectStatusBadge";
import { 
  ART_STYLES, 
  MONETIZATION_MODELS,
  getIconFromValue,
  formatArrayForDisplay
} from "../../shared/constants/gameConstants";

export default function ProjectCard({ project }) {
  // Format date relative to now
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get project stats (if available)
  const getTaskSummary = () => {
    if (!project.taskStats) return null;
    const { todo = 0, inProgress = 0, done = 0 } = project.taskStats;
    const total = todo + inProgress + done;
    if (total === 0) return null;
    
    const completion = Math.round((done / total) * 100);
    return { total, todo, inProgress, done, completion };
  };

  const taskStats = getTaskSummary();

  return (
    <Link
      to={`/projects/${project._id}`}
      className="block group"
    >
      <div className="border border-gray-200 rounded-xl bg-white p-5 hover:shadow-lg hover:border-gray-300 transition-all duration-200 h-full flex flex-col">
        {/* Header with Title and Status */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 flex-1">
            {project.name}
          </h3>
          <ProjectStatusBadge status={project.status} />
        </div>

        {/* Description */}
        {project.description ? (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
            {project.description}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic mb-4 flex-1">
            No description provided
          </p>
        )}

        {/* Tags Section */}
        <div className="space-y-3 mb-4">
          {/* Genres */}
          {project.genres && project.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.genres.slice(0, 3).map(genre => (
                <span
                  key={genre}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100"
                >
                  <span>🎮</span>
                  {genre}
                </span>
              ))}
              {project.genres.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                  +{project.genres.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Platforms */}
          {project.platforms && project.platforms.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.platforms.slice(0, 2).map(platform => (
                <span
                  key={platform}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium border border-green-100"
                >
                  <span>🖥️</span>
                  {platform}
                </span>
              ))}
              {project.platforms.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                  +{project.platforms.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Additional Details Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {project.artStyle && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 p-1.5 rounded-lg">
              <span className="text-lg">{getIconFromValue(project.artStyle, ART_STYLES)}</span>
              <span className="truncate">{project.artStyle}</span>
            </div>
          )}
          
          {project.monetization && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 p-1.5 rounded-lg">
              <span className="text-lg">{getIconFromValue(project.monetization, MONETIZATION_MODELS)}</span>
              <span className="truncate">{project.monetization}</span>
            </div>
          )}
        </div>

        {/* Progress Bar (if tasks exist) */}
        {taskStats && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Progress</span>
              <span className="font-medium text-gray-700">{taskStats.completion}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-black rounded-full transition-all duration-300"
                style={{ width: `${taskStats.completion}%` }}
              />
            </div>
            <div className="flex gap-2 mt-1 text-xs text-gray-400">
              <span>📋 {taskStats.todo}</span>
              <span>⚙️ {taskStats.inProgress}</span>
              <span>✅ {taskStats.done}</span>
            </div>
          </div>
        )}

        {/* Footer with Metadata */}
        <div className="flex justify-between items-center text-xs text-gray-400 border-t border-gray-100 pt-3 mt-auto">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span>📅</span>
              {getRelativeTime(project.updatedAt || project.createdAt)}
            </span>
            {project.sourceIdea && (
              <span className="flex items-center gap-1 text-purple-500" title="From an idea">
                <span>💡</span>
              </span>
            )}
          </div>
          <span className="font-mono text-gray-300 text-xs">
            #{project._id.slice(-6)}
          </span>
        </div>

      </div>
    </Link>
  );
}