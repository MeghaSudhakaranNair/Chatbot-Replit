import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-3" data-testid="indicator-typing">
      <Avatar className="w-8 h-8">
        <AvatarFallback className="bg-primary text-primary-foreground">
          <Bot className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col items-start">
        <div className="px-4 py-3 rounded-2xl bg-card border border-card-border rounded-bl-sm">
          <div className="flex gap-1.5 items-center">
            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "200ms" }} />
            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "400ms" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
