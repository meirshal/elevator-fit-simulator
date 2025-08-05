# Elevator Fit Checker

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/elevator-fit-checker)
[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://elevator-fit-checker.vercel.app)

A visual 3D web application that helps you determine if objects can fit through elevator doors and inside elevator cabins. Perfect for furniture delivery, moving large items, or any situation where you need to verify dimensional compatibility.

## Features

- **3D Visualization**: Interactive 3D representation of elevator and objects
- **Real-time Feedback**: Instant visual and numerical feedback on fit status
- **Object Manipulation**: Position and rotate objects in 3D space
- **Multiple Input Controls**: Specify all dimensions in centimeters
- **Auto-Fit Function**: Automatically find the best rotation for fitting
- **Visual Color Coding**: Green (fits), Orange (partial fit), Red (doesn't fit)
- **Detailed Measurements**: See exact clearances and available space
- **Persistent Storage**: All inputs saved automatically and restored on next visit

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **One-Click Deploy**
   
   Click the deploy button above or use this link:
   ```
   https://vercel.com/new/clone?repository-url=https://github.com/yourusername/elevator-fit-checker
   ```

2. **Manual Deployment**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy the project
   cd elevator-fit-checker
   vercel --prod
   ```

3. **GitHub Integration**
   - Push your code to GitHub
   - Connect your GitHub repo to Vercel
   - Automatic deployments on every push

### Deploy to Other Platforms

The project is a static site and can be deployed to:
- **Netlify**: Drag and drop the folder
- **GitHub Pages**: Push to `gh-pages` branch
- **Firebase Hosting**: `firebase deploy`
- **Any static hosting service**

## 💻 Local Development

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/elevator-fit-checker
   cd elevator-fit-checker
   ```

2. **Run Locally**
   ```bash
   # Using Python 3 (recommended)
   npm run dev
   # OR
   python3 -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in Browser**
   - Local server: `http://localhost:8000`
   - Direct file: `file:///path/to/elevator-fit-checker/index.html`

## Usage Guide

### Input Controls

#### Elevator Dimensions
- **Height** (100-500 cm): Interior height of the elevator cabin
- **Width** (80-300 cm): Interior width of the elevator cabin  
- **Length** (100-400 cm): Interior depth of the elevator cabin

#### Door Dimensions
- **Height** (100-300 cm): Height of the elevator door opening
- **Width** (50-200 cm): Width of the elevator door opening

*Note: Door dimensions cannot exceed elevator dimensions*

#### Object Dimensions
- **Height** (1-500 cm): Height of the object to fit
- **Width** (1-300 cm): Width of the object to fit
- **Length** (1-400 cm): Length/depth of the object to fit

#### Object Position
- **X Position**: Move object left/right within elevator
- **Y Position**: Move object up/down within elevator
- **Z Position**: Move object forward/backward within elevator

#### Object Rotation
- **X Rotation** (0-360°): Pitch rotation around X-axis
- **Y Rotation** (0-360°): Yaw rotation around Y-axis  
- **Z Rotation** (0-360°): Roll rotation around Z-axis

### Control Buttons

- **Reset All**: Restore all values to defaults (and save them)
- **Center Object**: Move object to center position and reset rotation
- **Auto Rotate for Best Fit**: Automatically find the best rotation angle
- **Clear Saved Data**: Remove all stored settings and reset to defaults

### Visual Feedback

#### Color Coding
- **Green Object**: Object fits through door AND inside elevator ✓
- **Orange Object**: Object fits through door BUT too big for elevator ⚠️
- **Red Object**: Object cannot pass through door ✗

#### Status Panel
- **Fit Status**: Clear text indication of whether object fits
- **Door Clearance**: Minimum space when passing through door
- **Elevator Space**: Minimum remaining space inside elevator

### Camera Controls

- **Mouse Drag**: Rotate camera around the scene
- **Mouse Wheel**: Zoom in/out
- **View**: Examine the setup from different angles

### Keyboard Shortcuts

- **R**: Reset all values
- **C** or **Spacebar**: Center object
- **ESC**: Reset camera view

## How It Works

### Collision Detection Algorithm

The application uses advanced 3D mathematics to determine fit:

1. **Bounding Box Calculation**: Creates 3D bounding boxes for rotated objects
2. **Door Analysis**: Checks if object cross-section fits through door opening
3. **Elevator Analysis**: Verifies object fits within elevator interior dimensions
4. **Real-time Updates**: Recalculates on every parameter change

### Rotation Mathematics

- Uses Three.js rotation matrices for accurate 3D transformations
- Calculates axis-aligned bounding boxes after rotation
- Considers all possible orientations for optimal fit

## Data Persistence

### Local Storage
- **Automatic Saving**: All input values are saved automatically as you type (with 500ms debounce)
- **Session Persistence**: Settings are restored when you return to the application
- **Clear Option**: Use "Clear Saved Data" button to reset everything
- **Browser Storage**: Uses localStorage API (no server or account required)

### What Gets Saved
- Elevator dimensions (height, width, length)
- Door dimensions (height, width)
- Object dimensions (height, width, length)
- Object position (X, Y, Z coordinates)
- Object rotation (X, Y, Z angles)

*Note: Storage is per-browser and per-device. Clearing browser data will remove saved settings.*

## Technical Details

### Built With
- **HTML5**: Structure and semantic markup
- **CSS3**: Responsive styling and animations  
- **JavaScript (ES6)**: Application logic and interactivity
- **Three.js**: 3D graphics and WebGL rendering
- **LocalStorage API**: Client-side data persistence

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance
- Optimized for real-time interaction
- Efficient 3D rendering using WebGL
- Responsive design for desktop and mobile

## File Structure

```
elevator-fit-checker/
├── index.html              # Main application page
├── package.json            # Project metadata and scripts
├── vercel.json             # Vercel deployment configuration
├── .gitignore              # Git ignore rules
├── css/
│   └── styles.css          # Application styling
├── js/
│   ├── main.js             # Core application logic
│   ├── controls.js         # UI controls and input handling
│   ├── object.js           # Object manipulation and collision detection
│   ├── elevator.js         # Elevator model and utilities
│   └── storage.js          # localStorage management
├── libs/
│   └── three.min.js        # Three.js library
└── README.md               # This file
```

## Example Use Cases

### Furniture Delivery
- **Sofa**: Check if a 180cm × 80cm × 90cm sofa fits
- **Refrigerator**: Verify a 170cm × 60cm × 65cm fridge can be delivered
- **Wardrobe**: Test a 200cm × 100cm × 50cm wardrobe

### Moving Equipment
- **Piano**: Determine best angle for upright piano delivery
- **Exercise Equipment**: Check treadmill or gym equipment fit
- **Appliances**: Verify washing machines, dryers fit through doors

### Commercial Delivery
- **Office Furniture**: Desks, filing cabinets, conference tables
- **Medical Equipment**: Hospital beds, imaging equipment
- **Industrial Parts**: Machinery components, tools

## Troubleshooting

### Common Issues

**Problem**: 3D scene not loading
- **Solution**: Ensure JavaScript is enabled and use a modern browser

**Problem**: Controls not responding  
- **Solution**: Check browser console for errors, refresh page

**Problem**: Inaccurate measurements
- **Solution**: Verify all dimensions are entered correctly in centimeters

**Problem**: Settings not saving
- **Solution**: Ensure localStorage is enabled in browser settings

**Problem**: Want to start fresh
- **Solution**: Use "Clear Saved Data" button or clear browser data

### Tips for Accurate Results

1. **Measure Carefully**: Use accurate measurements for all dimensions
2. **Account for Handles**: Include door handles, knobs in object dimensions
3. **Consider Clearance**: Leave extra space for safe maneuvering
4. **Test Rotations**: Try different angles manually after auto-fit
5. **Real-world Factors**: Consider elevator door mechanisms, ceiling fixtures

## Contributing

This is an open-source project. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues or questions:
- Check browser developer console for error messages
- Verify input values are reasonable
- Try refreshing the page
- Ensure stable internet connection for Three.js library

## License

This project is open-source and available under the MIT License.

## Changelog

### Version 1.0
- Initial release
- 3D visualization
- Real-time collision detection
- Auto-fit functionality
- Responsive design
- Comprehensive controls

---

**Made with ❤️ for practical problem-solving**

*Last updated: 2025*