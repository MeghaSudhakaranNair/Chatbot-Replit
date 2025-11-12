import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface EmptyStateProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  "Explain quantum computing in simple terms",
  "Write a creative story about space exploration",
  "Help me plan a healthy weekly meal prep",
  "Suggest ideas for a team building activity",
];

export default function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div className="space-y-3">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold" data-testid="text-welcome-title">
            Welcome to AI Chat
          </h1>
          <p className="text-base text-muted-foreground" data-testid="text-welcome-subtitle">
            Start a conversation with your AI assistant. Ask anything!
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground font-medium">Try asking about:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.map((suggestion, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-4 py-3 text-sm font-normal cursor-pointer justify-start text-left hover-elevate active-elevate-2"
                onClick={() => onSuggestionClick(suggestion)}
                data-testid={`badge-suggestion-${index}`}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
