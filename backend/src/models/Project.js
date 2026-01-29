const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    description: String, // short project summary

    // Core game definition
    genre: String,
    platform: String,
    targetAudience: String,
    coreMechanic: String,
    artStyle: String,
    monetization: String,

    // Optional link to idea
    sourceIdea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Idea",
      default: null
    },

    // AI predictions
    successPrediction: {
      probability: Number,
      confidence: String,
      verdict: String,
      modelVersion: String,
      predictedAt: Date
    },

    // Ownership
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Status
    status: {
      type: String,
      enum: ["concept", "pre-production", "production", "paused", "released"],
      default: "concept"
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("Project", projectSchema);
