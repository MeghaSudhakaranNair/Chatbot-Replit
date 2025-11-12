import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="flex gap-3 items-end max-w-4xl mx-auto">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="resize-none min-h-[48px] max-h-32 text-base rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 outline-none"
          disabled={disabled}
          data-testid="input-message"
          rows={1}
        />
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          className="min-w-[80px] min-h-[48px] rounded-xl"
          data-testid="button-send"
        >
          <Send className="w-4 h-4 mr-2" />
          Send
        </Button>
      </div>
    </form>
  );
}
