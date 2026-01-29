const aiLLMClient = require("../services/aiLLM.client");
const Idea = require("../models/Idea");
exports.generateIdea = async (req, res) => {
  const response = await aiLLMClient.post(
    "/ai/idea/generate",
    req.body
  );

  res.json(response.data);
};

exports.checkFeasibility = async (req, res) => {
  const response = await aiLLMClient.post(
    "/ai/idea/feasibility",
    { idea: req.body.idea }
  );

  res.json(response.data);
};


exports.saveIdea = async (req, res) => {
  try {
    const { 
      title, 
      content, 
      genre, 
      platform, 
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
      genre,
      platform,
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
      idea 
    });
  } catch (error) {
    console.error("Error saving idea:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to save idea" 
    });
  }
};

// NEW: Get user's saved ideas
exports.getSavedIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .select("-__v");
    
    res.json({ success: true, ideas });
  } catch (error) {
    console.error("Error fetching ideas:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch ideas" 
    });
  }
};

// Helper function to extract title from content
function extractTitleFromContent(content) {
  // Look for TITLE: in the content
  const titleMatch = content.match(/TITLE:\s*(.+)/i);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }
  
  // Fallback: first line or generic title
  const firstLine = content.split('\n')[0];
  return firstLine.length > 50 ? "Game Idea" : firstLine;
}