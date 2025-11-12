# AI Chatbot Application

## Overview

This is an AI-powered chatbot application built with React and Express that allows users to have conversations with Google's Gemini AI. The application features a clean, minimalist interface inspired by Linear and ChatGPT design patterns, emphasizing readability and distraction-free interaction. Users can send messages and receive AI-generated responses in real-time, with conversation history maintained throughout the session.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**UI Component Library**: shadcn/ui components built on Radix UI primitives, providing a comprehensive set of accessible, customizable components following the "new-york" style preset.

**Styling Approach**: Tailwind CSS with CSS variables for theming, supporting both light and dark modes. The design system uses a carefully defined spacing scale (2, 3, 4, 6, 8, 12, 16 units) and custom color tokens for consistent styling across the application.

**State Management**: React Query (TanStack Query) for server state management and caching, with local component state using React hooks for UI interactions.

**Routing**: Wouter for lightweight client-side routing.

**Design System**: Custom typography using Inter font, with specific treatments for message bubbles (rounded-2xl with directional tails), consistent spacing patterns, and a color system built on HSL values with alpha channel support.

**Key Design Decisions**:
- Messages limited to 80% max-width for optimal readability
- User messages aligned right with primary color background
- AI messages aligned left with card background and border
- Auto-scroll behavior on new messages for seamless conversation flow
- Responsive design with mobile-specific padding adjustments

### Backend Architecture

**Runtime**: Node.js with Express.js framework.

**Language**: TypeScript with ES modules enabled.

**API Structure**: RESTful API with a single `/api/chat` POST endpoint that accepts user messages and returns AI-generated responses.

**Request Handling**: 
- JSON body parsing with raw body verification capability
- Request/response logging middleware for API routes
- Error handling with appropriate HTTP status codes

**Build Process**: 
- Client: Vite builds React app to `dist/public`
- Server: esbuild bundles server code to `dist/index.js` with external packages
- Development mode uses Vite middleware for hot module replacement

### Data Storage

**Development Storage**: In-memory storage implementation (`MemStorage`) using Maps and Arrays for rapid prototyping and testing without database dependencies.

**Schema Design**: 
- Users table with ID, username, and password fields
- Messages table with ID, text content, user/AI flag, and timestamp
- UUID generation for unique identifiers

**Database Integration**: Drizzle ORM configured for PostgreSQL with Neon serverless driver, though currently using in-memory storage. The schema is defined and ready for database migration when needed.

**Session Management**: PostgreSQL session store (`connect-pg-simple`) configured for production-ready session persistence.

**Rationale**: In-memory storage allows for quick development and testing without database setup overhead. The application is architected to easily swap to PostgreSQL persistence by replacing the storage implementation while maintaining the same interface.

### External Dependencies

**AI Service**: Google Gemini AI (gemini-2.0-flash-exp model) via `@google/genai` SDK.
- Conversation context maintained by passing last 10 messages as history
- Requires `GEMINI_API_KEY` environment variable
- Role-based message format (user/model) for proper context handling

**Database**: 
- Neon serverless PostgreSQL via `@neondatabase/serverless` driver
- Connection configured through `DATABASE_URL` environment variable
- Drizzle ORM for type-safe database queries and migrations

**UI Components**: Extensive use of Radix UI primitives for accessible, unstyled components that are then styled with Tailwind CSS.

**Typography**: Google Fonts (Inter) loaded from CDN for consistent cross-platform rendering.

**Development Tools**:
- Replit-specific plugins for runtime error overlay, cartographer navigation, and dev banner
- TypeScript for static type checking across the entire codebase
- PostCSS with Tailwind CSS and Autoprefixer for CSS processing

**Authentication**: While user schema exists with username/password fields, no authentication is currently implemented. This suggests future authentication features are planned but not yet active.