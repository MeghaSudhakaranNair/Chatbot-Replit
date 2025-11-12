import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

export default function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  return (
    <div
      className={`flex items-end gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      data-testid={`message-${isUser ? "user" : "ai"}`}
    >
      {!isUser && (
        <Avatar className="w-8 h-8" data-testid="avatar-ai">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[80%]`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-card text-card-foreground border border-card-border rounded-bl-sm"
          }`}
          data-testid="text-message-content"
        >
          <p className={`text-base ${isUser ? "font-medium" : "font-normal"} whitespace-pre-wrap`}>
            {message}
          </p>
        </div>
        {timestamp && (
          <span className="text-xs opacity-60 mt-1 px-1" data-testid="text-timestamp">
            {timestamp}
          </span>
        )}
      </div>

      {isUser && (
        <Avatar className="w-8 h-8" data-testid="avatar-user">
          <AvatarFallback className="bg-muted text-muted-foreground">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
