import { noteToFreq } from "./notes";

/**
 * 
 * @param {AudioContext} audioContext 
 * @param {Number} freq 
 * @param {Number} sampleDuration 
 */
export default function Sound(audioContext) {
    const sampleDuration = 2.706;
    const sampleRate = audioContext.sampleRate;
    const sampleLength = sampleRate * sampleDuration;
    const buffer = audioContext.createBuffer(1, sampleLength, sampleRate);

    const data = buffer.getChannelData(0);

    const tick = 60 / 170 / 4;

    let start = 0;

    note(data, start, noteToFreq(60), 0.04, sampleRate);
    start += Math.floor(sampleRate * tick/2);
    note(data, start, noteToFreq(64), 0.04, sampleRate);
    start += Math.floor(sampleRate * tick/2);
    note(data, start, noteToFreq(72), 0.04, sampleRate);
    return buffer;
}

/**
 * 
 * @param {Float32Array} data 
 * @param {Number} sampleLength 
 */
export function note(data, startIndex, freq, sampleDuration, sampleRate) {
    const sampleLength = sampleRate * sampleDuration;
    for (let i = 0; i < sampleLength; i++) {
        // Math.random() is in [0; 1.0]
        // audio needs to be in [-1.0; 1.0]
        const ang = (i / sampleLength) * freq * (360 * sampleDuration);
        const wave = Math.sin(ang * Math.PI / 180);
        const fadeOut = (1 - i / sampleLength);
        const fadeOut2 = Math.min(i / (sampleLength / 32), 1);
        const volume = 0.4;
        data[startIndex + i] = (wave * fadeOut * fadeOut2) * volume;
    }
}