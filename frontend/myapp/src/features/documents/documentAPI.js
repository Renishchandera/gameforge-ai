// features/documents/documentAPI.js
import api from "../../services/axiosInstance";

/**
 * Get all documents for a project
 */
export const getProjectDocumentsAPI = async (projectId, filters = {}) => {
  const { type, page, limit } = filters;
  const params = new URLSearchParams();
  
  if (type && type !== "all") params.append("type", type);
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  
  const res = await api.get(`/projects/${projectId}/documents?${params}`);
  return res.data;
};

/**
 * Get single document
 */
export const getDocumentAPI = async (documentId) => {
  const res = await api.get(`/documents/${documentId}`);
  return res.data;
};

/**
 * Create document
 */
export const createDocumentAPI = async (projectId, data) => {
  const res = await api.post(`/projects/${projectId}/documents`, data);
  return res.data;
};

/**
 * Update document
 */
export const updateDocumentAPI = async (documentId, data) => {
  const res = await api.put(`/documents/${documentId}`, data);
  return res.data;
};

/**
 * Delete document
 */
export const deleteDocumentAPI = async (documentId) => {
  const res = await api.delete(`/documents/${documentId}`);
  return res.data;
};


/**
 * Get signed URL for attachment (FIX: Add this missing function)
 */
export const getAttachmentUrlAPI = async (attachmentId) => {
  const res = await api.get(`/attachments/${attachmentId}/url`);
  return res.data;
};

/**
 * Upload file attachment
 */
export const uploadAttachmentAPI = async (projectId, file, documentId = null, category = "document") => {
  const formData = new FormData();
  formData.append("file", file);
  if (category) formData.append("category", category);
  
  const url = documentId 
    ? `/projects/${projectId}/documents/${documentId}/attachments`
    : `/projects/${projectId}/attachments`;
  
  const res = await api.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

/**
 * Delete attachment
 */
export const deleteAttachmentAPI = async (attachmentId) => {
  const res = await api.delete(`/attachments/${attachmentId}`);
  return res.data;
};

/**
 * Export document to PDF
 */
export const exportDocumentToPDFAPI = async (documentId) => {
  const res = await api.post(`/documents/${documentId}/export/pdf`, {}, {
    responseType: "blob"
  });
  return res.data;
};

/**
 * Generate document with AI
 */
export const generateDocumentWithAIAPI = async (projectId, data) => {
  const res = await api.post(`/projects/${projectId}/documents/generate-ai`, data);
  return res.data;
};