// ============================================
// SHARED GAME DEVELOPMENT CONSTANTS
// Single source of truth for all dropdowns & options
// Used by both Ideas and Projects
// ============================================

// ----- GENRES (Array of strings) -----
export const GAME_GENRES = [
  "Action", "Adventure", "RPG", "Strategy", "Simulation",
  "Puzzle", "Platformer", "Shooter", "Sports", "Racing",
  "Fighting", "Horror", "Survival", "Open World", "Sandbox",
  "Stealth", "Battle Royale", "MOBA", "MMORPG", "Roguelike",
  "Metroidvania", "Visual Novel", "Rhythm", "Education", "Party",
  "Casual", "Card Game", "Board Game", "Trivia", "Arcade"
];

// ----- PLATFORMS (Array of strings) -----
export const PLATFORMS = [
  "PC", "Mac", "Linux",
  "PlayStation 5", "PlayStation 4", "PlayStation 3",
  "Xbox Series X/S", "Xbox One", "Xbox 360",
  "Nintendo Switch", "Wii U", "3DS",
  "iOS", "Android", "Web Browser",
  "VR", "AR", "Meta Quest", "PlayStation VR", "HTC Vive",
  "Steam Deck", "Cross-platform"
];

// ----- TARGET AUDIENCES (Array of objects for better UX) -----
export const TARGET_AUDIENCES = [
  { value: "Kids (3-12)", label: "Kids (3-12)", icon: "🧸", description: "Children, simple mechanics" },
  { value: "Teens (13-17)", label: "Teens (13-17)", icon: "🎮", description: "Young adults, moderate complexity" },
  { value: "Young Adults (18-25)", label: "Young Adults (18-25)", icon: "🎯", description: "College age, competitive" },
  { value: "Adults (25-35)", label: "Adults (25-35)", icon: "💼", description: "Working professionals" },
  { value: "Mature (35+)", label: "Mature (35+)", icon: "👨‍👩‍👧", description: "Older gamers, nostalgic" },
  { value: "All Ages", label: "All Ages", icon: "👪", description: "Family-friendly" },
  { value: "Casual Gamers", label: "Casual Gamers", icon: "☕", description: "Pick up and play" },
  { value: "Hardcore Gamers", label: "Hardcore Gamers", icon: "⚔️", description: "Deep mechanics, challenging" },
  { value: "Competitive", label: "Competitive", icon: "🏆", description: "Esports, ranked play" },
  { value: "Story Lovers", label: "Story Lovers", icon: "📖", description: "Narrative focused" }
];

// ----- ART STYLES (Add label field) -----
export const ART_STYLES = [
  { value: "Pixel Art", label: "Pixel Art", icon: "🟦", category: "2D" },
  { value: "2D Hand-drawn", label: "2D Hand-drawn", icon: "✏️", category: "2D" },
  { value: "2D Vector", label: "2D Vector", icon: "📐", category: "2D" },
  { value: "Cel-shaded", label: "Cel-shaded", icon: "🎨", category: "3D" },
  { value: "3D Low Poly", label: "3D Low Poly", icon: "🔺", category: "3D" },
  { value: "3D Realistic", label: "3D Realistic", icon: "🌍", category: "3D" },
  { value: "3D Stylized", label: "3D Stylized", icon: "✨", category: "3D" },
  { value: "Voxel Art", label: "Voxel Art", icon: "🧊", category: "3D" },
  { value: "Minimalist", label: "Minimalist", icon: "○", category: "2D" },
  { value: "Abstract", label: "Abstract", icon: "🎭", category: "2D" },
  { value: "Retro", label: "Retro", icon: "📺", category: "2D" },
  { value: "Anime/Manga", label: "Anime/Manga", icon: "🌸", category: "2D" },
  { value: "Comic Book", label: "Comic Book", icon: "💥", category: "2D" },
  { value: "Paper Cutout", label: "Paper Cutout", icon: "📄", category: "2D" },
  { value: "Watercolor", label: "Watercolor", icon: "🖌️", category: "2D" },
  { value: "Photorealistic", label: "Photorealistic", icon: "📷", category: "3D" },
  { value: "Procedural", label: "Procedural", icon: "🤖", category: "Mixed" }
];

