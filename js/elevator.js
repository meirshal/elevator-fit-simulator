// Elevator-specific functions and utilities

// Create detailed elevator structure
function createDetailedElevator() {
    if (elevatorObject) {
        scene.remove(elevatorObject);
    }
    
    elevatorObject = new THREE.Group();
    
    // Get dimensions from inputs
    const height = parseFloat(document.getElementById('elevatorHeight').value) * SCALE_FACTOR;
    const width = parseFloat(document.getElementById('elevatorWidth').value) * SCALE_FACTOR;
    const length = parseFloat(document.getElementById('elevatorLength').value) * SCALE_FACTOR;
    
    // Create elevator components
    createElevatorWalls(width, height, length);
    createDoorFrame();
    createElevatorDetails(width, height, length);
    
    scene.add(elevatorObject);
}

// Create elevator walls with better materials
function createElevatorWalls(width, height, length) {
    // Wall material
    const wallMaterial = new THREE.MeshLambertMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
    });
    
    // Floor material
    const floorMaterial = new THREE.MeshLambertMaterial({
        color: 0x666666,
        transparent: true,
        opacity: 0.6
    });
    
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(width, length);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -height / 2;
    floor.receiveShadow = true;
    elevatorObject.add(floor);
    
    // Ceiling
    const ceiling = new THREE.Mesh(floorGeometry, wallMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = height / 2;
    elevatorObject.add(ceiling);
    
    // Back wall
    const backWallGeometry = new THREE.PlaneGeometry(width, height);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.z = -length / 2;
    elevatorObject.add(backWall);
    
    // Side walls
    const sideWallGeometry = new THREE.PlaneGeometry(length, height);
    const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.x = -width / 2;
    elevatorObject.add(leftWall);
    
    const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.x = width / 2;
    elevatorObject.add(rightWall);
    
    // Wireframe outline
    const wireframeGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(width, height, length));
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    elevatorObject.add(wireframe);
}

// Create detailed door frame
function createDoorFrame() {
    const doorHeight = parseFloat(document.getElementById('doorHeight').value) * SCALE_FACTOR;
    const doorWidth = parseFloat(document.getElementById('doorWidth').value) * SCALE_FACTOR;
    const elevatorHeight = parseFloat(document.getElementById('elevatorHeight').value) * SCALE_FACTOR;
    const elevatorLength = parseFloat(document.getElementById('elevatorLength').value) * SCALE_FACTOR;
    
    const doorFrameMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x8B4513 // Saddle brown
    });
    
    // Frame thickness
    const frameThickness = 0.08;
    const frameDepth = 0.05;
    
    // Calculate door position - door starts from floor level
    const floorLevel = -elevatorHeight / 2;  // Bottom of elevator
    const doorBottomY = floorLevel;          // Door starts at floor
    const doorCenterY = doorBottomY + doorHeight / 2;  // Center Y for door frame
    
    // Top frame (horizontal) - positioned at top of door opening
    const topFrameGeometry = new THREE.BoxGeometry(
        doorWidth + frameThickness * 2, 
        frameThickness, 
        frameDepth
    );
    const topFrame = new THREE.Mesh(topFrameGeometry, doorFrameMaterial);
    topFrame.position.set(0, doorBottomY + doorHeight + frameThickness / 2, elevatorLength / 2 + frameDepth / 2);
    topFrame.castShadow = true;
    elevatorObject.add(topFrame);
    
    // Side frames (vertical) - centered on door height from floor
    const sideFrameGeometry = new THREE.BoxGeometry(
        frameThickness, 
        doorHeight, 
        frameDepth
    );
    
    const leftFrame = new THREE.Mesh(sideFrameGeometry, doorFrameMaterial);
    leftFrame.position.set(-doorWidth / 2 - frameThickness / 2, doorCenterY, elevatorLength / 2 + frameDepth / 2);
    leftFrame.castShadow = true;
    elevatorObject.add(leftFrame);
    
    const rightFrame = new THREE.Mesh(sideFrameGeometry, doorFrameMaterial);
    rightFrame.position.set(doorWidth / 2 + frameThickness / 2, doorCenterY, elevatorLength / 2 + frameDepth / 2);
    rightFrame.castShadow = true;
    elevatorObject.add(rightFrame);
    
    // Bottom frame (threshold) - at floor level
    const bottomFrameGeometry = new THREE.BoxGeometry(
        doorWidth + frameThickness * 2, 
        frameThickness / 2, 
        frameDepth
    );
    const bottomFrame = new THREE.Mesh(bottomFrameGeometry, doorFrameMaterial);
    bottomFrame.position.set(0, floorLevel + frameThickness / 4, elevatorLength / 2 + frameDepth / 2);
    bottomFrame.castShadow = true;
    elevatorObject.add(bottomFrame);
    
    // Door opening visualization
    createDoorOpening(doorWidth, doorHeight, elevatorLength, doorCenterY);
}

