import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { generateWithAI } from '../../features/documents/documentSlice';
import { Loader2, Sparkles } from 'lucide-react';

export default function AIGenerationDialog({ open, onOpenChange, projectId, onSuccess }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'GDD',
    idea: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.idea.trim()) return;

    setLoading(true);
    try {
      await dispatch(generateWithAI({
        projectId,
        data: formData
      })).unwrap();
      
      onSuccess?.();
      setFormData({ type: 'GDD', idea: '' });
    } catch (error) {
      console.error('Failed to generate document:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Generate Document with AI
            </DialogTitle>
            <DialogDescription>
              Describe what you want, and AI will generate a structured document for you.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ai-type">Document Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GDD">🎮 Game Design Document</SelectItem>
                  <SelectItem value="Design Notes">📝 Design Notes</SelectItem>
                  <SelectItem value="Tech Notes">⚙️ Technical Specifications</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="idea">Describe your game idea</Label>
              <Textarea
                id="idea"
                placeholder="e.g., A puzzle-platformer where you manipulate time to solve challenges..."
                value={formData.idea}
                onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                rows={6}
                required
              />
              <p className="text-xs text-gray-500">
                Be specific about genre, mechanics, art style, and target audience
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-700 flex items-start gap-2">
                <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  AI will generate a complete document structure with sections, 
                  bullet points, and formatted content based on your description.
                </span>
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.idea.trim()}
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Document
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}