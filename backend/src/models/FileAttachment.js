// models/FileAttachment.js
const mongoose = require("mongoose");

const fileAttachmentSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true
    },

    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document", // Optional: attach to specific document
      default: null
    },

    filename: {
      type: String,
      required: true
    },

    originalName: {
      type: String,
      required: true
    },

    s3Key: {
      type: String,
      required: true,
      unique: true
    },

    // s3Url: {
    //   type: String,
    //   required: true
    // },

    fileSize: {
      type: Number,
      required: true
    },

    mimeType: {
      type: String,
      required: true
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    category: {
      type: String,
      enum: ["concept-art", "document", "asset", "other"],
      default: "document"
    }

  },
  { timestamps: true }
);

// Index for faster queries
fileAttachmentSchema.index({ project: 1, document: 1 });

module.exports = mongoose.model("FileAttachment", fileAttachmentSchema);