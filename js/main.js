// Global variables
let scene, camera, renderer, controls;
let elevator, elevatorObject, objectToFit;
let animationId;

// Scene dimensions (using cm as units)
const SCALE_FACTOR = 0.01; // Convert cm to Three.js units

// Initialize the application
function init() {
    initScene();
    initLighting();
    initCamera();
    initRenderer();
    initControls();
    
    // Initialize storage system (must be done before creating objects)
    if (window.storageModule) {
        window.storageModule.initStorage();
    }
    
    // Create initial objects (will use stored values)
    createElevator();
    createObject();
    
    // Start animation loop
    animate();
    
    console.log('Elevator Fit Checker initialized successfully');
}

// Initialize Three.js scene
function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    // Add axes helper
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);
}

// Initialize lighting
function initLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Additional light for better visibility
    const light2 = new THREE.DirectionalLight(0xffffff, 0.4);
    light2.position.set(-5, 5, -5);
    scene.add(light2);
}

// Initialize camera
function initCamera() {
    const canvas = document.getElementById('threejs-canvas');
    camera = new THREE.PerspectiveCamera(
        75, 
        canvas.offsetWidth / canvas.offsetHeight, 
        0.1, 
        1000
    );
    camera.position.set(5, 3, 5);
    camera.lookAt(0, 0, 0);
}

// Initialize renderer
function initRenderer() {
    const canvas = document.getElementById('threejs-canvas');
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true,
        alpha: true
    });
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

// Initialize orbit controls
function initControls() {
    // Note: OrbitControls need to be loaded separately or implement basic mouse controls
    // For now, we'll implement basic mouse controls
    const canvas = document.getElementById('threejs-canvas');
    let isMouseDown = false;
    let mouseX = 0, mouseY = 0;
    
    canvas.addEventListener('mousedown', (event) => {
        isMouseDown = true;
        mouseX = event.clientX;
        mouseY = event.clientY;
    });
    
    canvas.addEventListener('mouseup', () => {
        isMouseDown = false;
    });
    
    canvas.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
            const deltaX = event.clientX - mouseX;
            const deltaY = event.clientY - mouseY;
            
            // Rotate camera around scene
            const spherical = new THREE.Spherical();
            spherical.setFromVector3(camera.position);
            spherical.theta -= deltaX * 0.01;
            spherical.phi += deltaY * 0.01;
            spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
            
            camera.position.setFromSpherical(spherical);
            camera.lookAt(0, 0, 0);
            
            mouseX = event.clientX;
            mouseY = event.clientY;
        }
    });
    
    canvas.addEventListener('wheel', (event) => {
        const distance = camera.position.length();
        const newDistance = distance * (1 + event.deltaY * 0.001);
        camera.position.normalize().multiplyScalar(Math.max(2, Math.min(20, newDistance)));
        event.preventDefault();
    });
}

