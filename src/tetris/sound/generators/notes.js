// Note functions
export const KeysPerOctave = 12;

// Note number to note name
// 57 = A4
var NOTENAMES = ["C?", "C#?/Db?", "D?", "D#?/Eb?", "E?", "F?", "F#?/Gb?", "G?", "G#?/Ab?", "A?", "A#?/Bb?", "B?"];
export function noteToName(num) {
    return NOTENAMES[~~(num) % KeysPerOctave].replace(/\?/g, ~~(num / KeysPerOctave));
}

// Note number to frequency
// 57 = 440.0
export function noteToFreq(note) {
    return 440 * Math.pow(2, (note - 57) / KeysPerOctave);
}

// Frequency to note number
// 440.0 = 57
export function freqToNote(frequency) {
    return Math.round(KeysPerOctave * (Math.log(frequency / 440) / Math.log(2))) + 57;
}