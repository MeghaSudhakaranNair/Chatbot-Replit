# AI Chatbot Design Guidelines

## Design Approach
**Selected System:** Linear-inspired minimalist approach combined with ChatGPT's conversation patterns
**Rationale:** Chat applications prioritize clarity, readability, and distraction-free interaction. Linear's clean typography and ChatGPT's proven message layout patterns ensure optimal conversation flow.

## Typography System
- **Primary Font:** Inter or DM Sans (Google Fonts)
- **Message Text:** text-base (16px) for optimal readability
- **User Messages:** font-medium for distinction
- **AI Messages:** font-normal for softer appearance
- **Input Field:** text-base
- **Timestamps:** text-xs, opacity-60
- **Header/Title:** text-xl font-semibold

## Spacing System
**Tailwind Units:** Consistently use 2, 3, 4, 6, 8, 12, 16 units
- Message bubbles: p-4 internal padding
- Message spacing: space-y-4 between messages
- Chat container padding: p-6 on desktop, p-4 on mobile
- Input area padding: p-4
- Overall container margins: mx-auto with max-w-4xl

## Layout Structure

### Main Container
- Full viewport height (h-screen)
- Flexbox column layout (flex flex-col)
- Max width: max-w-4xl centered with mx-auto
- Prevent overflow with proper scrolling

### Header Section
- Fixed height: h-16
- Contains app title and optional menu/settings icon
- Border bottom for visual separation
- Flex layout with items-center justify-between
- px-6 horizontal padding

### Chat Messages Area
- Flex-1 to fill available space
- Overflow-y-auto for scrolling
- p-6 padding on desktop, p-4 mobile
- Messages aligned: user messages to right (ml-auto, max-w-[80%]), AI messages to left (mr-auto, max-w-[80%])
- Auto-scroll to bottom on new messages

### Message Bubbles
- Rounded-2xl for modern feel
- User messages: Distinct treatment with rounded-br-sm (tail effect on bottom-right)
- AI messages: Different treatment with rounded-bl-sm (tail effect on bottom-left)
- Shadow: shadow-sm for subtle depth
- Minimum touch target: min-h-[44px]

### Input Area
- Fixed at bottom
- Border top for separation
- p-4 padding
- Flex layout with gap-3
- Input field: flex-1, rounded-xl, px-4, py-3, min-h-[48px]
- Send button: rounded-xl, px-6, min-w-[80px], min-h-[48px]

### Typing Indicator
- Animated dots (3 circles)
- Display in AI message bubble format
- w-2 h-2 rounded-full for each dot
- Animate with subtle pulse using CSS

## Component Library

### Chat Message Component
- Wrapper: flex items-end gap-2
- Avatar (optional): w-8 h-8 rounded-full on AI side only
- Bubble container with text and timestamp
- Timestamp below bubble: text-xs with reduced opacity

### Empty State
- Centered vertically and horizontally
- Welcome message: text-2xl font-semibold
- Subtitle with suggestions: text-base opacity-70
- Suggestion chips: rounded-full, px-4, py-2, clickable
- Display: grid grid-cols-1 md:grid-cols-2 gap-3 for suggestions

### Loading State
- Show typing indicator immediately when user sends message
- Disable input during loading
- Optional: Pulse animation on send button when processing

### Error Message
- Inline in chat as system message
- Centered with distinct styling
- Retry button if applicable

## Responsive Behavior
- Mobile (< 768px): 
  - Full width chat area
  - Single column message display
  - Reduce padding to p-4
  - Stack header elements if needed
  
- Desktop (≥ 768px):
  - Centered layout with max-w-4xl
  - Generous padding p-6
  - Wider message bubbles max-w-[80%]

## Interaction Patterns
- Click send button or press Enter to send
- Auto-focus input after sending message
- Smooth scroll animation to newest message
- Send button shows loading spinner during API call
- Input clears immediately after sending
- Prevent double-submission with disabled state

## Accessibility
- Semantic HTML: <main>, <header>, <form>
- ARIA labels on input: "Type your message"
- ARIA labels on send button: "Send message"
- ARIA-live region for new messages
- Focus management: return focus to input after sending
- Keyboard navigation: Tab through interactive elements
- Minimum 44px touch targets for mobile

## Images
**No hero image needed** - This is a functional chat interface where content begins immediately. Focus on clean, unobstructed conversation area.