// Create elevator model
function createElevator() {
    if (elevatorObject) {
        scene.remove(elevatorObject);
    }
    
    elevatorObject = new THREE.Group();
    
    // Get dimensions from inputs
    const height = parseFloat(document.getElementById('elevatorHeight').value) * SCALE_FACTOR;
    const width = parseFloat(document.getElementById('elevatorWidth').value) * SCALE_FACTOR;
    const length = parseFloat(document.getElementById('elevatorLength').value) * SCALE_FACTOR;
    
    // Create elevator walls (transparent)
    const wallMaterial = new THREE.MeshLambertMaterial({
        color: 0x808080,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(width, length);
    const floor = new THREE.Mesh(floorGeometry, wallMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -height / 2;
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
    
    // Create door frame
    createDoorFrame();
    
    // Wireframe outline for better visibility
    const wireframeGeometry = new THREE.BoxGeometry(width, height, length);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x333333,
        wireframe: true
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    elevatorObject.add(wireframe);
    
    scene.add(elevatorObject);
}

// Create door frame
function createDoorFrame() {
    const doorHeight = parseFloat(document.getElementById('doorHeight').value) * SCALE_FACTOR;
    const doorWidth = parseFloat(document.getElementById('doorWidth').value) * SCALE_FACTOR;
    const elevatorLength = parseFloat(document.getElementById('elevatorLength').value) * SCALE_FACTOR;
    
    const doorFrameMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
    
    // Door frame thickness
    const frameThickness = 0.05;
    
    // Top frame
    const topFrameGeometry = new THREE.BoxGeometry(doorWidth + frameThickness * 2, frameThickness, frameThickness);
    const topFrame = new THREE.Mesh(topFrameGeometry, doorFrameMaterial);
    topFrame.position.set(0, doorHeight / 2 + frameThickness / 2, elevatorLength / 2);
    elevatorObject.add(topFrame);
    
    // Side frames
    const sideFrameGeometry = new THREE.BoxGeometry(frameThickness, doorHeight, frameThickness);
    const leftFrame = new THREE.Mesh(sideFrameGeometry, doorFrameMaterial);
    leftFrame.position.set(-doorWidth / 2 - frameThickness / 2, 0, elevatorLength / 2);
    elevatorObject.add(leftFrame);
    
    const rightFrame = new THREE.Mesh(sideFrameGeometry, doorFrameMaterial);
    rightFrame.position.set(doorWidth / 2 + frameThickness / 2, 0, elevatorLength / 2);
    elevatorObject.add(rightFrame);
}

// Create object to fit
function createObject() {
    if (objectToFit) {
        scene.remove(objectToFit);
    }
    
    const height = parseFloat(document.getElementById('objectHeight').value) * SCALE_FACTOR;
    const width = parseFloat(document.getElementById('objectWidth').value) * SCALE_FACTOR;
    const length = parseFloat(document.getElementById('objectLength').value) * SCALE_FACTOR;
    
    const geometry = new THREE.BoxGeometry(width, height, length);
    const material = new THREE.MeshLambertMaterial({ 
        color: 0x3498db,
        transparent: true,
        opacity: 0.8
    });
    
    objectToFit = new THREE.Mesh(geometry, material);
    
    // Add wireframe
    const wireframeGeometry = geometry.clone();
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x2c3e50,
        wireframe: true
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    objectToFit.add(wireframe);
    
    scene.add(objectToFit);
    
    updateObjectTransform();
}

// Update object position and rotation
function updateObjectTransform() {
    if (!objectToFit) return;
    
    const x = parseFloat(document.getElementById('objectX').value) * SCALE_FACTOR;
    const y = parseFloat(document.getElementById('objectY').value) * SCALE_FACTOR;
    const z = parseFloat(document.getElementById('objectZ').value) * SCALE_FACTOR;
    
    const rotX = parseFloat(document.getElementById('rotationX').value) * Math.PI / 180;
    const rotY = parseFloat(document.getElementById('rotationY').value) * Math.PI / 180;
    const rotZ = parseFloat(document.getElementById('rotationZ').value) * Math.PI / 180;
    
    // Set position
    objectToFit.position.set(x, y, z);
    
    // Apply rotations using intrinsic rotations (each rotation around the object's current axes)
    // This is the correct way to get local axis rotation behavior
    
    // Reset to identity first
    objectToFit.quaternion.set(0, 0, 0, 1);
    
    // Apply rotations in the correct order for intrinsic rotations
    // Each rotation is applied around the object's current local axis
    
    // Create individual quaternions for each axis
    const qx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), rotX);
    const qy = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotY);
    const qz = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), rotZ);
    
    // Apply in Z, Y, X order for proper intrinsic rotation
    // This ensures each rotation happens around the object's local axes
    objectToFit.quaternion.multiplyQuaternions(objectToFit.quaternion, qz);
    objectToFit.quaternion.multiplyQuaternions(objectToFit.quaternion, qy);
    objectToFit.quaternion.multiplyQuaternions(objectToFit.quaternion, qx);
    
    // Update fit status
    updateFitStatus();
    
    // Update visual feedback
    updateObjectColor();
}

// Check if object fits and update status
function updateFitStatus() {
    if (!window.objectFitting) return;
    
    const fits = window.objectFitting.checkObjectFit();
    const statusElement = document.getElementById('fitStatus');
    const statusText = statusElement.querySelector('.status-text');
    
    statusElement.className = 'status-indicator';
    
    if (fits.throughDoor && fits.inElevator) {
        statusElement.classList.add('fits');
        statusText.textContent = '✓ Object fits!';
    } else {
        statusElement.classList.add('does-not-fit');
        if (!fits.throughDoor && !fits.inElevator) {
            statusText.textContent = '✗ Too big for door and elevator';
        } else if (!fits.throughDoor) {
            statusText.textContent = '✗ Cannot pass through door';
        } else {
            statusText.textContent = '✗ Too big for elevator';
        }
    }
    
    // Update measurements
    document.getElementById('doorClearance').textContent = 
        fits.doorClearance > 0 ? `${fits.doorClearance.toFixed(1)}cm` : 'No clearance';
    document.getElementById('elevatorSpace').textContent = 
        fits.elevatorSpace > 0 ? `${fits.elevatorSpace.toFixed(1)}cm` : 'No space';
}

// Update object color based on fit status
function updateObjectColor() {
    if (!objectToFit || !window.objectFitting) return;
    
    const fits = window.objectFitting.checkObjectFit();
    
    // Update main object material
    if (fits.throughDoor && fits.inElevator) {
        objectToFit.material.color.setHex(0x27ae60); // Green - fits
    } else if (fits.throughDoor) {
        objectToFit.material.color.setHex(0xf39c12); // Orange - fits door but not elevator
    } else {
        objectToFit.material.color.setHex(0xe74c3c); // Red - doesn't fit
    }
    
    // Update wireframe color to match
    if (objectToFit.children.length > 0) {
        objectToFit.children[0].material.color.copy(objectToFit.material.color);
    }
}

// Animation loop
function animate() {
    animationId = requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    const canvas = document.getElementById('threejs-canvas');
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);