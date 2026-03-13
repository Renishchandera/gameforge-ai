import { useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocument, clearCurrentDocument } from '../../features/documents/documentSlice';
import DocumentEditor from '../../components/documents/DocumentEditor';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function DocumentView() {
    const { projectId, documentId } = useParams();
    const dispatch = useDispatch();
    const fetchAttempted = useRef(false);

    const { currentDocument, loading, error } = useSelector((state) => state.documents);

    useEffect(() => {
        // This prevents the double-fetch in StrictMode
        if (!fetchAttempted.current) {
            fetchAttempted.current = true;
            dispatch(clearCurrentDocument());
            dispatch(fetchDocument(documentId));
        }

        // Cleanup only when unmounting (not on re-renders)
        return () => {
            // Only clear if we're actually unmounting
            dispatch(clearCurrentDocument());
            fetchAttempted.current = false;
        };
    }, [dispatch, documentId]);

    // Reset when documentId changes
    useEffect(() => {
        fetchAttempted.current = false;
    }, [documentId]);

    if (loading) {
        return (
            <div className="container mx-auto py-6 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!currentDocument) {
        return (
            <div className="container mx-auto py-6">
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Document not found</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <DocumentEditor
            document={currentDocument}
            projectId={projectId}
        />
    );
}