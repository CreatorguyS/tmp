# HealthSpectrum Medical Document Analysis Platform

## Overview

HealthSpectrum is an AI-powered medical document analysis platform that transforms complex medical documents into clear, actionable health insights. The application allows users to upload prescriptions, lab results, and medical reports to receive instant AI analysis, risk assessments, and personalized health recommendations. The platform emphasizes accessibility, making medical information understandable for patients while maintaining HIPAA compliance and security standards.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### September 2025 - Fresh GitHub Import Setup Complete ✅
- Successfully imported GitHub repository and configured for Replit environment
- Installed Node.js 20 and all frontend/backend dependencies  
- Fixed Vite configuration to work with Replit proxy (host: 0.0.0.0, port: 5000)
- Resolved HMR (Hot Module Replacement) connection issues for stable development
- Set up CORS configuration for development environment
- Configured workflows for both frontend (port 5000) and backend (port 3001)
- Backend runs on port 3001 with graceful MongoDB connection handling
- Application now fully functional in Replit development environment
- Deployment configuration completed for autoscale production builds
- Environment variables configured for JWT authentication and API communication
- Both frontend and backend applications tested and confirmed working
- PostgreSQL database available but project configured for MongoDB (backend handles gracefully)

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with a custom medical dark theme featuring professional blue and health green color schemes
- **Animations**: Framer Motion for smooth page transitions and interactive animations
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: React Router for client-side navigation with dedicated routes for authentication, upload, and analysis

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM for document storage and user data management
- **Authentication**: Cookie-based authentication with bcrypt for password hashing
- **Security**: Helmet.js for security headers, CORS configured for cross-origin requests
- **File Storage**: Cloudinary integration for secure medical document storage and processing

### Component Structure
- **Modular Design**: Reusable UI components in `/components/ui/` following atomic design principles
- **Page Components**: Dedicated pages for landing, upload, authentication, and results
- **Section Components**: Organized sections for hero, features, upload flow, and processing steps
- **Authentication Flow**: Separate layout for sign-in/sign-up with social login integration

### Styling Architecture
- **Design System**: Custom CSS variables for consistent theming across light/dark modes
- **Medical Theme**: Professional color palette with primary blues, accent greens, and warning/error states
- **Responsive Design**: Mobile-first approach with breakpoints for tablet and desktop
- **Animation System**: Custom keyframes for floating elements, cosmic backgrounds, and loading states

### Development Architecture
- **TypeScript Configuration**: Strict typing disabled for rapid development with path aliases for clean imports
- **Build Pipeline**: Separate development and production builds with environment-specific configurations
- **Code Quality**: ESLint with React hooks plugin and TypeScript support, Prettier for code formatting

## External Dependencies

### Frontend Dependencies
- **UI Components**: @radix-ui/* suite for accessible component primitives
- **Form Handling**: React Hook Form with @hookform/resolvers for validation
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation and react-day-picker for calendar components
- **Carousel**: Embla Carousel React for image/document galleries
- **Animations**: Framer Motion for complex animations and transitions
- **Theming**: next-themes for dark/light mode switching
- **Utilities**: class-variance-authority and clsx for conditional styling

### Backend Dependencies
- **Database**: MongoDB Atlas or local MongoDB instance
- **File Upload**: Cloudinary for medical document storage and image processing
- **Security**: bcrypt for password hashing, helmet for security headers
- **Development**: nodemon for hot reloading during development

### Development Tools
- **Package Management**: npm with lock files for dependency consistency
- **Build Tools**: Vite with React SWC plugin for fast compilation
- **Code Quality**: ESLint, Prettier, and TypeScript for code quality and consistency
- **Development Server**: Vite dev server with HMR on port 5000, Express server on port 3001

### Third-Party Integrations
- **Cloud Storage**: Cloudinary for secure medical document storage with HIPAA compliance
- **Database**: MongoDB for user accounts, document metadata, and analysis results
- **Authentication**: Planned integration with Google and GitHub OAuth providers
- **AI Processing**: Placeholder for medical AI analysis service integration

### Security Considerations
- **CORS**: Configured for development with plans for production whitelist
- **Headers**: Helmet.js for security headers including CSP and HSTS
- **Data Protection**: Cookie-based sessions with secure flags for production
- **File Validation**: Client-side and planned server-side validation for medical document uploads