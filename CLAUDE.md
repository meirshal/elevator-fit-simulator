# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the "Elevator Fit Checker" - a visual 3D web application that helps determine if objects can fit through elevator doors and inside elevator cabins. The application uses Three.js for 3D visualization and provides real-time feedback on dimensional compatibility for furniture delivery, moving large items, or similar scenarios.

## Development Commands

The project is a static HTML/CSS/JavaScript application with no build process:

- **Development server**: `npm run dev` or `python3 -m http.server 8000`
- **Preview server**: `npm run preview` or `python3 -m http.server 3000` 
- **Build**: `npm run build` (returns "Static site - no build required")
- **Deploy**: `npm run deploy` or `vercel --prod`

Access the application at `http://localhost:8000` when running the development server.

## Architecture

The application follows a modular JavaScript architecture with the following key files:

### Core Files
- `index.html` - Main application page with all UI controls and 3D canvas
- `css/styles.css` - Application styling and responsive design
- `libs/three.min.js` - Three.js library for 3D graphics

### JavaScript Modules (loaded in order)
1. `js/storage.js` - localStorage management for user settings persistence
2. `js/main.js` - Core 3D scene initialization, camera, lighting, and animation loop
3. `js/elevator.js` - Elevator model creation and detailed 3D components
4. `js/object.js` - Object fitting calculations and collision detection algorithms
5. `js/controls.js` - UI controls, input handling, and user interactions

### Key Architectural Patterns

**Module System**: Each JavaScript file exports functions via `window.moduleType` objects (e.g., `window.storageModule`, `window.objectFitting`, `window.controlsModule`)

**Coordinate System**: Uses centimeters as input units with a `SCALE_FACTOR = 0.01` to convert to Three.js units

**3D Object Management**: 
- Global variables `scene`, `camera`, `renderer`, `elevatorObject`, `objectToFit`
- Objects are recreated (not just updated) when dimensions change
- Intrinsic rotation system using quaternions for precise object orientation

**Collision Detection**: 
- Real-time bounding box calculations after rotation
- Separate checks for door passage (X-Y plane) vs elevator interior fit (X-Y-Z volume)
- Color-coded visual feedback (green=fits, orange=door only, red=doesn't fit)

## Key Development Concepts

**Rotation Mathematics**: The application uses Three.js quaternions with intrinsic rotations applied in X-Y-Z order, where each rotation is applied around the object's current local axes (not world axes). This provides intuitive rotation behavior. The collision detection in `object.js` must exactly match the rotation method in `main.js` to ensure visual accuracy.

**Real-time Updates**: All parameter changes trigger immediate 3D scene updates and collision detection recalculation.

**Data Persistence**: User inputs are automatically saved to localStorage with 500ms debouncing and restored on page load.

## Development Guidelines

- Maintain the modular structure - each JS file has specific responsibilities
- When modifying dimensions, always recreate the 3D objects rather than scaling
- Ensure rotation calculations in collision detection match the visual object rotations
- Test fit calculations with edge cases (objects exactly matching door/elevator sizes)
- The door is positioned at floor level (elevator bottom) extending upward
- All measurements are in centimeters in the UI but converted to Three.js units for rendering

## Deployment

The application is deployed on Vercel as a static site. The `vercel.json` configuration handles static file serving. No server-side processing is required - all calculations happen client-side in the browser.