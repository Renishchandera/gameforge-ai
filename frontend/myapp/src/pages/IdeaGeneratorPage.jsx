import { useState } from "react";
import { generateIdeaAPI, feasibilityAPI, saveIdeaAPI } from "../features/ideator/ideatorAPI";
import { Link } from "react-router";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  GAME_GENRES, 
  PLATFORMS, 
  TARGET_AUDIENCES, 
  ART_STYLES, 
  MONETIZATION_MODELS 
} from "../shared/constants/gameConstants";
import { 
  SelectDropdown, 
  TextInput,
  MultiSelectDropdown  // Add this import
} from "../components/common/FormFields";

export default function IdeaGeneratorPage() {
  const [form, setForm] = useState({
    genres: [],        // Now array
    platforms: [],     // Now array
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
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleArrayChange = (field, values) => {
    setForm({ ...form, [field]: values });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (form.genres.length === 0) newErrors.genres = "At least one genre is required";
    if (form.platforms.length === 0) newErrors.platforms = "At least one platform is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateIdea = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setSaveMessage("");
      // Send arrays directly to LLM
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
    if (!idea) return;
    try {
      const data = await feasibilityAPI(idea);
      setFeasibility(data);
    } catch (e) {
      console.error(e);
    }
  };

  const saveIdea = async () => {
    if (!idea) return;
    
    try {
      setSaving(true);
      setSaveMessage("");
      
      const ideaData = {
        title: idea.split('\n')[0].slice(0, 50) || "Generated Game Idea",
        content: idea,
        genres: form.genres,        // Arrays
        platforms: form.platforms,   // Arrays
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
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        setSaveMessage("❌ Failed to save idea");
      }
    } catch (error) {
      console.error("Error saving idea:", error);
      setSaveMessage("❌ Error saving idea");
    } finally {
      setSaving(false);
    }
  };

  const resetAll = () => {
    setForm({
      genres: [],
      platforms: [],
      targetAudience: "",
      coreMechanic: "",
      artStyle: "",
      monetization: "",
    });
    setIdea(null);
    setFeasibility(null);
    setSaveMessage("");
    setErrors({});
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(idea);
    setSaveMessage("✅ Copied to clipboard!");
    setTimeout(() => setSaveMessage(""), 2000);
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span>🎮</span> Game Idea Generator
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Select multiple genres and platforms for richer, more creative game ideas
            </p>
          </div>
          <Link
            to="/my/ideas"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>📚</span>
            View Saved Ideas
          </Link>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT: INPUT SECTION */}
          <div className="space-y-4">
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                Game Details
              </h2>
              
              <div className="space-y-4">
                {/* Genres - Now Multi-Select */}
                <div>
                  <MultiSelectDropdown
                    label="Genres"
                    field="genres"
                    options={GAME_GENRES.map(g => ({ value: g, label: g }))}
                    selectedItems={form.genres}
                    onChange={handleArrayChange}
                    placeholder="Select game genres..."
                  />
                  {errors.genres && (
                    <p className="text-xs text-red-600 mt-1">{errors.genres}</p>
                  )}
                </div>

                {/* Platforms - Now Multi-Select */}
                <div>
                  <MultiSelectDropdown
                    label="Platforms"
                    field="platforms"
                    options={PLATFORMS.map(p => ({ value: p, label: p }))}
                    selectedItems={form.platforms}
                    onChange={handleArrayChange}
                    placeholder="Select target platforms..."
                  />
                  {errors.platforms && (
                    <p className="text-xs text-red-600 mt-1">{errors.platforms}</p>
                  )}
                </div>

                <SelectDropdown
                  label="Target Audience"
                  value={form.targetAudience}
                  onChange={(e) => handleChange('targetAudience', e.target.value)}
                  options={TARGET_AUDIENCES}
                  placeholder="Select target audience..."
                  showIcons={true}
                />

                <TextInput
                  label="Core Mechanic"
                  value={form.coreMechanic}
                  onChange={(e) => handleChange('coreMechanic', e.target.value)}
                  placeholder="e.g., Time manipulation, Deck-building"
                  helpText="Main gameplay loop"
                />

                <SelectDropdown
                  label="Art Style"
                  value={form.artStyle}
                  onChange={(e) => handleChange('artStyle', e.target.value)}
                  options={ART_STYLES}
                  placeholder="Select art style..."
                  showIcons={true}
                />

                <SelectDropdown
                  label="Monetization"
                  value={form.monetization}
                  onChange={(e) => handleChange('monetization', e.target.value)}
                  options={MONETIZATION_MODELS}
                  placeholder="Select monetization model..."
                  showIcons={true}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={generateIdea}
                  disabled={loading || form.genres.length === 0 || form.platforms.length === 0}
                  className={`
                    flex-1 px-4 py-2.5 rounded-lg font-medium
                    flex items-center justify-center gap-2
                    ${loading || form.genres.length === 0 || form.platforms.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-800 transition-colors'
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      Generate Game Idea
                    </>
                  )}
                </button>
                
                <button
                  onClick={resetAll}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: OUTPUT SECTION - Same as before */}
          <div className="space-y-4">
            {idea ? (
              <>
                {/* Generated Idea Card */}
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                      <span>✨</span>
                      Generated Idea
                    </h2>
                    <button
                      onClick={copyToClipboard}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <span>📋</span>
                      Copy
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border min-h-[300px] whitespace-pre-wrap font-mono text-sm">
                    {idea}
                  </div>
                  
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={checkFeasibility}
                      disabled={!idea}
                      className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <span>🔍</span>
                      Check Feasibility
                    </button>
                    
                    <button
                      onClick={saveIdea}
                      disabled={saving || !idea}
                      className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 disabled:bg-green-300 transition-colors flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <span>💾</span>
                          Save Idea
                        </>
                      )}
                    </button>
                  </div>
                  
                  {saveMessage && (
                    <div className={`
                      mt-3 p-3 rounded-lg text-sm text-center
                      ${saveMessage.includes("✅") 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                      }
                    `}>
                      {saveMessage}
                    </div>
                  )}
                </div>

                {/* Feasibility Analysis Card */}
                {feasibility && (
                  <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <span>📊</span>
                      Feasibility Analysis
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Overall Score:</span>
                        <span className={`
                          px-4 py-2 rounded-full text-sm font-bold
                          ${feasibility.score >= 70 ? 'bg-green-100 text-green-800' :
                            feasibility.score >= 40 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }
                        `}>
                          {feasibility.score}/100
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700">{feasibility.reasoning}</p>
                      </div>
                      
                      {feasibility.risks && feasibility.risks.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-1">
                            <span>⚠️</span>
                            Potential Risks
                          </h4>
                          <ul className="space-y-2">
                            {feasibility.risks.map((risk, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm bg-red-50 p-2 rounded">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span className="text-gray-700">{risk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Empty State
              <div className="bg-white border rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to create something amazing?
                </h3>
                <p className="text-gray-500 mb-6">
                  Select multiple genres and platforms for unique combinations
                </p>
                <div className="text-sm text-gray-400">
                  <p>Your generated game idea will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}