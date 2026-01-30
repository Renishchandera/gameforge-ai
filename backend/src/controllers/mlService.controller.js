const mlServiceClient = require("../services/mlService.client");
const Project = require("../models/Project");

/**
 * Predict success for a project
 */
exports.predictProjectSuccess = async (req, res) => {
  try {
    const { projectId } = req.params; //GET: predict-success/:projectId

    // 1️⃣ Load project (ownership enforced)
    const project = await Project.findOne({
      _id: projectId,
      owner: req.user.id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // 2️⃣ Prepare ML input (RAW, SAFE, CANONICAL)
    const mlInput = {
      genre: project.genres?.[0] || "Unknown",
      platform: project.platforms?.[0] || "PC",
      price: project.price || 0,              // optional, safe default
      release_year: new Date().getFullYear() + 1, // assume future release
      is_multiplayer: Boolean(
        project.coreMechanic &&
        project.coreMechanic.toLowerCase().includes("multiplayer")
      ),
      team_size: 3 // default for indie (can improve later)
    };

    // 3️⃣ Call ML service
    const mlResponse = await mlServiceClient.post(
      "/predict-success",
      mlInput
    );

    const prediction = mlResponse.data;

    // 4️⃣ Persist prediction INSIDE project
    project.successPrediction = {
      probability: prediction.success_probability,
      confidence: prediction.confidence,
      verdict: prediction.verdict,
      modelVersion: prediction.model_version,
      predictedAt: new Date()
    };

    await project.save();

    // 5️⃣ Return to frontend
    res.json({
      success: true,
      prediction: project.successPrediction
    });

  } catch (error) {
    console.error("ML prediction error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to predict project success"
    });
  }
};
