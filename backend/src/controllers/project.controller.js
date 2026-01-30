const Project = require("../models/Project");
const Idea = require("../models/Idea");

const normalizeToArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};


/**
 * 1️⃣ CREATE PROJECT MANUALLY
 */
exports.createProjectManual = async (req, res) => {
  try {
    const {
      name,
      description,
      genres,
      platforms,
      targetAudience,
      coreMechanic,
      artStyle,
      monetization
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required"
      });
    }

    const project = await Project.create({
      name,
      description,
      genres: normalizeToArray(req.body.genres),
      platforms: normalizeToArray(req.body.platforms),
      targetAudience,
      coreMechanic,
      artStyle,
      monetization,
      owner: req.user.id
    });

    res.status(201).json({
      success: true,
      project
    });
  } catch (error) {
    console.error("Create manual project error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create project"
    });
  }
};

/**
 * 2️⃣ CREATE PROJECT FROM IDEA
 */
exports.createProjectFromIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;

    const idea = await Idea.findOne({
      _id: ideaId,
      createdBy: req.user.id
    });

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: "Idea not found"
      });
    }

    if (idea.isConvertedToProject) {
      return res.status(400).json({
        success: false,
        message: "Idea already converted to a project"
      });
    }

    const project = await Project.create({
      name: idea.title || "Untitled Project",
      description: idea.content.slice(0, 200),
      genres: idea.genres || [],
      platforms: idea.platforms || [],
      targetAudience: idea.targetAudience,
      coreMechanic: idea.coreMechanic,
      artStyle: idea.artStyle,
      monetization: idea.monetization,
      sourceIdea: idea._id,
      owner: req.user.id
    });


    idea.isConvertedToProject = true;
    await idea.save();

    res.status(201).json({
      success: true,
      project
    });
  } catch (error) {
    console.error("Create project from idea error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create project from idea"
    });
  }
};

/**
 * GET ALL PROJECTS
 */
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id })
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects"
    });
  }
};

/**
 * GET PROJECT BY ID
 */
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.id
    }).populate("sourceIdea");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch project"
    });
  }
};

/**
 * UPDATE PROJECT
 */
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update project"
    });
  }
};

/**
 * DELETE PROJECT
 */
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete project"
    });
  }
};
