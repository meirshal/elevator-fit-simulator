// Local Storage Management for Elevator Fit Checker

const STORAGE_KEY = 'elevatorFitChecker';

// Default values
const DEFAULT_VALUES = {
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

// Save current values to localStorage
function saveToStorage() {
    const values = {};
    
    // Get all input values
    Object.keys(DEFAULT_VALUES).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            values[key] = element.value;
        }
    });
    
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
        console.log('Settings saved to localStorage');
    } catch (error) {
        console.warn('Failed to save to localStorage:', error);
    }
}

// Load values from localStorage
function loadFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const values = JSON.parse(stored);
            console.log('Loading saved settings from localStorage');
            return values;
        }
    } catch (error) {
        console.warn('Failed to load from localStorage:', error);
    }
    
    console.log('Using default values');
    return DEFAULT_VALUES;
}

// Apply values to form inputs
function applyStoredValues(values) {
    Object.keys(values).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.value = values[key];
        }
        
        // Also update corresponding input field if it exists
        const inputElement = document.getElementById(key + 'Input');
        if (inputElement) {
            inputElement.value = values[key];
        }
    });
    
    // Update slider displays
    if (window.controlsModule && window.controlsModule.updateSliderDisplays) {
        window.controlsModule.updateSliderDisplays();
    }
    
    // Update position limits
    if (window.controlsModule && window.controlsModule.updatePositionLimits) {
        window.controlsModule.updatePositionLimits();
    }
}

// Initialize storage system
function initStorage() {
    // Load and apply stored values
    const storedValues = loadFromStorage();
    applyStoredValues(storedValues);
    
    // Set up auto-save on input changes
    const inputs = document.querySelectorAll('input[type="number"], input[type="range"]');
    inputs.forEach(input => {
        // Skip the slider input fields as they're handled by the main controls
        if (!input.classList.contains('slider-input')) {
            input.addEventListener('input', debounce(saveToStorage, 500));
        }
    });
    
    console.log('Storage system initialized');
}

// Clear all stored data
function clearStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('Storage cleared');
        
        // Reset to defaults
        applyStoredValues(DEFAULT_VALUES);
        
        // Recreate 3D objects if they exist
        if (typeof createElevator === 'function') {
            createElevator();
        }
        if (typeof createObject === 'function') {
            createObject();
        }
        
        return true;
    } catch (error) {
        console.warn('Failed to clear storage:', error);
        return false;
    }
}

// Get current storage size
function getStorageInfo() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return {
                size: new Blob([stored]).size,
                itemCount: Object.keys(JSON.parse(stored)).length,
                lastModified: new Date().toISOString()
            };
        }
    } catch (error) {
        console.warn('Failed to get storage info:', error);
    }
    return null;
}

// Debounce function to limit save frequency
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export for global access
window.storageModule = {
    saveToStorage,
    loadFromStorage,
    clearStorage,
    getStorageInfo,
    initStorage,
    DEFAULT_VALUES
};