// Object fitting calculations and collision detection

// Check if object can fit through door and inside elevator
function checkObjectFit() {
    if (!objectToFit) {
        return {
            throughDoor: false,
            inElevator: false,
            doorClearance: 0,
            elevatorSpace: 0
        };
    }
    
    // Get dimensions in cm
    const elevatorHeight = parseFloat(document.getElementById('elevatorHeight').value);
    const elevatorWidth = parseFloat(document.getElementById('elevatorWidth').value);
    const elevatorLength = parseFloat(document.getElementById('elevatorLength').value);
    
    const doorHeight = parseFloat(document.getElementById('doorHeight').value);
    const doorWidth = parseFloat(document.getElementById('doorWidth').value);
    
    const objectHeight = parseFloat(document.getElementById('objectHeight').value);
    const objectWidth = parseFloat(document.getElementById('objectWidth').value);
    const objectLength = parseFloat(document.getElementById('objectLength').value);
    
    // Get current rotation
    const rotX = parseFloat(document.getElementById('rotationX').value) * Math.PI / 180;
    const rotY = parseFloat(document.getElementById('rotationY').value) * Math.PI / 180;
    const rotZ = parseFloat(document.getElementById('rotationZ').value) * Math.PI / 180;
    
    // Calculate the bounding box of the rotated object
    const rotatedDimensions = calculateRotatedBoundingBox(
        objectWidth, objectHeight, objectLength,
        rotX, rotY, rotZ
    );
    
    // Check door clearance
    const doorFit = checkDoorFit(rotatedDimensions, doorWidth, doorHeight);
    
    // Check elevator fit
    const elevatorFit = checkElevatorFit(rotatedDimensions, elevatorWidth, elevatorHeight, elevatorLength);
    
    return {
        throughDoor: doorFit.fits,
        inElevator: elevatorFit.fits,
        doorClearance: doorFit.clearance,
        elevatorSpace: elevatorFit.space,
        rotatedDimensions: rotatedDimensions
    };
}

// Calculate bounding box after rotation using the SAME method as the actual object
function calculateRotatedBoundingBox(width, height, length, rotX, rotY, rotZ) {
    // Use the SAME rotation method as in updateObjectTransform()
    // This ensures collision detection matches the visual object
    
    // Apply rotations in X, Y, Z order for proper intrinsic rotation (same as main.js)
    // Each subsequent rotation is around the object's current local axes
    const combinedQuaternion = new THREE.Quaternion();
    
    // X rotation (pitch) - around current local X axis
    if (rotX !== 0) {
        const qx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), rotX);
        combinedQuaternion.multiply(qx);
    }
    
    // Y rotation (yaw) - around current local Y axis
    if (rotY !== 0) {
        const localY = new THREE.Vector3(0, 1, 0).applyQuaternion(combinedQuaternion);
        const qy = new THREE.Quaternion().setFromAxisAngle(localY, rotY);
        combinedQuaternion.premultiply(qy);
    }
    
    // Z rotation (roll) - around current local Z axis
    if (rotZ !== 0) {
        const localZ = new THREE.Vector3(0, 0, 1).applyQuaternion(combinedQuaternion);
        const qz = new THREE.Quaternion().setFromAxisAngle(localZ, rotZ);
        combinedQuaternion.premultiply(qz);
    }
    
    // Create rotation matrix from the quaternion
    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationFromQuaternion(combinedQuaternion);
    
    // Original corners of the box
    const corners = [
        new THREE.Vector3(-width/2, -height/2, -length/2),
        new THREE.Vector3(width/2, -height/2, -length/2),
        new THREE.Vector3(-width/2, height/2, -length/2),
        new THREE.Vector3(width/2, height/2, -length/2),
        new THREE.Vector3(-width/2, -height/2, length/2),
        new THREE.Vector3(width/2, -height/2, length/2),
        new THREE.Vector3(-width/2, height/2, length/2),
        new THREE.Vector3(width/2, height/2, length/2)
    ];
    
    // Apply rotation to each corner
    const rotatedCorners = corners.map(corner => {
        return corner.applyMatrix4(rotationMatrix);
    });
    
    // Find bounding box of rotated corners
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    
    rotatedCorners.forEach(corner => {
        minX = Math.min(minX, corner.x);
        maxX = Math.max(maxX, corner.x);
        minY = Math.min(minY, corner.y);
        maxY = Math.max(maxY, corner.y);
        minZ = Math.min(minZ, corner.z);
        maxZ = Math.max(maxZ, corner.z);
    });
    
    return {
        width: Math.abs(maxX - minX),    // X dimension (door width)
        height: Math.abs(maxY - minY),  // Y dimension (door height)
        length: Math.abs(maxZ - minZ)   // Z dimension (elevator depth)
    };
}

