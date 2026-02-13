const aiLLMClient = require("../services/aiLLM.client");
const Idea = require("../models/Idea");

// Add this function to normalize idea data when fetching
const normalizeIdeaData = (idea) => {
  const ideaObj = idea.toObject ? idea.toObject() : idea;
  
  // Handle legacy data: convert single genre/platform to arrays
  if (ideaObj.genre && !ideaObj.genres) {
    ideaObj.genres = [ideaObj.genre];
  }
  if (ideaObj.platform && !ideaObj.platforms) {
    ideaObj.platforms = [ideaObj.platform];
  }
  
  // Ensure arrays exist
  ideaObj.genres = ideaObj.genres || [];
  ideaObj.platforms = ideaObj.platforms || [];
  
  return ideaObj;
};

// NO CONVERSION NEEDED - Send arrays directly to LLM
exports.generateIdea = async (req, res) => {
  try {
    // req.body already contains arrays from frontend
    const response = await aiLLMClient.post(
      "/ai/idea/generate",
      req.body  // Send arrays directly
    );

    res.json(response.data);
  } catch (error) {
    console.error("Generate idea error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to generate idea" 
    });
  }
};

exports.checkFeasibility = async (req, res) => {
  try {
    const response = await aiLLMClient.post(
      "/ai/idea/feasibility",
      { idea: req.body.idea }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Check feasibility error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to check feasibility" 
    });
  }
};

exports.saveIdea = async (req, res) => {
  try {
    const { 
      title, 
      content, 
      genres,      // Array
      platforms,   // Array
      targetAudience, 
      coreMechanic, 
      artStyle, 
      monetization,
      feasibilityScore,
      risks 
    } = req.body;

    // Extract title from content if not provided
    const ideaTitle = title || extractTitleFromContent(content);

    const idea = new Idea({
      title: ideaTitle,
      content,
      genres: genres || [],
      platforms: platforms || [],
      targetAudience,
      coreMechanic,
      artStyle,
      monetization,
      feasibilityScore,
      risks,
      createdBy: req.user.id
    });

    await idea.save();
    
    res.status(201).json({ 
      success: true, 
      message: "Idea saved successfully",
      idea: normalizeIdeaData(idea) 
    });
  } catch (error) {
    console.error("Error saving idea:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to save idea" 
    });
  }
};

exports.getSavedIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });
    
    const normalizedIdeas = ideas.map(normalizeIdeaData);
    
    res.json({
      success: true,
      ideas: normalizedIdeas
    });
  } catch (error) {
    console.error("Error fetching ideas:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ideas"
    });
  }
};

exports.getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: "Idea not found"
      });
    }
    
    res.json({
      success: true,
      idea: normalizeIdeaData(idea)
    });
  } catch (error) {
    console.error("Error fetching idea:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch idea"
    });
  }
};

// Helper function to extract title from content
function extractTitleFromContent(content) {
  const titleMatch = content.match(/TITLE:\s*(.+)/i);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }
  
  const firstLine = content.split('\n')[0];
  return firstLine.length > 50 ? "Game Idea" : firstLine;
}