// controllers/document.controller.js
const Document = require("../models/Document");
const FileAttachment = require("../models/FileAttachment");
const Project = require("../models/Project");
const S3UploadService = require("../services/s3Upload.service");
//const PDFExportService = require("../services/pdfExport.service");
const PDFPuppeteerService = require("../services/pdfPuppeteer.service");





/**
 * Helper function to verify project access
 */
const verifyProjectAccess = async (projectId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    $or: [
      { owner: userId },
      { collaborators: userId } // Add this if you have collaborators
    ]
  });
  return project;
};




/**
 * Create a new document
 */
exports.createDocument = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Verify project ownership
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

    const document = new Document({
      ...req.body,
      project: projectId,
      createdBy: req.user.id,
      lastEditedBy: req.user.id
    });

    await document.save();

    res.status(201).json({
      success: true,
      document
    });
  } catch (error) {
    console.error("Create document error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create document"
    });
  }
};

/**
 * Get all documents for a project with attachment counts
 */
exports.getProjectDocuments = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { type, page = 1, limit = 20 } = req.query;

    const query = { project: projectId };
    if (type && type !== "all") query.type = type;

    const documents = await Document.find(query)
      .populate("createdBy", "username")
      .populate("lastEditedBy", "username")
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get attachment counts for each document
    const documentIds = documents.map(doc => doc._id);
    const attachmentCounts = await FileAttachment.aggregate([
      { $match: { document: { $in: documentIds } } },
      { $group: { _id: "$document", count: { $sum: 1 } } }
    ]);

    // Create a map of documentId -> count
    const countMap = {};
    attachmentCounts.forEach(item => {
      countMap[item._id] = item.count;
    });

    // Add attachmentCount to each document
    const documentsWithCounts = documents.map(doc => {
      const docObj = doc.toObject();
      docObj.attachmentCount = countMap[doc._id] || 0;
      return docObj;
    });

    const total = await Document.countDocuments(query);

    // Get document stats
    const stats = await Document.aggregate([
      { $match: { project: projectId } },
      { $group: {
        _id: "$type",
        count: { $sum: 1 }
      }}
    ]);

    res.json({
      success: true,
      documents: documentsWithCounts,
      stats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get documents error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get documents"
    });
  }
};

/**
 * Get single document
 */
exports.getDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findById(documentId)
      .populate("createdBy", "username")
      .populate("lastEditedBy", "username");

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    // Verify project access
    const project = await verifyProjectAccess(document.project, req.user.id);
    
    if (!project) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // Get attachments
    const attachments = await FileAttachment.find({
      document: documentId
    }).populate("uploadedBy", "username");

    res.json({
      success: true,
      document,
      attachments
    });
  } catch (error) {
    console.error("Get document error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get document"
    });
  }
};


/**
 * Update document - clean permission check
 */
exports.updateDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    // First get the document
    const document = await Document.findById(documentId);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    // Verify project access (clean, reusable)
    const project = await verifyProjectAccess(document.project, req.user.id);
    
    if (!project) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to edit this document"
      });
    }

    // Optional: Only creator can edit? Or any project member?
    // If you want only creator:
    // if (document.createdBy.toString() !== req.user.id) {
    //   return res.status(403).json({ message: "Only creator can edit" });
    // }

    // Update fields
    Object.assign(document, req.body);
    document.lastEditedBy = req.user.id;

    await document.save();

    res.json({
      success: true,
      document
    });
  } catch (error) {
    console.error("Update document error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update document"
    });
  }
};


/**
 * Delete document
 */
/**
 * Delete document with cascade
 */
exports.deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findOne({
      _id: documentId,
      createdBy: req.user.id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found or you don't have permission"
      });
    }

    // STEP 1: Find all attachments for this document
    const attachments = await FileAttachment.find({ document: documentId });

    // STEP 2: Delete files from S3
    const deletePromises = attachments.map(att => 
      S3UploadService.deleteFile(att.s3Key).catch(err => {
        console.error(`Failed to delete S3 file ${att.s3Key}:`, err);
        // Continue even if S3 delete fails
      })
    );
    
    await Promise.all(deletePromises);

    // STEP 3: Delete attachments from database
    await FileAttachment.deleteMany({ document: documentId });

    // STEP 4: Delete the document
    await document.deleteOne();

    res.json({
      success: true,
      message: "Document and associated files deleted successfully",
      deletedAttachments: attachments.length
    });
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete document"
    });
  }
};


/**
 * Upload file attachment
 */
