import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import {
  uploadAttachment,
  deleteAttachment,
  getAttachmentUrl
} from '../../features/documents/documentSlice';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Upload,
  File,
  Image,
  FileText,
  Archive,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import { formatBytes } from '../../lib/utils';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const getFileIcon = (mimeType) => {
  if (mimeType?.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />;
  if (mimeType === 'application/pdf') return <FileText className="h-5 w-5 text-red-500" />;
  if (mimeType?.includes('zip') || mimeType?.includes('compressed')) 
    return <Archive className="h-5 w-5 text-yellow-500" />;
  if (mimeType?.includes('word') || mimeType?.includes('document'))
    return <FileText className="h-5 w-5 text-blue-700" />;
  return <File className="h-5 w-5 text-gray-500" />;
};

export default function FileAttachments({ projectId, documentId, attachments = [] }) {
  const dispatch = useDispatch();
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(f => 
        `${f.file.name}: ${f.errors[0]?.message || 'Invalid file'}`
      ).join(', ');
      setError(`Upload failed: ${errors}`);
    }

    if (acceptedFiles.length === 0) return;

    // Add files to uploading state
    const newUploadingFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: 'pending'
    }));
    
    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Upload each file
    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      const uploadingFile = newUploadingFiles[i];
      
      try {
        // Update status to uploading
        setUploadingFiles(prev => 
          prev.map(f => 
            f.id === uploadingFile.id 
              ? { ...f, status: 'uploading', progress: 30 }
              : f
          )
        );

        // Simulate progress (since we can't track actual progress easily)
        const progressInterval = setInterval(() => {
          setUploadingFiles(prev => 
            prev.map(f => 
              f.id === uploadingFile.id && f.status === 'uploading'
                ? { ...f, progress: Math.min(f.progress + 10, 90) }
                : f
            )
          );
        }, 200);

        const result = await dispatch(uploadAttachment({
          projectId,
          file,
          documentId,
          category: 'document'
        })).unwrap();

        clearInterval(progressInterval);

        // Mark as complete
        setUploadingFiles(prev => 
          prev.map(f => 
            f.id === uploadingFile.id 
              ? { ...f, status: 'complete', progress: 100 }
              : f
          )
        );

        // Remove from uploading list after 2 seconds
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(f => f.id !== uploadingFile.id));
        }, 2000);

      } catch (err) {
        setUploadingFiles(prev => 
          prev.map(f => 
            f.id === uploadingFile.id 
              ? { ...f, status: 'error', error: err.message }
              : f
          )
        );
        
        setError(`Failed to upload ${file.name}: ${err.message}`);
        
        // Remove failed upload after 3 seconds
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(f => f.id !== uploadingFile.id));
        }, 3000);
      }
    }
  }, [projectId, documentId, dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md']
    }
  });

  const handleDownload = async (attachment) => {
    setDownloadingId(attachment._id);
    try {
      const result = await dispatch(getAttachmentUrl(attachment._id)).unwrap();
      
      // Create a temporary link and click it
      const link = document.createElement('a');
      link.href = result.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Download failed:', error);
      setError('Failed to download file');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (attachmentId) => {
    if (!window.confirm('Are you sure you want to delete this attachment? This action cannot be undone.')) {
      return;
    }
    
    setDeletingId(attachmentId);
    try {
      await dispatch(deleteAttachment({ attachmentId, documentId })).unwrap();
    } catch (error) {
      console.error('Delete failed:', error);
      setError('Failed to delete file');
    } finally {
      setDeletingId(null);
    }
  };

  // Combine attachments and uploading files for display
  const allItems = [
    ...attachments.map(att => ({ ...att, type: 'attachment' })),
    ...uploadingFiles.map(file => ({
      _id: file.id,
      originalName: file.file.name,
      fileSize: file.file.size,
      mimeType: file.file.type,
      createdAt: new Date().toISOString(),
      uploadedBy: { username: 'Uploading...' },
      type: 'uploading',
      status: file.status,
      progress: file.progress,
      error: file.error
    }))
  ];

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
      >
        <input {...getInputProps()} />
        <div className={`transition-transform ${isDragActive ? 'scale-110' : ''}`}>
          <Upload className={`h-10 w-10 mx-auto mb-4 transition-colors
            ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} 
          />
          {isDragActive ? (
            <p className="text-blue-600 font-medium">Drop files here to upload...</p>
          ) : (
            <div>
              <p className="font-medium text-gray-700">Drag & drop files here</p>
              <p className="text-sm text-gray-500 mt-1">
                or click to select (max 10MB per file)
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Supported: Images, PDF, ZIP, DOC, TXT, MD
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="animate-in slide-in-from-top-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Attachments List */}
      {allItems.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-8"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allItems.map((item) => (
                <TableRow key={item._id} className="group hover:bg-gray-50">
                  <TableCell>{getFileIcon(item.mimeType)}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {item.originalName}
                      {item.type === 'uploading' && (
                        <Badge variant={
                          item.status === 'complete' ? 'default' :
                          item.status === 'error' ? 'destructive' :
                          'secondary'
                        } className="text-xs">
                          {item.status === 'uploading' && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                          {item.status === 'complete' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {item.status === 'error' && <XCircle className="h-3 w-3 mr-1" />}
                          {item.status}
                        </Badge>
                      )}
                    </div>
                    {/* Progress bar for uploading */}
                    {item.type === 'uploading' && item.status === 'uploading' && (
                      <div className="w-full mt-2">
                        <Progress value={item.progress} className="h-1" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{formatBytes(item.fileSize)}</TableCell>
                  <TableCell>
                    {item.type === 'uploading' 
                      ? 'Just now'
                      : new Date(item.createdAt).toLocaleDateString()
                    }
                  </TableCell>
                  <TableCell>
                    {item.uploadedBy?.username || 'Unknown'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {item.type === 'attachment' && (
                        <>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownload(item)}
                                  disabled={downloadingId === item._id}
                                  className="h-8 w-8 p-0"
                                >
                                  {downloadingId === item._id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Download className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Download</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(item._id)}
                                  disabled={deletingId === item._id}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  {deletingId === item._id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Upload className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No attachments yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Upload design documents, concept art, or other files
          </p>
        </div>
      )}

      {/* Stats Footer */}
      {attachments.length > 0 && (
        <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-4">
          <span>Total attachments: {attachments.length}</span>
          <span>Total size: {formatBytes(attachments.reduce((acc, att) => acc + att.fileSize, 0))}</span>
        </div>
      )}
    </div>
  );
}