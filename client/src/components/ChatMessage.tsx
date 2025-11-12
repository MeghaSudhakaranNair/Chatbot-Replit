import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

const renderMarkdown = (text: string) => {
  // Bold: **text** -> <strong>text</strong>
  let html = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Italic: *text* or _text_ -> <em>text</em>
  html = html.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
  html = html.replace(/(?<!\_)\_(?!\_)(.*?)(?<!\_)\_(?!\_)/g, "<em>$1</em>");
  // Newlines: \n -> <br />
  html = html.replace(/\n/g, "<br />");

  return { __html: html };
};

export default function ChatMessage({
  message,
  isUser,
  timestamp,
}: ChatMessageProps) {
  return (
    <div
      className={`flex items-end gap-3 mb-4 ${
        isUser ? "flex-row-reverse ml-auto" : "flex-row"
      }max-w-full`}
      data-testid={`message-${isUser ? "user" : "ai"}`}
    >
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        {!isUser && (
          <Avatar className="w-8 h-8 m-2" data-testid="avatar-ai">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bot className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        )}
        {isUser && (
          <Avatar className="w-8 h-8 m-2" data-testid="avatar-user">
            <AvatarFallback className="bg-muted text-muted-foreground">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        )}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-primary text-primary-foreground "
              : "bg-card text-card-foreground border border-card-border "
          }`}
          data-testid="text-message-content"
        >
          <div
            className={`text-base ${
              isUser ? "font-medium" : "font-normal"
            } whitespace-pre-wrap`}
            dangerouslySetInnerHTML={renderMarkdown(message)}
          />
        </div>
        {timestamp && (
          <span
            className="text-xs opacity-60 mt-1 px-1"
            data-testid="text-timestamp"
          >
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
}
