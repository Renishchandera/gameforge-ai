const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    genre: String,
    platform: String,
    targetAudience: String,
    coreMechanic: String,
    artStyle: String,
    monetization: String,
    feasibilityScore: Number,
    risks: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Idea", ideaSchema);