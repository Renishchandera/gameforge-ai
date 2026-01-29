import { useState } from "react";
import { generateIdeaAPI, feasibilityAPI, saveIdeaAPI } from "../features/ideator/ideatorAPI";
import { Link } from "react-router";
import DashboardLayout from "@/components/layout/DashboardLayout";

const GAME_GENRES = [
  "Action", "Adventure", "RPG", "Strategy", "Simulation",
  "Sports", "Racing", "Puzzle", "Horror", "Survival",
  "MMO", "Battle Royale", "Roguelike"
];

const PLATFORMS = [
  "PC", "Mobile", "Console", "VR", "Web", "Cross-platform"
];

export default function IdeaGeneratorPage() {
  const [form, setForm] = useState({
    genre: "",
    platform: "",
    targetAudience: "",
    coreMechanic: "",
    artStyle: "",
    monetization: "",
  });

  const [idea, setIdea] = useState(null);
  const [feasibility, setFeasibility] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const generateIdea = async () => {
    try {
      setLoading(true);
      setSaveMessage("");
      const data = await generateIdeaAPI(form);
      setIdea(data.idea);
      setFeasibility(null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const checkFeasibility = async () => {
    const data = await feasibilityAPI(idea);
    setFeasibility(data);
  };

  const saveIdea = async () => {
    if (!idea) return;
    
    try {
      setSaving(true);
      setSaveMessage("");
      
      const ideaData = {
        title: "",
        content: idea,
        genre: form.genre,
        platform: form.platform,
        targetAudience: form.targetAudience,
        coreMechanic: form.coreMechanic,
        artStyle: form.artStyle,
        monetization: form.monetization,
        feasibilityScore: feasibility?.score,
        risks: feasibility?.risks || []
      };

      const result = await saveIdeaAPI(ideaData);
      
      if (result.success) {
        setSaveMessage("✅ Idea saved successfully!");
      } else {
        setSaveMessage("❌ Failed to save idea");
      }
    } catch (error) {
      console.error("Error saving idea:", error);
      setSaveMessage("❌ Error saving idea");
    } finally {
      setSaving(false);
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const resetAll = () => {
    setForm({
      genre: "",
      platform: "",
      targetAudience: "",
      coreMechanic: "",
      artStyle: "",
      monetization: "",
    });
    setIdea(null);
    setFeasibility(null);
    setSaveMessage("");
  };

  return (
    <DashboardLayout>
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🎮 Game Idea Generator</h1>
        <Link
          to="/my/ideas"
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          📚 View Saved Ideas
        </Link>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* LEFT: INPUT */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-bold mb-3">Game Details</h2>
            
            <div className="space-y-3">
              {/* ... (keep all your existing input fields exactly as they are) ... */}
              <div>
                <label className="block text-sm mb-1">Genre *</label>
                <select
                  name="genre"
                  value={form.genre}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select genre...</option>
                  {GAME_GENRES.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Platform *</label>
                <select
                  name="platform"
                  value={form.platform}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select platform...</option>
                  {PLATFORMS.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Target Audience</label>
                <input
                  type="text"
                  name="targetAudience"
                  value={form.targetAudience}
                  onChange={handleChange}
                  placeholder="e.g., Casual gamers, Teens, Competitive players"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Core Mechanic</label>
                <input
                  type="text"
                  name="coreMechanic"
                  value={form.coreMechanic}
                  onChange={handleChange}
                  placeholder="e.g., Time manipulation, Deck-building"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Art Style</label>
                <input
                  type="text"
                  name="artStyle"
                  value={form.artStyle}
                  onChange={handleChange}
                  placeholder="e.g., Pixel art, Realistic, Cartoon"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Monetization</label>
                <input
                  type="text"
                  name="monetization"
                  value={form.monetization}
                  onChange={handleChange}
                  placeholder="e.g., Premium, Free with IAP, Subscription"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={generateIdea}
                disabled={loading || !form.genre || !form.platform}
                className={`flex-1 px-4 py-2 rounded ${
                  loading || !form.genre || !form.platform
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {loading ? "Generating..." : "Generate Game Idea"}
              </button>
              
              <button
                onClick={resetAll}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: OUTPUT */}
        <div className="space-y-4">
          {idea && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold">Generated Idea</h2>
                <button
                  onClick={() => navigator.clipboard.writeText(idea)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Copy
                </button>
              </div>
              
              <div className="bg-white p-4 rounded border min-h-[300px] whitespace-pre-wrap font-mono text-sm">
                {idea}
              </div>
              
              <div className="flex gap-3 mt-3">
                <button
                  onClick={checkFeasibility}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Check Feasibility
                </button>
                
                <button
                  onClick={saveIdea}
                  disabled={saving}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-300"
                >
                  {saving ? "Saving..." : "💾 Save Idea"}
                </button>
              </div>
              
              {saveMessage && (
                <div className={`mt-2 p-2 rounded text-center text-sm ${
                  saveMessage.includes("✅") 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {saveMessage}
                </div>
              )}
            </div>
          )}

          {feasibility && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3">Feasibility Analysis</h3>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Score:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    feasibility.score >= 70 ? 'bg-green-100 text-green-800' :
                    feasibility.score >= 40 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {feasibility.score}/100
                  </span>
                </div>
                
                <p className="text-sm mb-3">{feasibility.reasoning}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Risks:</h4>
                <ul className="space-y-1 text-sm">
                  {feasibility.risks.map((risk, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {!idea && (
            <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500">
              <div className="text-4xl mb-3">🎮</div>
              <p>Fill in game details and generate your idea</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}