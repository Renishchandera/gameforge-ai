// routes/document.routes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const documentController = require("../controllers/document.controller");
const upload = require("../middlewares/upload.middleware");

// All routes require authentication
router.use(auth);

// Document CRUD
router.post("/projects/:projectId/documents", documentController.createDocument);
router.get("/projects/:projectId/documents", documentController.getProjectDocuments);
router.get("/documents/:documentId", documentController.getDocument);
router.put("/documents/:documentId", documentController.updateDocument);
router.delete("/documents/:documentId", documentController.deleteDocument);

// File attachments
router.post(
  "/projects/:projectId/documents/:documentId/attachments",
  upload.single("file"),
  upload.handleMulterError,  // Add error handler
  documentController.uploadAttachment
);
router.post(
  "/projects/:projectId/attachments",
  upload.single("file"),
  documentController.uploadAttachment
);
router.delete("/attachments/:attachmentId", documentController.deleteAttachment);

// Export
router.post("/documents/:documentId/export/pdf", documentController.exportToPDF);

// AI Generation
router.post("/projects/:projectId/documents/generate-ai", documentController.generateWithAI);
// Add this route
router.get("/attachments/:attachmentId/url", documentController.getAttachmentUrl);



module.exports = router;