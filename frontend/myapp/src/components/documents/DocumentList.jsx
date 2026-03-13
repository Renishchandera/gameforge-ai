import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import {
  fetchDocuments,
  setFilters,
  deleteDocument,
  exportToPDF
} from '../../features/documents/documentSlice';
import DocumentCard from './DocumentCard';
import DocumentEditor from './DocumentEditor';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { Plus, Search, FileText, Sparkles, X } from 'lucide-react';
import CreateDocumentDialog from './CreateDocumentDialog';
import AIGenerationDialog from './AIGenerationDialog';

export default function DocumentList() {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const documentsState = useSelector((state) => state.documents);

  const {
    documents,
    loading,
    error,
    filters,
    stats,
    pagination
  } = documentsState;

  useEffect(() => {
  console.log("Redux documents:", documents);
}, [documents]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    if (projectId) {
      loadDocuments();
    }
  }, [projectId, filters?.type, filters?.search, pagination?.page]);

  const loadDocuments = () => {
    dispatch(fetchDocuments({ projectId, filters }));
  };

  const handleSearch = (value) => {
    setSearchInput(value);

    clearTimeout(window.searchTimeout);

    window.searchTimeout = setTimeout(() => {
      dispatch(setFilters({ search: value }));
    }, 500);
  };

  const handleTypeFilter = (value) => {
    dispatch(setFilters({ type: value }));
  };

  const handleDelete = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document? All attachments will also be deleted.')) {
      await dispatch(deleteDocument(documentId));
      loadDocuments();
    }
  };

  const handleExport = async (documentId) => {
    await dispatch(exportToPDF(documentId));
  };

  const handleView = (documentId) => {
    navigate(`/projects/${projectId}/documents/${documentId}`);
  };

  const handleEdit = (document) => {
    setEditingDocument(document);
  };

  const handleCloseEditor = () => {
    setEditingDocument(null);
    loadDocuments();
  };

  const StatBadge = ({ type, count, icon }) => (
    <Button
      variant={filters.type === type ? "default" : "outline"}
      size="sm"
      onClick={() => handleTypeFilter(type)}
      className="flex items-center gap-2"
    >
      <span>{icon}</span>
      <span>{type}</span>
      <span className="ml-1 bg-gray-200 px-1.5 rounded-full text-xs">
        {count}
      </span>
    </Button>
  );

  if (editingDocument) {
    return (
      <DocumentEditor
        document={editingDocument}
        projectId={projectId}
        onClose={handleCloseEditor}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your project documents, design notes, and AI-generated content
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowAIDialog(true)}
            variant="outline"
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Generate with AI
          </Button>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="gap-2 bg-black text-white hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
            New Document
          </Button>
        </div>
      </div>

      {/* Stats / Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <StatBadge type="all" count={pagination.total} icon="📋" />
        {stats.map((stat) => (
          <StatBadge
            key={stat._id}
            type={stat._id}
            count={stat.count}
            icon={documentTypeIcons[stat._id] || '📄'}
          />
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search documents..."
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchInput && (
          <button
            onClick={() => {
              setSearchInput('');
              dispatch(setFilters({ search: '' }));
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Document Grid */}
      {loading && documents.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
          <p className="text-gray-500 mb-4">
            Get started by creating your first document or generating one with AI
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => setShowCreateDialog(true)} variant="outline">
              Create Document
            </Button>
            <Button onClick={() => setShowAIDialog(true)}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate with AI
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <DocumentCard
              key={doc._id}
              document={doc}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onExport={handleExport}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreateDocumentDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        projectId={projectId}
        onSuccess={() => {
          setShowCreateDialog(false);
        }}
      />

      <AIGenerationDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        projectId={projectId}
        onSuccess={() => {
          setShowAIDialog(false);
        }}
      />
    </div>
  );
}

const documentTypeIcons = {
  'GDD': '🎮',
  'Design Notes': '📝',
  'Tech Notes': '⚙️',
  'AI Output': '🤖',
  'General': '📄'
};