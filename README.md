# Virtual IMAX Theatre Experience

A production-quality web application providing an immersive, interactive 3D theatre seat selection experience with real-time multi-user support.

## 🎬 Features (Phase 1 - Complete)

### Core 3D Experience
- ✅ Realistic curved IMAX screen using Three.js
- ✅ Stadium-style seating with proper elevation
- ✅ Interactive seat selection with visual feedback
- ✅ Smooth camera transitions using GSAP
- ✅ Seat hovering and highlighting
- ✅ Proper lighting and shadows

### Seat Management
- ✅ JSON-based theatre layout system
- ✅ Real-time seat status tracking (available/selected/booked/locked)
- ✅ Color-coded seat states
- ✅ Seat information display (row, number, price, position)
- ✅ Dynamic pricing based on seat section

### UI/UX
- ✅ Responsive layout with sidebar
- ✅ Clean, minimal design with theatre theme colors
- ✅ Real-time seat info panel
- ✅ Theatre controls and information display
- ✅ Header with selection feedback

## 🚀 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool (lightning-fast HMR)
- **Three.js** - 3D graphics
- **React Three Fiber** - React renderer for Three.js
- **GSAP** - Smooth animations
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

### Backend
- **Node.js** - Runtime
- **Express** - HTTP server
- **Socket.IO** - Real-time communication (ready for Phase 5)
- **TypeScript** - Type safety

## 📁 Project Structure

```
xTheatre/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/
│   │   │   │   ├── Scene.tsx          # Main 3D canvas
│   │   │   │   ├── Screen.tsx         # Curved IMAX screen
│   │   │   │   ├── Seat.tsx           # Individual seat component
│   │   │   │   ├── SeatGrid.tsx       # All seats rendering
│   │   │   │   └── CameraController.tsx # Camera transitions
│   │   │   ├── SeatInfo.tsx           # Seat details panel
│   │   │   └── App.tsx                # Main app component
│   │   ├── store/
│   │   │   └── theatre.ts             # Zustand store
│   │   ├── types/
│   │   │   └── theatre.ts             # TypeScript interfaces
│   │   ├── data/
│   │   │   └── layouts/
│   │   │       └── imax-standard.json # Default theatre layout
│   │   ├── styles/
│   │   │   └── globals.css            # Global styles
│   │   ├── main.tsx                   # Entry point
│   │   └── App.tsx                    # Root component
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── index.ts                   # Server entry point
│   │   └── data/
│   │       └── layouts/
│   │           └── imax-standard.json
│   ├── tsconfig.json
│   └── package.json
├── package.json                        # Root workspace config
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

1. **Install dependencies**
```bash
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

2. **Start development servers**
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Individual Commands

```bash
# Frontend only
npm run dev:frontend    # Start Vite dev server
npm run build:frontend  # Build for production

# Backend only
npm run dev:backend     # Start Express server
npm run build:backend   # Build TypeScript

# Type checking
npm run type-check      # Check TS types for both
```

## 🎮 Usage

### Selecting Seats
1. Click on any **green** seat to select it
2. Camera smoothly transitions to the seat viewpoint
3. Selected seat turns **yellow**
4. Seat details appear in the right panel

### Seat States
- 🟢 **Green** - Available seat
- 🟡 **Yellow** - Currently selected
- 🔴 **Red** - Booked (locked)
- ⚫ **Gray** - Locked by another user

### Controls
- **Mouse**: Orbit around the scene
- **Click**: Select a seat
- **Hover**: Preview seat
- **Clear Selection**: Deselect current seat

## 📊 Theatre Layout

Default layout: **3 rows × 5 seats**
- **Row A**: Standard (front)
- **Row B**: Mixed premium (center) + standard
- **Row C**: All premium (best view)

Pricing tiers:
- Front row: ₹200
- Middle row: ₹250 (standard) / ₹350 (premium)
- Back row: ₹300 (standard) / ₹400 (premium center)

## 🎯 Upcoming Phases

### Phase 2: Advanced Layout System
- Support multiple theatre layouts
- Create layout editor UI
- Import/export custom layouts

### Phase 3: Video & Audio
- IMAX trailer playback
- Video texture on screen
- Spatial Web Audio API
- Position-based audio simulation

### Phase 4: Pricing Engine
- Dynamic pricing algorithm
- Best value recommendations
- Section-based pricing
- Real-time price updates

### Phase 5: Real-time Multi-User
- Socket.IO integration
- Live user indicators
- Concurrent seat locking
- Broadcast booking events

### Phase 6: Backend & Booking
- MongoDB/PostgreSQL database
- User authentication
- Payment integration
- Booking history

## 🔧 Configuration

### Tailwind Theme
Edit `frontend/tailwind.config.ts` to customize theatre colors:
```typescript
'theatre-dark': '#0a0e27'   // Background
'theatre-gold': '#c4a747'   // Accent
'theatre-red': '#dc143c'    // Errors/alerts
```

### Theatre Layout
Edit `frontend/src/data/layouts/imax-standard.json` to adjust:
- Screen position and size
- Seat positions and pricing
- Row elevation and sections
- Curvature of screen

## 🚀 Performance Optimization

- ✅ WebGL instancing ready (Phase 2+)
- ✅ Lazy loading assets
- ✅ Optimized textures
- ✅ Proper Three.js cleanup
- ✅ 60 FPS target maintained
- ✅ Memoized components where needed

## 🐛 Known Limitations

- Phase 1 is local-only (no backend integration yet)
- Single layout support
- No audio/video playback yet
- Limited mobile optimization

## 📝 Development Notes

### Code Quality
- Written with production standards
- Proper TypeScript typing
- Clear component separation
- Reusable utilities and hooks
- Minimal but meaningful comments

### Architecture Decisions
- **Zustand** for simple, fast state management
- **React Three Fiber** for better React integration
- **GSAP** for smooth, performant animations
- **Tailwind CSS** for utility-first styling

## 🤝 Contributing

Follow these patterns:
1. Keep components focused and reusable
2. Use TypeScript strictly
3. Add components to appropriate folders
4. Update types in `theatre.ts` when needed
5. Keep 3D logic in `components/3d/` folder

## 📄 License

MIT - Open for educational and commercial use

---

**Built with ❤️ for immersive theatre experiences**
