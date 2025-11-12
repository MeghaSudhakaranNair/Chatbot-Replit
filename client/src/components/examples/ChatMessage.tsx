import ChatMessage from "../ChatMessage";

export default function ChatMessageExample() {
  return (
    <div className="space-y-4 p-6 bg-background">
      <ChatMessage
        message="Hello! Can you help me with a question?"
        isUser={true}
        timestamp="2:30 PM"
      />
      <ChatMessage
        message="Of course! I'd be happy to help. What would you like to know?"
        isUser={false}
        timestamp="2:30 PM"
      />
    </div>
  );
}
