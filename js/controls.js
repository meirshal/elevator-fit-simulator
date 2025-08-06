// Control handlers and input management

document.addEventListener('DOMContentLoaded', function() {
    initializeControls();
});

function initializeControls() {
    // Dimension input handlers
    const dimensionInputs = [
        'elevatorHeight', 'elevatorWidth', 'elevatorLength',
        'doorHeight', 'doorWidth',
        'objectHeight', 'objectWidth', 'objectLength'
    ];
    
    dimensionInputs.forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('input', handleDimensionChange);
    });
    
    // Position control handlers
    const positionControls = ['objectX', 'objectY', 'objectZ'];
    positionControls.forEach(id => {
        const slider = document.getElementById(id);
        const input = document.getElementById(id + 'Input');
        
        // Slider to input synchronization
        slider.addEventListener('input', function() {
            input.value = this.value;
            updateObjectTransform();
        });
        
        // Input to slider synchronization
        input.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (!isNaN(value)) {
                // Constrain value to slider limits
                const min = parseFloat(slider.min);
                const max = parseFloat(slider.max);
                const constrainedValue = Math.max(min, Math.min(max, value));
                
                slider.value = constrainedValue;
                this.value = constrainedValue;
                updateObjectTransform();
            }
        });
    });
    
    // Rotation control handlers
    const rotationControls = ['rotationX', 'rotationY', 'rotationZ'];
    rotationControls.forEach(id => {
        const slider = document.getElementById(id);
        const input = document.getElementById(id + 'Input');
        
        // Slider to input synchronization
        slider.addEventListener('input', function() {
            input.value = this.value;
            updateObjectTransform();
        });
        
        // Input to slider synchronization
        input.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (!isNaN(value)) {
                // Handle rotation wrapping (0-360 degrees)
                let constrainedValue = value % 360;
                if (constrainedValue < 0) constrainedValue += 360;
                
                slider.value = constrainedValue;
                this.value = constrainedValue;
                updateObjectTransform();
            }
        });
    });
    
    // Button handlers
    document.getElementById('resetButton').addEventListener('click', resetAll);
    document.getElementById('centerObject').addEventListener('click', centerObject);
    document.getElementById('clearStorageButton').addEventListener('click', handleClearStorage);
    
    // Initialize display values
    updateSliderDisplays();
}

function handleDimensionChange(event) {
    const input = event.target;
    const value = parseFloat(input.value);
    
    // Validate input
    if (isNaN(value) || value <= 0) {
        input.style.borderColor = '#e74c3c';
        input.style.boxShadow = '0 0 5px rgba(231, 76, 60, 0.5)';
        return;
    } else {
        input.style.borderColor = '#ddd';
        input.style.boxShadow = 'none';
    }
    
    // Additional validation for specific inputs
    if (input.id.startsWith('door')) {
        const elevatorHeight = parseFloat(document.getElementById('elevatorHeight').value);
        const elevatorWidth = parseFloat(document.getElementById('elevatorWidth').value);
        
        if (input.id === 'doorHeight' && value > elevatorHeight) {
            input.style.borderColor = '#f39c12';
            input.style.boxShadow = '0 0 5px rgba(243, 156, 18, 0.5)';
            console.warn('Door height cannot be larger than elevator height');
        }
        
        if (input.id === 'doorWidth' && value > elevatorWidth) {
            input.style.borderColor = '#f39c12';
            input.style.boxShadow = '0 0 5px rgba(243, 156, 18, 0.5)';
            console.warn('Door width cannot be larger than elevator width');
        }
    }
    
    // Update 3D models based on which input changed
    if (input.id.startsWith('elevator') || input.id.startsWith('door')) {
        createElevator();
    } else if (input.id.startsWith('object')) {
        createObject();
    }
    
    // Update position slider limits based on elevator dimensions
    updatePositionLimits();
}