// Check if object can pass through door
function checkDoorFit(rotatedDimensions, doorWidth, doorHeight) {
    // For door passage, we check if the object's X-Y cross-section fits through the door opening
    // The door is in the X-Y plane, so we check width (X) and height (Y) dimensions
    
    const objectWidth = rotatedDimensions.width;   // X dimension
    const objectHeight = rotatedDimensions.height; // Y dimension
    
    const widthFits = objectWidth <= doorWidth;
    const heightFits = objectHeight <= doorHeight;
    
    const fits = widthFits && heightFits;
    
    let clearance = 0;
    if (fits) {
        // Calculate individual clearances
        const widthClearance = doorWidth - objectWidth;
        const heightClearance = doorHeight - objectHeight;
        
        // Total clearance is the minimum (most constraining dimension)
        clearance = Math.min(widthClearance, heightClearance);
    } else {
        // If it doesn't fit, show how much it exceeds by (negative clearance)
        const widthOverage = objectWidth - doorWidth;
        const heightOverage = objectHeight - doorHeight;
        
        // Show the worst overage as negative clearance
        if (widthOverage > 0 || heightOverage > 0) {
            clearance = -Math.max(widthOverage, heightOverage);
        }
    }
    
    return { 
        fits, 
        clearance,
        widthFits,
        heightFits,
        objectWidth,
        objectHeight,
        widthClearance: doorWidth - objectWidth,
        heightClearance: doorHeight - objectHeight
    };
}

// Check if object fits inside elevator
function checkElevatorFit(rotatedDimensions, elevatorWidth, elevatorHeight, elevatorLength) {
    const widthFits = rotatedDimensions.width <= elevatorWidth;
    const heightFits = rotatedDimensions.height <= elevatorHeight;
    const lengthFits = rotatedDimensions.length <= elevatorLength;
    
    const fits = widthFits && heightFits && lengthFits;
    
    let space = 0;
    if (fits) {
        // Calculate space in each dimension
        const widthSpace = elevatorWidth - rotatedDimensions.width;
        const heightSpace = elevatorHeight - rotatedDimensions.height;
        const lengthSpace = elevatorLength - rotatedDimensions.length;
        
        // Available space is the minimum (most constraining dimension)
        space = Math.min(widthSpace, heightSpace, lengthSpace);
    } else {
        // If it doesn't fit, show how much it exceeds by (negative space)
        const widthOverage = rotatedDimensions.width - elevatorWidth;
        const heightOverage = rotatedDimensions.height - elevatorHeight;
        const lengthOverage = rotatedDimensions.length - elevatorLength;
        
        // Show the worst overage as negative space
        if (widthOverage > 0 || heightOverage > 0 || lengthOverage > 0) {
            space = -Math.max(widthOverage, heightOverage, lengthOverage);
        }
    }
    
    return { 
        fits, 
        space,
        widthFits,
        heightFits,
        lengthFits,
        objectWidth: rotatedDimensions.width,
        objectHeight: rotatedDimensions.height,
        objectLength: rotatedDimensions.length,
        widthSpace: elevatorWidth - rotatedDimensions.width,
        heightSpace: elevatorHeight - rotatedDimensions.height,
        lengthSpace: elevatorLength - rotatedDimensions.length
    };
}


// Export functions for global access
window.objectFitting = {
    checkObjectFit
};