import EmptyState from "../EmptyState";

export default function EmptyStateExample() {
  const handleSuggestionClick = (suggestion: string) => {
    console.log("Suggestion clicked:", suggestion);
  };

  return (
    <div className="h-screen bg-background">
      <EmptyState onSuggestionClick={handleSuggestionClick} />
    </div>
  );
}
