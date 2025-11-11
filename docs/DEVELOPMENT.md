# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 5+
- Git

### Local Setup

1. **Clone and navigate to the project**
   ```powershell
   cd "d:\Niraj\SAC\SAC Helpdesk"
   ```

2. **Environment Configuration**
   ```powershell
   # Backend environment
   cd backend
   copy .env.example .env
   # Edit .env with your configuration
   
   # Frontend environment
   cd ../frontend
   copy .env.example .env
   # Edit .env with your configuration
   ```

3. **Install Dependencies**
   ```powershell
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

4. **Start Development Servers**
   
   **Option 1: VS Code Tasks (Recommended)**
   - Press `Ctrl+Shift+P` and search for "Tasks: Run Task"
   - Select "Start Full Stack Dev" to start both servers
   
   **Option 2: Manual**
   ```powershell
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## Available Scripts

### Backend (`/backend`)
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run test` - Run Jest tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Frontend (`/frontend`)
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run Vitest tests
- `npm run lint` - Run ESLint

## Project Structure

```
SAC Helpdesk/
├── backend/                # Node.js/Express API
│   ├── src/
│   │   ├── config/        # Database and app configuration
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── socket/       # Socket.io handlers
│   │   ├── types/        # TypeScript type definitions
│   │   ├── utils/        # Utility functions
│   │   └── server.ts     # Main server file
│   ├── dist/             # Compiled JavaScript (generated)
│   └── uploads/          # File uploads directory
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── store/        # State management
│   │   ├── styles/       # CSS/styling files
│   │   ├── types/        # TypeScript types
│   │   ├── utils/        # Utility functions
│   │   ├── App.tsx       # Main App component
│   │   └── main.tsx      # Application entry point
│   └── dist/             # Production build (generated)
├── shared/               # Shared types and utilities
├── docs/                 # Project documentation
└── database/             # Database scripts and migrations
```

## Development Workflow

### Creating New Features

1. **Backend API Endpoint**
   - Add route in `/backend/src/routes/`
   - Create controller in `/backend/src/controllers/`
   - Add model if needed in `/backend/src/models/`
   - Update types in `/shared/types.ts`

2. **Frontend Component**
   - Create component in `/frontend/src/components/`
   - Add service function in `/frontend/src/services/`
   - Create custom hooks if needed in `/frontend/src/hooks/`

3. **Testing**
   - Write unit tests for controllers and services
   - Test the complete user flow
   - Verify real-time features if applicable

### Code Style Guidelines

- Use TypeScript for type safety
- Follow ESLint configurations
- Use Prettier for code formatting
- Write meaningful commit messages
- Add JSDoc comments for complex functions

### Database Schema Changes

1. Update MongoDB models in `/backend/src/models/`
2. Create migration scripts in `/database/migrations/`
3. Update TypeScript types in `/shared/types.ts`
4. Update API documentation in `/docs/API.md`

## Debugging

### Backend Debugging
- Use VS Code debugger with Node.js configuration
- Check server logs in the terminal
- Use MongoDB Compass for database inspection

### Frontend Debugging
- Use React Developer Tools browser extension
- Use browser DevTools for network and console debugging
- Use React Query DevTools for API state inspection

## Environment Variables

### Backend (`.env`)
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/sac_helpdesk
JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:3000
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
VITE_APP_NAME=SAC Helpdesk Portal
```

## Common Issues

### Port Already in Use
```powershell
# Find process using port 3001
netstat -ano | findstr :3001
# Kill the process
taskkill /PID <process-id> /F
```

### MongoDB Connection Issues
- Ensure MongoDB service is running
- Check MongoDB connection string
- Verify network connectivity

### TypeScript Compilation Errors
- Run `npm run build` to see detailed errors
- Check for missing type definitions
- Ensure all imports are correct