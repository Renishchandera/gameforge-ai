import { FileText, MoreVertical, Download, Trash2, Edit, Eye, Calendar, User, Paperclip } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

const documentTypeIcons = {
  'GDD': '🎮',
  'Design Notes': '📝',
  'Tech Notes': '⚙️',
  'AI Output': '🤖',
  'General': '📄'
};

const documentTypeColors = {
  'GDD': 'bg-purple-100 text-purple-700 border-purple-200',
  'Design Notes': 'bg-blue-100 text-blue-700 border-blue-200',
  'Tech Notes': 'bg-green-100 text-green-700 border-green-200',
  'AI Output': 'bg-orange-100 text-orange-700 border-orange-200',
  'General': 'bg-gray-100 text-gray-700 border-gray-200'
};

export default function DocumentCard({ document, onEdit, onDelete, onExport, onView }) {
  const handleClick = (e) => {
    // Prevent navigation if clicking on dropdown or buttons
    if (e.target.closest('.dropdown-trigger') || e.target.closest('button')) {
      return;
    }
    onView?.(document._id);
  };

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 hover:border-gray-300"
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="text-2xl mt-1">{documentTypeIcons[document.type] || '📄'}</div>
            <div>
              <Badge
                variant="outline"
                className={`${documentTypeColors[document.type]} text-xs font-normal`}
              >
                {document.type}
              </Badge>
              <h3 className="font-semibold text-lg mt-2 group-hover:text-blue-600 transition-colors">
                {document.title}
              </h3>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="dropdown-trigger">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onView?.(document._id)}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(document)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport?.(document._id)}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(document._id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div
          className="text-sm text-gray-600 line-clamp-2 prose-sm"
          dangerouslySetInnerHTML={{
            __html: document.content?.substring(0, 200) + '...'
          }}
        />
      </CardContent>

      <CardFooter className="border-t pt-3 text-xs text-gray-500 flex justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {document.createdBy?.username || 'Unknown'}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDistanceToNow(new Date(document.updatedAt), { addSuffix: true })}
          </span>
        </div>
        <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
          {document.wordCount} words
        </span>
         {/* In DocumentCard.jsx, add to the footer */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Paperclip className="h-3 w-3" />
            {document.attachmentCount || 0} files
          </span>
          <span>•</span>
          <span>{document.wordCount} words</span>
        </div>
      </CardFooter>
    </Card>
  );
}