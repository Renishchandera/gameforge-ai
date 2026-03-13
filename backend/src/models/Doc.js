const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
{
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
    index: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  type: {
    type: String,
    enum: ["GDD", "Design Notes", "Tech Notes", "AI Output", "General"],
    default: "General"
  },

  content: {
    type: String,
    default: ""
  },

  generatedByAI: {
    type: Boolean,
    default: false
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  lastEditedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);