// In uploadAttachment method, remove s3Url
exports.uploadAttachment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const { projectId, documentId } = req.params;
    const { category = "document" } = req.body;

    // Upload to S3
    const uploadResult = await S3UploadService.uploadFile(
      req.file,
      projectId,
      req.user.id,
      category
    );

    // Save to database - REMOVED s3Url
    const attachment = new FileAttachment({
      project: projectId,
      document: documentId || null,
      filename: uploadResult.s3Key.split("/").pop(),
      originalName: uploadResult.fileName,
      s3Key: uploadResult.s3Key,
      // s3Url removed
      fileSize: uploadResult.fileSize,
      mimeType: uploadResult.mimeType,
      uploadedBy: req.user.id,
      category
    });

    await attachment.save();

    res.status(201).json({
      success: true,
      attachment
    });
  } catch (error) {
    console.error("Upload attachment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload file"
    });
  }
};

/**
 * Delete attachment
 */
/**
 * Delete attachment
 */
exports.deleteAttachment = async (req, res) => {
  try {
    const { attachmentId } = req.params;

    const attachment = await FileAttachment.findOne({
      _id: attachmentId,
      uploadedBy: req.user.id
    });

    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: "Attachment not found"
      });
    }

    // Delete from S3
    await S3UploadService.deleteFile(attachment.s3Key);

    // Delete from database
    await attachment.deleteOne();

    res.json({
      success: true,
      message: "Attachment deleted successfully"
    });
  } catch (error) {
    console.error("Delete attachment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete attachment"
    });
  }
};

// /**
//  * Export document to PDF with PDF KIT
//  */
// exports.exportToPDF = async (req, res) => {
//   try {
//     const { documentId } = req.params;

//     const document = await Document.findById(documentId)
//       .populate("createdBy", "username");

//     if (!document) {
//       return res.status(404).json({
//         success: false,
//         message: "Document not found"
//       });
//     }

//     // Generate PDF
//     const pdfBuffer = await PDFExportService.generateDocumentPDF(document, req.user);

//     // Set response headers
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="${document.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf"`
//     );

//     // Send PDF
//     res.send(pdfBuffer);
//   } catch (error) {
//     console.error("Export to PDF error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to export document"
//     });
//   }
// };


/**
 * Export document to PDF with PUPPETEER
 */
//TODO: OPTIMIZE THIS< THIS IS TOO HEAVY FOR PRODUCTION. MANY WAYS TO OPTIMIZE WITH PERSISTING THE QUALITY
exports.exportToPDF = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findById(documentId)
      .populate("createdBy", "username");

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    // Generate PDF using Puppeteer
    const pdfBuffer = await PDFPuppeteerService.generateDocumentPDF(document, req.user);

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${document.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf"`
    );

    // Send PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Export to PDF error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export document"
    });
  }
};

/**
 * Generate document with AI
 */
exports.generateWithAI = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { type, idea } = req.body;

    // Here you'll integrate with your existing AI-LLM service
    // For now, returning a template
    
    const aiGeneratedContent = `# ${type}\n\n## Overview\n\nThis document was generated by AI based on: ${idea}\n\n## Core Concept\n\n- Genre: RPG\n- Platform: PC\n- Target Audience: Casual gamers\n\n## Gameplay Loop\n\n1. Player explores world\n2. Encounters challenges\n3. Makes meaningful choices\n4. Story adapts\n\n## Key Features\n\n- Procedurally generated quests\n- Dynamic dialogue system\n- Character customization\n- Multiple endings based on choices`;

    const document = new Document({
      project: projectId,
      title: `${type} - ${new Date().toLocaleDateString()}`,
      type,
      content: aiGeneratedContent,
      generatedByAI: true,
      createdBy: req.user.id,
      lastEditedBy: req.user.id
    });

    await document.save();

    res.status(201).json({
      success: true,
      document
    });
  } catch (error) {
    console.error("AI generation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate document with AI"
    });
  }
};


/**
 * Get signed URL for attachment
 */
exports.getAttachmentUrl = async (req, res) => {
  try {
    const { attachmentId } = req.params;

    const attachment = await FileAttachment.findById(attachmentId)
      .populate("project");

    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: "Attachment not found"
      });
    }

    // Verify access to project
    const project = await Project.findOne({
      _id: attachment.project._id,
      $or: [
        { owner: req.user.id },
        { collaborators: req.user.id }
      ]
    });

    if (!project) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // Generate signed URL (expires in 1 hour)
    const signedUrl = await S3UploadService.getSignedUrl(attachment.s3Key, 3600);

    res.json({
      success: true,
      url: signedUrl,
      expiresIn: 3600,
      filename: attachment.originalName
    });
  } catch (error) {
    console.error("Get attachment URL error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate download URL"
    });
  }
};