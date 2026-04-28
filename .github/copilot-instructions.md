# xTheatre Project Instructions

## Overview
Virtual IMAX Theatre Experience - A production-quality web application for immersive 3D theatre seat selection.

## Project Type
Full-stack React + Three.js + Node.js web application

## Key Technologies
- Frontend: React 18, Three.js, React Three Fiber, Vite, TypeScript, Tailwind CSS, GSAP
- Backend: Node.js, Express, Socket.IO (for real-time features)

## Development Setup

### Installation
```bash
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### Start Development
```bash
npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Build for Production
```bash
npm run build
```

## Project Structure
- `frontend/` - React + Three.js frontend application
- `backend/` - Node.js/Express API server  
- `package.json` - Monorepo root configuration

## Code Standards
- Use TypeScript strictly (`strict: true`)
- Keep components focused and reusable
- Store 3D logic in `components/3d/` folder
- Use Zustand for state management
- Follow production-grade patterns
- Add meaningful comments only

## Debugging
- Frontend dev server: http://localhost:3000
- Backend API: http://localhost:3001/api
- Check browser console for errors
- Backend logs in terminal

## Common Commands
```bash
npm run dev:frontend    # Frontend only
npm run dev:backend     # Backend only
npm run type-check      # TypeScript validation
npm run build:frontend  # Frontend production build
npm run build:backend   # Backend production build
```

## File Management
- **Layouts**: `frontend/src/data/layouts/`
- **Components**: `frontend/src/components/`
- **Types**: `frontend/src/types/`
- **Store**: `frontend/src/store/`
- **Styles**: `frontend/src/styles/`

## Performance Targets
- Maintain 60 FPS
- Initial load < 3s
- Smooth camera transitions
- Responsive UI interactions
