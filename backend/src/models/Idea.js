const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema(
  {
    title: String,
    content: { type: String, required: true },

    // Idea attributes
    genre: String,
    platform: String,
    targetAudience: String,
    coreMechanic: String,
    artStyle: String,
    monetization: String,

    // AI outputs
    feasibilityScore: Number,
    // successScore: Number,
    risks: [String],

    // Ownership
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Linking
    isConvertedToProject: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("Idea", ideaSchema);
