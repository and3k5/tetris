import { noteToFreq } from "./notes";

/**
 * 
 * @param {AudioContext} audioContext 
 * @param {Number} freq 
 * @param {Number} sampleDuration 
 */
export default function Sound(audioContext) {
    const sampleDuration = 15;
    const sampleRate = audioContext.sampleRate;
    const sampleLength = sampleRate * sampleDuration;
    const buffer = audioContext.createBuffer(1, sampleLength, sampleRate);

    const data = buffer.getChannelData(0);

    const tick = 60 / 128;

    track1(tick, data, sampleRate);
    track2(tick, data, sampleRate);

    return buffer;
}

function track1(tick, data, sampleRate) {
    const delay = Math.floor(sampleRate * (tick / 2));

    const scale = function (start,count,scales) {
        for (let i = 0;i<count;i++) {
            const noteNumber = scales[i % scales.length];
            note(data, start, noteToFreq(noteNumber), 0.04, sampleRate);
            start += delay;
        }
        return start;
    }
    
    let start = 0;

    start = scale(start, 8, [64,69,72]);
    start = scale(start, 8, [64,69,71]);
    start = scale(start, 8, [65,69,72]);
    start = scale(start, 4, [64,69,74]);
    start = scale(start, 4, [67,72,76]);
    
    start = scale(start, 8, [65,69,74]);
    start = scale(start, 8, [65,69,72]);
    start = scale(start, 8, [64,69,72]);
    start = scale(start, 4, [64,69,71]);
    start = scale(start, 4, [67,72,76]);
}

function track2(tick, data, sampleRate) {
    const delay = Math.floor(sampleRate * (tick));
    const noteLength = tick / 2;

    const bass = function (start,count,noteNumber) {
        for (let i = 0;i<count;i++) {
            note2(data, start + delay/2, noteToFreq(noteNumber), noteLength, sampleRate);
            note2(data, start + delay/2, noteToFreq(noteNumber+12), noteLength, sampleRate);
            start += delay;
        }
        return start;
    }
    
    let start = 0;

    start = bass(start, 4, 21);
    start = bass(start, 4, 23);
    start = bass(start, 4, 17);
    start = bass(start, 2, 21);
    start = bass(start, 2, 24);

    start = bass(start, 4, 26);
    start = bass(start, 4, 24);
    start = bass(start, 4, 21);
    start = bass(start, 2, 26);
    start = bass(start, 2, 24);
    
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
        let wave = Math.sin(ang * Math.PI / 180);
        if (wave > 0) {
            wave = 1;
        }else{
            wave = -1;
        }
        const fadeOut = (1 - i / sampleLength);
        const fadeOut2 = Math.min(i / (sampleLength / 32), 1);
        const fadeIn = (i / sampleLength);
        const volume = 0.4;
        data[startIndex + i] += (fadeIn * wave * fadeOut * fadeOut2) * volume;
    }
}

/**
 * 
 * @param {Float32Array} data 
 * @param {Number} sampleLength 
 */
export function note2(data, startIndex, freq, sampleDuration, sampleRate) {
    const sampleLength = sampleRate * sampleDuration;
    for (let i = 0; i < sampleLength; i++) {
        // Math.random() is in [0; 1.0]
        // audio needs to be in [-1.0; 1.0]
        const ang = (i / sampleLength) * freq * (360 * sampleDuration);
        let wave = Math.sin(ang * Math.PI / 180);
        wave = Math.max(-1, Math.min(1, wave * 2));
        const fadeOut2 = Math.min(i / (sampleLength / 32), 1);
        const volume = 0.4;
        data[startIndex + i] += (wave * fadeOut2) * volume;
    }
}