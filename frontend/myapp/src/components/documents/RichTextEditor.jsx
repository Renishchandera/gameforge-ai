import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Link as LinkIcon,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Eye,
  Edit3
} from 'lucide-react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Separator } from '../ui/separator';
import { useState } from 'react';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const MenuButton = ({ onClick, icon: Icon, label, isActive = false }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className={`h-8 w-8 p-0 ${isActive ? 'bg-gray-200 text-black' : ''}`}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="border-b p-2 flex flex-wrap items-center gap-1 bg-white sticky top-0 z-10">
      <div className="flex items-center gap-1">
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          icon={Heading1}
          label="Heading 1"
          isActive={editor.isActive('heading', { level: 1 })}
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          icon={Heading2}
          label="Heading 2"
          isActive={editor.isActive('heading', { level: 2 })}
        />
      </div>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <div className="flex items-center gap-1">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={Bold}
          label="Bold"
          isActive={editor.isActive('bold')}
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={Italic}
          label="Italic"
          isActive={editor.isActive('italic')}
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          icon={Code}
          label="Code"
          isActive={editor.isActive('code')}
        />
      </div>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <div className="flex items-center gap-1">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={List}
          label="Bullet List"
          isActive={editor.isActive('bulletList')}
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={ListOrdered}
          label="Numbered List"
          isActive={editor.isActive('orderedList')}
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          icon={Quote}
          label="Quote"
          isActive={editor.isActive('blockquote')}
        />
      </div>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <div className="flex items-center gap-1">
        <MenuButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          icon={Minus}
          label="Horizontal Line"
        />
        <MenuButton
          onClick={() => {
            const url = window.prompt('Enter URL:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          icon={LinkIcon}
          label="Add Link"
          isActive={editor.isActive('link')}
        />
      </div>
      
      <div className="flex-1" />
      
      <div className="flex items-center gap-1">
        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          icon={Undo}
          label="Undo"
        />
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          icon={Redo}
          label="Redo"
        />
      </div>
    </div>
  );
};

export default function RichTextEditor({ content, onChange, editable = true }) {
  const [isPreview, setIsPreview] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable link in StarterKit to avoid duplicate
        link: false,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your document...',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
    ],
    content: content || '<p></p>',
    editable: editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });


  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg bg-white">
      <div className="flex items-center justify-between border-b bg-gray-50 px-4">
        <MenuBar editor={editor} />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="text-gray-600"
          >
            {isPreview ? (
              <>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </>
            )}
          </Button>
        </div>
      </div>
      
      {isPreview ? (
        <div className="p-6 prose max-w-none min-h-[400px] bg-white">
          <div dangerouslySetInnerHTML={{ __html: editor.getHTML() }} />
        </div>
      ) : (
        <EditorContent editor={editor} className="p-4 min-h-[400px] focus:outline-none" />
      )}
    </div>
  );
}