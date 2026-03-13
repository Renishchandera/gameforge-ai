import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import RichTextEditor from './RichTextEditor';
import FileAttachments from './FileAttachments';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import {
  Save,
  Download,
  X,
  Eye,
  Clock,
  User,
  FileText,
  Paperclip,
  FileDown,
  Loader2
} from 'lucide-react';
import {
  updateDocument,
  exportToPDF,
  clearCurrentDocument
} from '../../features/documents/documentSlice';
import { useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';

export default function DocumentEditor({ document, projectId, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState(document?.title || '');
  const [type, setType] = useState(document?.type || 'General');
  const [content, setContent] = useState(document?.content || '<p></p>');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');

  // Export dialog state
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportFilename, setExportFilename] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Get attachments from Redux state
  const attachments = useSelector((state) => state.documents.attachments);

  useEffect(() => {
    if (!document) return;

    setTitle(document.title || '');
    setType(document.type || 'General');
    setContent(document.content || '<p></p>');

    // Set default export filename based on document title and type
    const defaultFilename = generateDefaultFilename(document.title, document.type);
    setExportFilename(defaultFilename);
  }, [document]);

  // Generate a meaningful default filename (without .pdf extension)
  const generateDefaultFilename = (docTitle, docType) => {
    // Clean the title: remove special chars, replace spaces with underscores
    const cleanTitle = docTitle
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special chars
      .trim()
      .replace(/\s+/g, '_'); // Replace spaces with underscores

    // Add document type and date
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const typeMap = {
      'GDD': 'Game_Design_Document',
      'Design Notes': 'Design_Notes',
      'Tech Notes': 'Technical_Notes',
      'AI Output': 'AI_Generated',
      'General': 'Document'
    };

    const typeStr = typeMap[docType] || 'Document';

    // Return without .pdf extension
    return `${cleanTitle || 'Untitled'}_${typeStr}_${date}`;
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    setIsSaving(true);
    try {
      await dispatch(updateDocument({
        documentId: document._id,
        data: { title, type, content }
      })).unwrap();

      // Update export filename when document is saved
      setExportFilename(generateDefaultFilename(title, type));

    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportClick = () => {
    // Update filename in case title changed
    setExportFilename(generateDefaultFilename(title, type));
    setShowExportDialog(true);
  };

  const handleExportConfirm = async () => {
    setIsExporting(true);
    try {
      // Pass the custom filename to the export function
      await dispatch(exportToPDF({
        documentId: document._id,
        filename: exportFilename
      })).unwrap();

      setShowExportDialog(false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(`/projects/${projectId}/documents`);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearCurrentDocument());
    };
  }, [dispatch]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border rounded-lg p-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>

            <div className="flex-1 max-w-md">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Document title"
                className="text-lg font-semibold border-none focus-visible:ring-0 px-0"
              />
            </div>

            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GDD">🎮 Game Design Document</SelectItem>
                <SelectItem value="Design Notes">📝 Design Notes</SelectItem>
                <SelectItem value="Tech Notes">⚙️ Tech Notes</SelectItem>
                <SelectItem value="AI Output">🤖 AI Output</SelectItem>
                <SelectItem value="General">📄 General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportClick}
              className="gap-2"
            >
              <FileDown className="h-4 w-4" />
              Export PDF
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !title.trim()}
              className="gap-2 bg-black text-white hover:bg-gray-800"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {document?.createdBy?.username || 'You'}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Last edited {new Date(document?.updatedAt).toLocaleString()}
          </span>
          <Badge variant="outline" className="text-xs">
            v{document?.currentVersion || 1}
          </Badge>
          {document?.generatedByAI && (
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
              🤖 AI Generated
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-[400px] grid-cols-3">
          <TabsTrigger value="edit" className="gap-2">
            <FileText className="h-4 w-4" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="attachments" className="gap-2">
            <Paperclip className="h-4 w-4" />
            Attachments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-0">
          <RichTextEditor
            content={content}
            onChange={setContent}
            editable={true}
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="border rounded-lg bg-white p-8 min-h-[600px]">
            <div className="prose max-w-none">
              <h1 className="text-3xl font-bold mb-2">{title}</h1>
              <div className="flex gap-2 mb-6">
                <Badge>{type}</Badge>
                <span className="text-sm text-gray-500">
                  Last updated: {new Date(document?.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="attachments" className="mt-0">
          <FileAttachments
            projectId={projectId}
            documentId={document._id}
            attachments={attachments}
          />
        </TabsContent>
      </Tabs>

      {/* Export Dialog */}
      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileDown className="h-5 w-5" />
              Export as PDF
            </DialogTitle>
            <DialogDescription>
              Choose a filename for your PDF document. The file will be downloaded to your computer.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="filename">Filename</Label>
              <div className="flex items-center gap-1">
                <Input
                  id="filename"
                  value={exportFilename}
                  onChange={(e) => setExportFilename(e.target.value)}
                  placeholder="Enter filename"
                  className="flex-1"
                />
                <span className="text-sm text-gray-500">.pdf</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                .pdf extension will be added automatically if not included
              </p>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Preview:</span>{' '}
                {exportFilename.endsWith('.pdf')
                  ? exportFilename
                  : exportFilename + '.pdf'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowExportDialog(false)}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExportConfirm}
              disabled={isExporting || !exportFilename.trim()}
              className="bg-black text-white hover:bg-gray-800"
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}