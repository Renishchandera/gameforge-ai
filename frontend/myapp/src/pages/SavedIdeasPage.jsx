import { useState, useEffect } from "react";
import { getSavedIdeasAPI } from "../features/ideator/ideatorAPI";
import { Link } from "react-router";

export default function SavedIdeasPage() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchIdeas();
  }, []);

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
    return new Date(dateString).toLocaleDateString();
  };

  const truncateContent = (content, length = 100) => {
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

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Saved Ideas</h1>
        <div className="text-center py-10">
          <p>Loading ideas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Saved Ideas</h1>
        <Link
          to="/generate/idea"
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          ← Back to Generator
        </Link>
      </div>

      {ideas.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-gray-600 mb-4">No saved ideas yet</p>
          <Link
            to="/generate/idea"
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Generate Your First Idea
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {ideas.map((idea) => (
            <div
              key={idea._id}
              className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{idea.title || "Untitled Idea"}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {idea.genre && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {idea.genre}
                      </span>
                    )}
                    {idea.platform && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {idea.platform}
                      </span>
                    )}
                    {idea.feasibilityScore !== undefined && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        idea.feasibilityScore >= 70 ? 'bg-green-100 text-green-800' :
                        idea.feasibilityScore >= 40 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        Score: {idea.feasibilityScore}/100
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(idea.createdAt)}
                </span>
              </div>
              
              <div className="text-gray-700 mb-3">
                <p className="whitespace-pre-wrap">
                  {truncateContent(idea.content, 150)}
                </p>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {idea.artStyle && (
                    <span className="mr-3">🎨 {idea.artStyle}</span>
                  )}
                  {idea.monetization && (
                    <span>💰 {idea.monetization}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewFullIdea(idea)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Full
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(idea.content)}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Copy
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
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{selectedIdea.title || "Game Idea"}</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedIdea.genre && (
                      <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded">
                        {selectedIdea.genre}
                      </span>
                    )}
                    {selectedIdea.platform && (
                      <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded">
                        {selectedIdea.platform}
                      </span>
                    )}
                    {selectedIdea.feasibilityScore !== undefined && (
                      <span className={`text-sm px-3 py-1 rounded ${
                        selectedIdea.feasibilityScore >= 70 ? 'bg-green-100 text-green-800' :
                        selectedIdea.feasibilityScore >= 40 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        Feasibility: {selectedIdea.feasibilityScore}/100
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              
              <div className="mt-4 flex gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Created:</span> {formatDate(selectedIdea.createdAt)}
                </div>
                {selectedIdea.artStyle && (
                  <div>
                    <span className="font-medium">Art Style:</span> {selectedIdea.artStyle}
                  </div>
                )}
                {selectedIdea.monetization && (
                  <div>
                    <span className="font-medium">Monetization:</span> {selectedIdea.monetization}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="bg-gray-50 p-4 rounded">
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {selectedIdea.content}
                </pre>
              </div>
              
              {selectedIdea.risks && selectedIdea.risks.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-bold text-lg mb-2">⚠️ Feasibility Risks:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedIdea.risks.map((risk, i) => (
                      <li key={i} className="text-gray-700">{risk}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedIdea.targetAudience && (
                <div className="mt-4">
                  <span className="font-medium">Target Audience:</span> {selectedIdea.targetAudience}
                </div>
              )}
              
              {selectedIdea.coreMechanic && (
                <div className="mt-2">
                  <span className="font-medium">Core Mechanic:</span> {selectedIdea.coreMechanic}
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-between">
              <button
                onClick={() => navigator.clipboard.writeText(selectedIdea.content)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                📋 Copy Full Idea
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}