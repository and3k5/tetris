import { noteToFreq } from "./notes";

/**
 * 
 * @param {AudioContext} audioContext 
 * @param {Number} freq 
 * @param {Number} sampleDuration 
 */
export default function Sound(audioContext) {
    var sampleDuration = 0.5;
    var sampleRate = audioContext.sampleRate;
    var sampleLength = sampleRate * sampleDuration;
    var buffer = audioContext.createBuffer(1, sampleLength, sampleRate);

    var data = buffer.getChannelData(0);

    note(data, 0, noteToFreq(50), 0.05, sampleRate);

    return buffer;
}

/**
 * 
 * @param {Float32Array} data 
 * @param {Number} sampleLength 
 */
export function note(data, startIndex, freq, sampleDuration, sampleRate) {
    const sampleLength = sampleRate * sampleDuration;
    for (var i = 0; i < sampleLength; i++) {
        // Math.random() is in [0; 1.0]
        // audio needs to be in [-1.0; 1.0]
        var ang = (i / sampleLength) * freq * (360 * sampleDuration);
        var wave = Math.sin(ang * Math.PI / 180);
        var fadeOut = (1 - i / sampleLength);
        var fadeIn = (i / sampleLength);
        var fadeOut2 = Math.min(i / (sampleLength / 32), 1);
        var volume = 0.6;
        data[startIndex + i] = (fadeIn * wave * fadeOut * fadeOut2) * volume;
    }
}