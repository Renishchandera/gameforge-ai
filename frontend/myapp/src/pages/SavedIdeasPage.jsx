import { useState, useEffect } from "react";
import { getSavedIdeasAPI } from "../features/ideator/ideatorAPI";
import { Link } from "react-router";
import DashboardLayout from "../components/layout/DashboardLayout";
import { createProjectFromIdeaAPI } from "../features/projects/projectAPI";
import { useNavigate } from "react-router";
import { 
  GAME_GENRES, 
  PLATFORMS, 
  TARGET_AUDIENCES, 
  ART_STYLES, 
  MONETIZATION_MODELS,
  formatArrayForDisplay,
  getIconFromValue
} from "../shared/constants/gameConstants";

export default function SavedIdeasPage() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIdeas();
  }, []);

  const handleCreateProject = async (idea) => {
    try {
      const res = await createProjectFromIdeaAPI(idea._id);
      if (res.success) {
        navigate(`/projects/${res.project._id}`);
      }
    } catch (error) {
      console.error("Create project error:", error);
    }
  };

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const data = await getSavedIdeasAPI();
      if (data.success) {
        setIdeas(data.ideas);
      }
    } catch (error) {
      console.error("Error fetching ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateContent = (content, length = 150) => {
    if (!content || content.length <= length) return content;
    return content.substring(0, length) + "...";
  };

  const handleViewFullIdea = (idea) => {
    setSelectedIdea(idea);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIdea(null);
  };

  const copyToClipboard = (text, type = "idea") => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getFeasibilityColor = (score) => {
    if (score >= 70) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 40) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border rounded-lg p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span>📚</span> My Saved Ideas
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {ideas.length} {ideas.length === 1 ? 'idea' : 'ideas'} saved
            </p>
          </div>
          <Link
            to="/generate/idea"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <span>✨</span>
            Generate New Idea
          </Link>
        </div>

        {ideas.length === 0 ? (
          // Empty State
          <div className="bg-white border rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No saved ideas yet
            </h3>
            <p className="text-gray-500 mb-6">
              Generate your first game idea and save it for later
            </p>
            <Link
              to="/generate/idea"
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
            >
              <span>✨</span>
              Generate Your First Idea
            </Link>
          </div>
        ) : (
          // Ideas Grid
          <div className="grid gap-4">
            {ideas.map((idea) => (
              <div
                key={idea._id}
                className="bg-white border rounded-lg p-5 hover:shadow-md transition-all hover:border-gray-300"
              >
                {/* Header Row */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-bold text-lg text-gray-900">
                        {idea.title || "Untitled Game Idea"}
                      </h3>
                      {idea.isConvertedToProject && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full flex items-center gap-1">
                          <span>🔄</span>
                          Converted to Project
                        </span>
                      )}
                    </div>
                    
                    {/* Tags/Badges */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {/* Genres */}
                      {idea.genres && idea.genres.length > 0 ? (
                        idea.genres.slice(0, 3).map(genre => (
                          <span key={genre} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            🎮 {genre}
                          </span>
                        ))
                      ) : idea.genre && ( // Fallback for old data
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          🎮 {idea.genre}
                        </span>
                      )}
                      
                      {/* Platforms */}
                      {idea.platforms && idea.platforms.length > 0 ? (
                        idea.platforms.slice(0, 2).map(platform => (
                          <span key={platform} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            🖥️ {platform}
                          </span>
                        ))
                      ) : idea.platform && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          🖥️ {idea.platform}
                        </span>
                      )}
                      
                      {/* Feasibility Score */}
                      {idea.feasibilityScore !== undefined && (
                        <span className={`text-xs px-2 py-1 rounded-full ${getFeasibilityColor(idea.feasibilityScore)}`}>
                          📊 Score: {idea.feasibilityScore}/100
                        </span>
                      )}
                      
                      {/* More indicator */}
                      {idea.genres && idea.genres.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          +{idea.genres.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Date */}
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                    {formatDate(idea.createdAt)}
                  </span>
                </div>

                {/* Content Preview */}
                <div className="text-gray-700 mb-4">
                  <p className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {truncateContent(idea.content, 200)}
                  </p>
                </div>

                {/* Details Row */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  {/* Art Style */}
                  {idea.artStyle && (
                    <span className="flex items-center gap-1">
                      {getIconFromValue(idea.artStyle, ART_STYLES)} {idea.artStyle}
                    </span>
                  )}
                  
                  {/* Monetization */}
                  {idea.monetization && (
                    <span className="flex items-center gap-1">
                      {getIconFromValue(idea.monetization, MONETIZATION_MODELS)} {idea.monetization}
                    </span>
                  )}
                  
                  {/* Target Audience */}
                  {idea.targetAudience && (
                    <span className="flex items-center gap-1">
                      {getIconFromValue(idea.targetAudience, TARGET_AUDIENCES)} {idea.targetAudience}
                    </span>
                  )}
                  
                  {/* Core Mechanic */}
                  {idea.coreMechanic && (
                    <span className="flex items-center gap-1 text-gray-500">
                      <span>🎯</span> {idea.coreMechanic}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center border-t pt-4">
                  <div className="text-xs text-gray-400">
                    ID: {idea._id.slice(-8)}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewFullIdea(idea)}
                      className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>🔍</span>
                      View Full
                    </button>
                    
                    <button
                      onClick={() => copyToClipboard(idea.content)}
                      className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>📋</span>
                      Copy
                    </button>
                    
                    <button
                      onClick={() => handleCreateProject(idea)}
                      disabled={idea.isConvertedToProject}
                      className={`
                        text-sm px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1
                        ${idea.isConvertedToProject
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-black text-white hover:bg-gray-800"
                        }
                      `}
                    >
                      {idea.isConvertedToProject ? (
                        <>
                          <span>✅</span>
                          Project Created
                        </>
                      ) : (
                        <>
                          <span>🚀</span>
                          Create Project
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for viewing full idea */}
        {isModalOpen && selectedIdea && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedIdea.title || "Game Idea"}
                      </h2>
                      {selectedIdea.isConvertedToProject && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-1">
                          <span>🔄</span>
                          Converted to Project
                        </span>
                      )}
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {/* Genres */}
                      {(selectedIdea.genres?.length > 0 ? selectedIdea.genres : selectedIdea.genre ? [selectedIdea.genre] : []).map(genre => (
                        <span key={genre} className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                          🎮 {genre}
                        </span>
                      ))}
                      
                      {/* Platforms */}
                      {(selectedIdea.platforms?.length > 0 ? selectedIdea.platforms : selectedIdea.platform ? [selectedIdea.platform] : []).map(platform => (
                        <span key={platform} className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                          🖥️ {platform}
                        </span>
                      ))}
                      
                      {/* Feasibility */}
                      {selectedIdea.feasibilityScore !== undefined && (
                        <span className={`text-sm px-3 py-1 rounded-full ${getFeasibilityColor(selectedIdea.feasibilityScore)}`}>
                          📊 Feasibility: {selectedIdea.feasibilityScore}/100
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-xs text-gray-500 block">Created</span>
                    <span className="font-medium">{formatDate(selectedIdea.createdAt)}</span>
                  </div>
                  
                  {selectedIdea.artStyle && (
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-xs text-gray-500 block">Art Style</span>
                      <span className="font-medium flex items-center gap-1">
                        {getIconFromValue(selectedIdea.artStyle, ART_STYLES)} {selectedIdea.artStyle}
                      </span>
                    </div>
                  )}
                  
                  {selectedIdea.monetization && (
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-xs text-gray-500 block">Monetization</span>
                      <span className="font-medium flex items-center gap-1">
                        {getIconFromValue(selectedIdea.monetization, MONETIZATION_MODELS)} {selectedIdea.monetization}
                      </span>
                    </div>
                  )}
                  
                  {selectedIdea.targetAudience && (
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-xs text-gray-500 block">Target Audience</span>
                      <span className="font-medium flex items-center gap-1">
                        {getIconFromValue(selectedIdea.targetAudience, TARGET_AUDIENCES)} {selectedIdea.targetAudience}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[50vh]">
                {/* Full Content */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span>📝</span> Full Idea
                  </h3>
                  <div className="bg-gray-50 p-5 rounded-lg border">
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                      {selectedIdea.content}
                    </pre>
                  </div>
                </div>

                {/* Core Details */}
                {(selectedIdea.coreMechanic || selectedIdea.targetAudience) && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <span>⚙️</span> Core Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedIdea.coreMechanic && (
                        <div className="bg-gray-50 p-3 rounded">
                          <span className="text-xs text-gray-500 block">Core Mechanic</span>
                          <span className="font-medium">{selectedIdea.coreMechanic}</span>
                        </div>
                      )}
                      {selectedIdea.targetAudience && (
                        <div className="bg-gray-50 p-3 rounded">
                          <span className="text-xs text-gray-500 block">Target Audience</span>
                          <span className="font-medium flex items-center gap-1">
                            {getIconFromValue(selectedIdea.targetAudience, TARGET_AUDIENCES)} {selectedIdea.targetAudience}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Risks */}
                {selectedIdea.risks && selectedIdea.risks.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <span>⚠️</span> Feasibility Risks
                    </h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <ul className="space-y-2">
                        {selectedIdea.risks.map((risk, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-red-500 mt-1">•</span>
                            <span className="text-gray-700">{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
                <button
                  onClick={() => copyToClipboard(selectedIdea.content)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <span>📋</span>
                  Copy Full Idea
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleCreateProject(selectedIdea)}
                    disabled={selectedIdea.isConvertedToProject}
                    className={`
                      px-6 py-2 rounded-lg transition-colors flex items-center gap-2
                      ${selectedIdea.isConvertedToProject
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                      }
                    `}
                  >
                    {selectedIdea.isConvertedToProject ? (
                      <>
                        <span>✅</span>
                        Already a Project
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        Create Project
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}