// ----- MONETIZATION MODELS (Add label field) -----
export const MONETIZATION_MODELS = [
  { value: "Premium (Paid)", label: "Premium (Paid)", icon: "💰", description: "One-time purchase" },
  { value: "Free to Play", label: "Free to Play", icon: "🎁", description: "Free, optional purchases" },
  { value: "Freemium", label: "Freemium", icon: "🆓", description: "Basic free, paid features" },
  { value: "Subscription", label: "Subscription", icon: "📅", description: "Monthly/yearly fee" },
  { value: "DLC/Expansions", label: "DLC/Expansions", icon: "📦", description: "Base game + paid content" },
  { value: "In-app Purchases", label: "In-app Purchases", icon: "🛒", description: "Consumable items" },
  { value: "Ads", label: "Ads", icon: "📺", description: "Ad-supported" },
  { value: "Crowdfunding", label: "Crowdfunding", icon: "❤️", description: "Backer supported" },
  { value: "Early Access", label: "Early Access", icon: "⏳", description: "Pay during development" },
  { value: "Battle Pass", label: "Battle Pass", icon: "🎫", description: "Seasonal progression" },
  { value: "Loot Boxes", label: "Loot Boxes", icon: "📦", description: "Randomized rewards" },
  { value: "Season Pass", label: "Season Pass", icon: "🗓️", description: "Yearly content bundle" }
];
// ----- PROJECT STATUS -----
export const PROJECT_STATUSES = [
  { value: "concept", label: "Concept", icon: "💡", color: "bg-gray-100 text-gray-800" },
  { value: "pre-production", label: "Pre-Production", icon: "📐", color: "bg-blue-100 text-blue-800" },
  { value: "production", label: "Production", icon: "⚙️", color: "bg-purple-100 text-purple-800" },
  { value: "paused", label: "Paused", icon: "⏸️", color: "bg-yellow-100 text-yellow-800" },
  { value: "released", label: "Released", icon: "🚀", color: "bg-green-100 text-green-800" }
];

// ----- TASK PRIORITIES -----
export const TASK_PRIORITIES = [
  { value: "low", label: "Low", icon: "🟢", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "Medium", icon: "🟡", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", icon: "🔴", color: "bg-red-100 text-red-800" }
];

// ----- TASK STATUSES -----
export const TASK_STATUSES = [
  { value: "todo", label: "To Do", icon: "📋", color: "bg-gray-100 text-gray-800" },
  { value: "in-progress", label: "In Progress", icon: "⚙️", color: "bg-blue-100 text-blue-800" },
  { value: "done", label: "Done", icon: "✅", color: "bg-green-100 text-green-800" }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

// Normalize array fields (handle single values, comma-separated strings, etc.)
export const normalizeToArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    // Handle comma-separated values
    return value.split(',').map(item => item.trim()).filter(Boolean);
  }
  return [String(value)];
};

// Format array for display
export const formatArrayForDisplay = (arr, max = 3) => {
  if (!arr || arr.length === 0) return null;
  if (arr.length <= max) return arr.join(', ');
  return `${arr.slice(0, max).join(', ')} +${arr.length - max}`;
};

// Get label from value
export const getLabelFromValue = (value, options) => {
  if (!value) return 'Not specified';
  const option = options.find(opt => opt.value === value);
  return option ? option.label : value;
};

// Get icon from value
export const getIconFromValue = (value, options) => {
  if (!value) return '📌';
  const option = options.find(opt => opt.value === value);
  return option ? option.icon : '📌';
};

// Add these to your existing gameConstants.js

// Helper to normalize legacy idea data
export const normalizeIdeaData = (idea) => {
  if (!idea) return idea;
  
  return {
    ...idea,
    // Convert single genre to array
    genres: idea.genres || (idea.genre ? [idea.genre] : []),
    // Convert single platform to array
    platforms: idea.platforms || (idea.platform ? [idea.platform] : []),
  };
};

// Helper to check if idea has valid data
export const isValidIdea = (idea) => {
  return idea && (
    idea.content || 
    (idea.genres && idea.genres.length > 0) || 
    (idea.platforms && idea.platforms.length > 0)
  );
};