function updatePositionLimits() {
    const elevatorWidth = parseFloat(document.getElementById('elevatorWidth').value);
    const elevatorHeight = parseFloat(document.getElementById('elevatorHeight').value);
    const elevatorLength = parseFloat(document.getElementById('elevatorLength').value);
    
    // Update X position limits (width)
    const xSlider = document.getElementById('objectX');
    xSlider.min = -elevatorWidth / 2;
    xSlider.max = elevatorWidth / 2;
    
    // Update Y position limits (height)
    const ySlider = document.getElementById('objectY');
    ySlider.min = -elevatorHeight / 2;
    ySlider.max = elevatorHeight / 2;
    
    // Update Z position limits (length)
    const zSlider = document.getElementById('objectZ');
    zSlider.min = -elevatorLength / 2;
    zSlider.max = elevatorLength / 2;
}

function updateSliderDisplays() {
    // Update position displays
    ['objectX', 'objectY', 'objectZ'].forEach(id => {
        const slider = document.getElementById(id);
        const input = document.getElementById(id + 'Input');
        if (input) {
            input.value = slider.value;
        }
    });
    
    // Update rotation displays
    ['rotationX', 'rotationY', 'rotationZ'].forEach(id => {
        const slider = document.getElementById(id);
        const input = document.getElementById(id + 'Input');
        if (input) {
            input.value = slider.value;
        }
    });
}

function resetAll() {
    // Use storage module to get default values if available
    const defaults = window.storageModule ? window.storageModule.DEFAULT_VALUES : {
        elevatorHeight: 250,
        elevatorWidth: 150,
        elevatorLength: 200,
        doorHeight: 200,
        doorWidth: 90,
        objectHeight: 180,
        objectWidth: 80,
        objectLength: 120,
        objectX: 0,
        objectY: 0,
        objectZ: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0
    };
    
    // Apply default values to all inputs
    Object.keys(defaults).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.value = defaults[key];
        }
    });
    
    // Update displays
    updateSliderDisplays();
    updatePositionLimits();
    
    // Recreate 3D objects
    createElevator();
    createObject();
    
    // Save the reset values
    if (window.storageModule) {
        window.storageModule.saveToStorage();
    }
    
    console.log('All values reset to defaults');
}

function centerObject() {
    // Center position
    document.getElementById('objectX').value = 0;
    document.getElementById('objectY').value = 0;
    document.getElementById('objectZ').value = 0;
    
    // Reset rotation
    document.getElementById('rotationX').value = 0;
    document.getElementById('rotationY').value = 0;
    document.getElementById('rotationZ').value = 0;
    
    // Update displays
    updateSliderDisplays();
    
    // Update object transform
    updateObjectTransform();
    
    // Save the changes
    if (window.storageModule) {
        window.storageModule.saveToStorage();
    }
    
    console.log('Object centered and rotation reset');
}

// Validate all inputs
function validateInputs() {
    const inputs = document.querySelectorAll('input[type="number"]');
    let allValid = true;
    
    inputs.forEach(input => {
        const value = parseFloat(input.value);
        if (isNaN(value) || value <= 0) {
            input.style.borderColor = '#e74c3c';
            allValid = false;
        } else {
            input.style.borderColor = '#ddd';
        }
    });
    
    return allValid;
}

// Handle keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Prevent shortcuts when typing in inputs
    if (event.target.tagName === 'INPUT') return;
    
    switch(event.key) {
        case 'r':
        case 'R':
            resetAll();
            break;
        case 'c':
        case 'C':
            centerObject();
            break;
        case ' ':
            event.preventDefault();
            centerObject();
            break;
    }
});


// Handle clear storage button
function handleClearStorage() {
    const confirmed = confirm(
        'This will clear all saved settings and reset to default values. Continue?'
    );
    
    if (confirmed && window.storageModule) {
        const success = window.storageModule.clearStorage();
        if (success) {
            // Update displays after clearing
            updateSliderDisplays();
            updatePositionLimits();
            alert('Saved data cleared successfully!');
        } else {
            alert('Failed to clear saved data. Please try again.');
        }
    }
}

// Export functions for use in other modules
window.controlsModule = {
    updatePositionLimits,
    validateInputs,
    resetAll,
    centerObject,
    updateSliderDisplays
};