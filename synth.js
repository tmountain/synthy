// Step 1: Create the audio context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Get references to the UI elements
const waveShapeSelect = document.getElementById('waveShape');
const gainControl = document.getElementById('gain');
const frequencyModulationControl = document.getElementById('frequencyModulation');

// Step 2: Function to create an oscillator for each note
function playNote(frequency, keyElement) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const modulationNode = audioContext.createOscillator();
    const modulationGain = audioContext.createGain();

    // Set the oscillator wave shape from the select menu
    oscillator.type = waveShapeSelect.value;
    
    // Apply frequency modulation
    modulationNode.frequency.value = frequencyModulationControl.value;
    modulationGain.gain.value = 50; // Modulation depth
    modulationNode.connect(modulationGain);
    modulationGain.connect(oscillator.frequency);

    oscillator.frequency.value = frequency;
    gainNode.gain.value = gainControl.value;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    modulationNode.start();

    // Add the 'active' class to the key element
    keyElement.classList.add('active');

    // Stop the note after a specified duration (e.g., 1 second)
    setTimeout(() => {
        oscillator.stop();
        modulationNode.stop();
        oscillator.disconnect();
        modulationNode.disconnect();
        // Remove the 'active' class from the key element
        keyElement.classList.remove('active');
    }, 1000);
}

// Step 3: Function to map keys to frequencies
const noteFrequencies = {
    'a': 261.63, // C4
    'w': 277.18, // C#4
    's': 293.66, // D4
    'e': 311.13, // D#4
    'd': 329.63, // E4
    'f': 349.23, // F4
    't': 369.99, // F#4
    'g': 392.00, // G4
    'y': 415.30, // G#4
    'h': 440.00, // A4
    'u': 466.16, // A#4
    'j': 493.88, // B4
    'k': 523.25, // C5
};

// Step 4: Event listener for keydown events
document.addEventListener('keydown', (event) => {
    const frequency = noteFrequencies[event.key];
    const keyElement = document.querySelector(`.key[data-key="${event.key}"]`);
    if (frequency && keyElement) {
        playNote(frequency, keyElement);
    }
});

