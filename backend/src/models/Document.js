// models/Document.js
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
      default: "<p>Start writing your document...</p>" // HTML format
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
  { 
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

// Virtual for plain text version (for word count, search)
documentSchema.virtual("plainText").get(function() {
  if (!this.content) return "";
  return this.content.replace(/<[^>]*>/g, " ");
});

// Virtual for word count
documentSchema.virtual("wordCount").get(function() {
  return this.plainText.split(/\s+/).filter(Boolean).length;
});

// Virtual for reading time
documentSchema.virtual("readingTime").get(function() {
  const wordsPerMinute = 200;
  return Math.ceil(this.wordCount / wordsPerMinute);
});

module.exports = mongoose.model("Document", documentSchema);