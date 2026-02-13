import { useState } from "react";
import ProjectStatusManager from "./ProjectStatusManager";
import { updateProjectAPI } from "../../features/projects/projectAPI";
import { 
  GAME_GENRES, 
  PLATFORMS, 
  TARGET_AUDIENCES, 
  ART_STYLES, 
  MONETIZATION_MODELS,
  normalizeToArray
} from "../../shared/constants/gameConstants";
import { MultiSelectDropdown, SelectDropdown, TextInput, TextArea } from "../common/FormFields";

export default function ProjectDetailsCard({ project, onProjectUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState({
    name: project.name || "",
    description: project.description || "",
    genres: project.genres || [],
    platforms: project.platforms || [],
    targetAudience: project.targetAudience || "",
    coreMechanic: project.coreMechanic || "",
    artStyle: project.artStyle || "",
    monetization: project.monetization || ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!editedProject.name.trim()) {
      newErrors.name = "Project name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setEditedProject(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleArrayChange = (field, values) => {
    setEditedProject(prev => ({ ...prev, [field]: values }));
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      
      // Ensure arrays are properly formatted
      const projectData = {
        ...editedProject,
        genres: normalizeToArray(editedProject.genres),
        platforms: normalizeToArray(editedProject.platforms)
      };

      const res = await updateProjectAPI(project._id, projectData);
      onProjectUpdate(res.project);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update project:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProject({
      name: project.name || "",
      description: project.description || "",
      genres: project.genres || [],
      platforms: project.platforms || [],
      targetAudience: project.targetAudience || "",
      coreMechanic: project.coreMechanic || "",
      artStyle: project.artStyle || "",
      monetization: project.monetization || ""
    });
    setErrors({});
    setIsEditing(false);
  };

  // ----- EDIT MODE -----
  if (isEditing) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-lg font-semibold">Edit Project Details</h2>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !editedProject.name.trim()}
              className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>

        <div className="space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextInput
              label="Project Name"
              value={editedProject.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter project name"
              required
              error={errors.name}
            />
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Project Status
              </label>
              <ProjectStatusManager 
                project={project} 
                onStatusUpdate={onProjectUpdate}
                isInline={true}
              />
            </div>
          </div>

          {/* Description */}
          <TextArea
            label="Description"
            value={editedProject.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief description of your project..."
          />

          {/* Genres & Platforms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <MultiSelectDropdown
              label="Genres"
              field="genres"
              options={GAME_GENRES.map(g => ({ value: g, label: g }))}
              selectedItems={editedProject.genres}
              onChange={(field, values) => handleArrayChange(field, values)}
              placeholder="Select game genres..."
            />

            <MultiSelectDropdown
              label="Platforms"
              field="platforms"
              options={PLATFORMS.map(p => ({ value: p, label: p }))}
              selectedItems={editedProject.platforms}
              onChange={(field, values) => handleArrayChange(field, values)}
              placeholder="Select target platforms..."
            />
          </div>

          {/* Game Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SelectDropdown
              label="Target Audience"
              value={editedProject.targetAudience}
              onChange={(e) => handleInputChange('targetAudience', e.target.value)}
              options={TARGET_AUDIENCES}
              placeholder="Select target audience..."
              showIcons={true}
            />

            <TextInput
              label="Core Mechanic"
              value={editedProject.coreMechanic}
              onChange={(e) => handleInputChange('coreMechanic', e.target.value)}
              placeholder="e.g., Platform jumping, Turn-based combat"
              helpText="Main gameplay loop"
            />

            <SelectDropdown
              label="Art Style"
              value={editedProject.artStyle}
              onChange={(e) => handleInputChange('artStyle', e.target.value)}
              options={ART_STYLES}
              placeholder="Select art style..."
              showIcons={true}
            />

            <SelectDropdown
              label="Monetization"
              value={editedProject.monetization}
              onChange={(e) => handleInputChange('monetization', e.target.value)}
              options={MONETIZATION_MODELS}
              placeholder="Select monetization model..."
              showIcons={true}
            />
          </div>

          {/* Metadata */}
          <div className="border-t pt-4 mt-4 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
              <span>Last updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----- VIEW MODE -----
  return (
    <div className="bg-white rounded-lg border p-6">
      {/* Header with Edit Button */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">
              {project.name}
            </h1>
            <ProjectStatusManager 
              project={project} 
              onStatusUpdate={onProjectUpdate}
            />
          </div>
          {project.description && (
            <p className="text-gray-600 mt-2 text-sm">{project.description}</p>
          )}
        </div>
        
        <button
          onClick={() => setIsEditing(true)}
          className="ml-4 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
      </div>

      {/* Project Details Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {/* Genres */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <span>🎮</span> Genres
          </p>
          <div className="flex flex-wrap gap-1">
            {project.genres?.length > 0 ? (
              project.genres.map(genre => (
                <span key={genre} className="text-xs bg-white px-2 py-1 rounded-full border border-gray-200">
                  {genre}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-400 italic">Not specified</span>
            )}
          </div>
        </div>

        {/* Platforms */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <span>🖥️</span> Platforms
          </p>
          <div className="flex flex-wrap gap-1">
            {project.platforms?.length > 0 ? (
              project.platforms.map(platform => (
                <span key={platform} className="text-xs bg-white px-2 py-1 rounded-full border border-gray-200">
                  {platform}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-400 italic">Not specified</span>
            )}
          </div>
        </div>

        {/* Target Audience */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <span>👥</span> Target Audience
          </p>
          <p className="font-medium text-sm">
            {project.targetAudience ? (
              <>
                {TARGET_AUDIENCES.find(a => a.value === project.targetAudience)?.icon || '👤'}
                {' '}{project.targetAudience}
              </>
            ) : (
              <span className="text-gray-400 italic">Not specified</span>
            )}
          </p>
        </div>

        {/* Core Mechanic */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <span>🎯</span> Core Mechanic
          </p>
          <p className="font-medium text-sm">
            {project.coreMechanic || <span className="text-gray-400 italic">Not specified</span>}
          </p>
        </div>

        {/* Art Style */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <span>🎨</span> Art Style
          </p>
          <p className="font-medium text-sm">
            {project.artStyle ? (
              <>
                {ART_STYLES.find(a => a.value === project.artStyle)?.icon || '🖌️'}
                {' '}{project.artStyle}
              </>
            ) : (
              <span className="text-gray-400 italic">Not specified</span>
            )}
          </p>
        </div>

        {/* Monetization */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <span>💰</span> Monetization
          </p>
          <p className="font-medium text-sm">
            {project.monetization ? (
              <>
                {MONETIZATION_MODELS.find(m => m.value === project.monetization)?.icon || '💵'}
                {' '}{project.monetization}
              </>
            ) : (
              <span className="text-gray-400 italic">Not specified</span>
            )}
          </p>
        </div>
      </div>

      {/* Source Idea Link */}
      {project.sourceIdea && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <span>💡</span> From Idea
          </p>
          <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
            <span className="text-lg">💡</span>
            <span className="text-sm text-gray-700">
              {typeof project.sourceIdea === 'object' 
                ? project.sourceIdea.title || 'Original Game Idea'
                : 'Original Game Idea'
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
}