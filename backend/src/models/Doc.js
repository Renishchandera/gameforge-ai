const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    type: {
      type: String,
      enum: ["GDD", "Design Notes", "Tech Notes", "AI Output"],
      required: true
    },

    title: String,
    content: String,

    generatedByAI: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("Doc", documentSchema);
