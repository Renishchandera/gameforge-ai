import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProjectDocumentsAPI,
  getDocumentAPI,
  createDocumentAPI,
  updateDocumentAPI,
  deleteDocumentAPI,
  uploadAttachmentAPI,
  deleteAttachmentAPI,
  getAttachmentUrlAPI,
  exportDocumentToPDFAPI,
  generateDocumentWithAIAPI
} from "./documentAPI";

// Async Thunks
export const fetchDocuments = createAsyncThunk(
  "documents/fetchDocuments",
  async ({ projectId, filters }, { rejectWithValue }) => {
    try {
      const response = await getProjectDocumentsAPI(projectId, filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch documents");
    }
  }
);

export const fetchDocument = createAsyncThunk(
  "documents/fetchDocument",
  async (documentId, { rejectWithValue }) => {
    try {
      const response = await getDocumentAPI(documentId);
      console.log("THUNK RESPONSE:", response);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch document");
    }
  }
);

export const createDocument = createAsyncThunk(
  "documents/createDocument",
  async ({ projectId, data }, { rejectWithValue }) => {
    try {
      const response = await createDocumentAPI(projectId, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create document");
    }
  }
);

export const updateDocument = createAsyncThunk(
  "documents/updateDocument",
  async ({ documentId, data }, { rejectWithValue }) => {
    try {
      const response = await updateDocumentAPI(documentId, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update document");
    }
  }
);

export const deleteDocument = createAsyncThunk(
  "documents/deleteDocument",
  async (documentId, { rejectWithValue }) => {
    try {
      await deleteDocumentAPI(documentId);
      return documentId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete document");
    }
  }
);

export const uploadAttachment = createAsyncThunk(
  "documents/uploadAttachment",
  async ({ projectId, file, documentId, category }, { rejectWithValue }) => {
    try {
      const response = await uploadAttachmentAPI(projectId, file, documentId, category);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to upload attachment");
    }
  }
);

export const deleteAttachment = createAsyncThunk(
  "documents/deleteAttachment",
  async ({ attachmentId, documentId }, { rejectWithValue }) => {
    try {
      await deleteAttachmentAPI(attachmentId);
      return { attachmentId, documentId };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete attachment");
    }
  }
);

export const getAttachmentUrl = createAsyncThunk(
  "documents/getAttachmentUrl",
  async (attachmentId, { rejectWithValue }) => {
    try {
      const response = await getAttachmentUrlAPI(attachmentId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to get attachment URL");
    }
  }
);

// In documentSlice.js, update the exportToPDF thunk
// In documentSlice.js, update the exportToPDF thunk
export const exportToPDF = createAsyncThunk(
  "documents/exportToPDF",
  async ({ documentId, filename }, { rejectWithValue }) => {
    try {
      const response = await exportDocumentToPDFAPI(documentId);

      // Ensure filename ends with .pdf
      let safeFilename = filename || `document-${documentId}.pdf`;
      
      // If filename doesn't end with .pdf, add it
      if (!safeFilename.toLowerCase().endsWith('.pdf')) {
        safeFilename = safeFilename + '.pdf';
      }
      
      // Remove any path separators or special characters that could cause issues
      safeFilename = safeFilename.replace(/[/\\?%*:|"<>]/g, '-');

      // Create download link with safe filename
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', safeFilename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true, filename: safeFilename };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to export PDF");
    }
  }
);


export const generateWithAI = createAsyncThunk(
  "documents/generateWithAI",
  async ({ projectId, data }, { rejectWithValue }) => {
    try {
      const response = await generateDocumentWithAIAPI(projectId, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to generate with AI");
    }
  }
);

const documentSlice = createSlice({
  name: "documents",
  initialState: {
    documents: [],
    currentDocument: null,
    attachments: [],
    stats: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      pages: 0
    },
    filters: {
      type: "all",
      search: ""
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentDocument: (state) => {
      state.currentDocument = null;
      state.attachments = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Documents
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload.documents;
        state.stats = action.payload.stats || [];
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Document
      .addCase(fetchDocument.pending, (state) => {
        state.loading = true;
        state.currentDocument = null;
        state.error = null;
      })
      .addCase(fetchDocument.fulfilled, (state, action) => {
        console.log("REDUCER:", action.payload);

        state.loading = false;
        state.currentDocument = action.payload.document;
        state.attachments = action.payload.attachments || [];
      })
      .addCase(fetchDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Document
      .addCase(createDocument.fulfilled, (state, action) => {
        state.documents = [action.payload.document, ...state.documents];
      })

      // Update Document
      .addCase(updateDocument.fulfilled, (state, action) => {
        if (state.currentDocument?._id === action.payload.document._id) {
          state.currentDocument = action.payload.document;
        }
        state.documents = state.documents.map(doc =>
          doc._id === action.payload.document._id ? action.payload.document : doc
        );
      })

      // Delete Document
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter(doc => doc._id !== action.payload);
        if (state.currentDocument?._id === action.payload) {
          state.currentDocument = null;
        }
      })

      // Upload Attachment
      .addCase(uploadAttachment.fulfilled, (state, action) => {
        // Add to attachments array in state
        state.attachments.push(action.payload.attachment);

        // Also update the currentDocument's metadata if needed
        if (state.currentDocument) {
          // You could add a virtual count, but don't store full attachments here
          state.currentDocument._attachmentCount = (state.currentDocument._attachmentCount || 0) + 1;
        }
      })

      // Delete Attachment
      .addCase(deleteAttachment.fulfilled, (state, action) => {
        state.attachments = state.attachments.filter(
          att => att._id !== action.payload.attachmentId
        );
      })

      // Generate with AI
      .addCase(generateWithAI.fulfilled, (state, action) => {
        state.documents = [action.payload.document, ...state.documents];
      });
  }
});

export const { setFilters, clearCurrentDocument, clearError } = documentSlice.actions;
export default documentSlice.reducer;