// Create door opening visualization
function createDoorOpening(doorWidth, doorHeight, elevatorLength, doorCenterY) {
    // Create a subtle highlight around the door opening
    const doorOutlineMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6b6b,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    
    // Door opening plane positioned correctly at floor level
    const doorOpeningGeometry = new THREE.PlaneGeometry(doorWidth, doorHeight);
    const doorOpening = new THREE.Mesh(doorOpeningGeometry, doorOutlineMaterial);
    doorOpening.position.set(0, doorCenterY, elevatorLength / 2 + 0.01);
    elevatorObject.add(doorOpening);
    
    // Add door opening wireframe
    const doorWireframeGeometry = new THREE.EdgesGeometry(doorOpeningGeometry);
    const doorWireframeMaterial = new THREE.LineBasicMaterial({ 
        color: 0xff0000, 
        linewidth: 3 
    });
    const doorWireframe = new THREE.LineSegments(doorWireframeGeometry, doorWireframeMaterial);
    doorWireframe.position.set(0, doorCenterY, elevatorLength / 2 + 0.02);
    elevatorObject.add(doorWireframe);
}

// Add elevator details (buttons, rails, etc.)
function createElevatorDetails(width, height, length) {
    // Control panel
    createControlPanel(width, height, length);
    
    // Handrails
    createHandrails(width, height, length);
    
    // Floor indicators
    createFloorIndicators(width, height, length);
}

// Create control panel
function createControlPanel(width, height, length) {
    const panelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    
    // Main panel
    const panelGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.05);
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.set(width / 2 - 0.1, height / 4, length / 2 - 0.1);
    panel.castShadow = true;
    elevatorObject.add(panel);
    
    // Buttons
    const buttonMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    const buttonGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.01, 8);
    
    for (let i = 0; i < 6; i++) {
        const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
        button.rotation.x = Math.PI / 2;
        button.position.set(
            width / 2 - 0.1,
            height / 4 + 0.15 - (i % 3) * 0.06,
            length / 2 - 0.05 + Math.floor(i / 3) * 0.08
        );
        elevatorObject.add(button);
    }
}

// Create handrails
function createHandrails(width, height, length) {
    const railMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
    
    // Left rail
    const railGeometry = new THREE.CylinderGeometry(0.02, 0.02, length * 0.8, 8);
    const leftRail = new THREE.Mesh(railGeometry, railMaterial);
    leftRail.rotation.x = Math.PI / 2;
    leftRail.position.set(-width / 2 + 0.05, height / 3, 0);
    elevatorObject.add(leftRail);
    
    // Right rail
    const rightRail = new THREE.Mesh(railGeometry, railMaterial);
    rightRail.rotation.x = Math.PI / 2;
    rightRail.position.set(width / 2 - 0.05, height / 3, 0);
    elevatorObject.add(rightRail);
    
    // Back rail
    const backRailGeometry = new THREE.CylinderGeometry(0.02, 0.02, width * 0.8, 8);
    const backRail = new THREE.Mesh(backRailGeometry, railMaterial);
    backRail.rotation.z = Math.PI / 2;
    backRail.position.set(0, height / 3, -length / 2 + 0.05);
    elevatorObject.add(backRail);
}

// Create floor indicators
function createFloorIndicators(width, height, length) {
    // Digital display
    const displayMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    const displayGeometry = new THREE.PlaneGeometry(0.2, 0.1);
    const display = new THREE.Mesh(displayGeometry, displayMaterial);
    display.position.set(0, height / 2 - 0.3, length / 2 - 0.01);
    elevatorObject.add(display);
    
    // Display frame
    const frameMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const frameGeometry = new THREE.BoxGeometry(0.25, 0.15, 0.03);
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(0, height / 2 - 0.3, length / 2 - 0.005);
    elevatorObject.add(frame);
}

// Get elevator boundaries for collision detection
function getElevatorBoundaries() {
    const height = parseFloat(document.getElementById('elevatorHeight').value);
    const width = parseFloat(document.getElementById('elevatorWidth').value);
    const length = parseFloat(document.getElementById('elevatorLength').value);
    
    return {
        minX: -width / 2,
        maxX: width / 2,
        minY: -height / 2,
        maxY: height / 2,
        minZ: -length / 2,
        maxZ: length / 2
    };
}

// Get door boundaries
function getDoorBoundaries() {
    const doorHeight = parseFloat(document.getElementById('doorHeight').value);
    const doorWidth = parseFloat(document.getElementById('doorWidth').value);
    const elevatorLength = parseFloat(document.getElementById('elevatorLength').value);
    
    return {
        minX: -doorWidth / 2,
        maxX: doorWidth / 2,
        minY: -doorHeight / 2,
        maxY: doorHeight / 2,
        z: elevatorLength / 2 // Door is at the front of the elevator
    };
}

// Export functions for global access
window.elevatorModule = {
    createDetailedElevator,
    getElevatorBoundaries,
    getDoorBoundaries
};