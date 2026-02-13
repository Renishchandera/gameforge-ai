import { useState } from "react";
import { useNavigate, Link } from "react-router";
import DashboardLayout from "../components/layout/DashboardLayout";
import { createProjectAPI } from "../features/projects/projectAPI";
import { 
  GAME_GENRES, 
  PLATFORMS, 
  TARGET_AUDIENCES, 
  ART_STYLES, 
  MONETIZATION_MODELS,
  normalizeToArray 
} from "../shared/constants/gameConstants";
import { 
  TextInput, 
  TextArea, 
  SelectDropdown,
  MultiSelectDropdown 
} from "../components/common/FormFields";

export default function CreateProjectPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    genres: [],
    platforms: [],
    targetAudience: "",
    coreMechanic: "",
    artStyle: "",
    monetization: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleArrayChange = (field, values) => {
    setForm(prev => ({ ...prev, [field]: values }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = "Project name is required";
    }
    if (form.genres.length === 0) {
      newErrors.genres = "At least one genre is required";
    }
    if (form.platforms.length === 0) {
      newErrors.platforms = "At least one platform is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare data for API - convert arrays to proper format
      const projectData = {
        name: form.name,
        description: form.description,
        genres: normalizeToArray(form.genres),
        platforms: normalizeToArray(form.platforms),
        targetAudience: form.targetAudience || null,
        coreMechanic: form.coreMechanic || null,
        artStyle: form.artStyle || null,
        monetization: form.monetization || null
      };

      const res = await createProjectAPI(projectData);

      if (res.success) {
        navigate(`/projects/${res.project._id}`);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              🚀 New
            </span>
          </div>
          <p className="text-gray-600">
            Start a new game project by defining its core details. You can always edit these later.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-6"
        >
          {/* Basic Information */}
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              Basic Information
            </h2>
            
            <TextInput
              label="Project Name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Dragon's Quest, Space Invaders Reborn"
              required
              error={errors.name}
              helpText="Choose a memorable name for your project"
            />

            <TextArea
              label="Description"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of your game project..."
              rows={3}
              helpText="Short summary of what makes your game unique"
            />
          </div>

          {/* Game Definition */}
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b">
              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
              Game Definition
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <MultiSelectDropdown
                label="Genres"
                field="genres"
                options={GAME_GENRES.map(g => ({ value: g, label: g }))}
                selectedItems={form.genres}
                onChange={handleArrayChange}
                placeholder="Select game genres..."
              />
              {errors.genres && (
                <p className="text-xs text-red-600 -mt-2">{errors.genres}</p>
              )}

              <MultiSelectDropdown
                label="Platforms"
                field="platforms"
                options={PLATFORMS.map(p => ({ value: p, label: p }))}
                selectedItems={form.platforms}
                onChange={handleArrayChange}
                placeholder="Select target platforms..."
              />
              {errors.platforms && (
                <p className="text-xs text-red-600 -mt-2">{errors.platforms}</p>
              )}
            </div>
          </div>

          {/* Game Details */}
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
              Game Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SelectDropdown
                label="Target Audience"
                value={form.targetAudience}
                onChange={(e) => handleChange('targetAudience', e.target.value)}
                options={TARGET_AUDIENCES}
                placeholder="Select target audience..."
                showIcons={true}
                helpText="Who will play your game?"
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
                helpText="Visual direction of your game"
              />

              <SelectDropdown
                label="Monetization"
                value={form.monetization}
                onChange={(e) => handleChange('monetization', e.target.value)}
                options={MONETIZATION_MODELS}
                placeholder="Select monetization model..."
                showIcons={true}
                helpText="How will your game generate revenue?"
              />
            </div>
          </div>

          {/* Form Actions */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <span>⚠️</span>
                {error}
              </p>
            </div>
          )}

          <div className="flex justify-between items-center pt-6 border-t">
            <Link
              to="/projects"
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>←</span>
              Back to Projects
            </Link>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`
                  px-6 py-2 rounded-lg font-medium transition-colors
                  flex items-center gap-2
                  ${loading 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-gray-800'
                  }
                `}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    Create Project
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-blue-900 flex items-center gap-2 mb-2">
            <span>💡</span>
            Pro Tips for Creating Great Projects
          </h3>
          <ul className="text-sm text-blue-800 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>Genres & Platforms:</strong> Select multiple options to reach wider audience</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>Core Mechanic:</strong> Focus on what makes your game unique</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>Art Style:</strong> Choose a style that matches your team's skills</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>Don't worry:</strong> You can always edit these details later</span>
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}