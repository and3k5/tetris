import { noteToFreq } from "./notes";

export default function Sound(audioContext: AudioContext) {
    const sampleDuration = 0.5;
    const sampleRate = audioContext.sampleRate;
    const sampleLength = sampleRate * sampleDuration;
    const buffer = audioContext.createBuffer(1, sampleLength, sampleRate);

    const data = buffer.getChannelData(0);

    note(data, 0, noteToFreq(53), 0.05, sampleRate);

    return buffer;
}

export function note(data: Float32Array, startIndex, freq, sampleDuration, sampleRate) {
    const sampleLength = sampleRate * sampleDuration;
    for (let i = 0; i < sampleLength; i++) {
        // Math.random() is in [0; 1.0]
        // audio needs to be in [-1.0; 1.0]
        let ang = (i / sampleLength) * freq * (360 * sampleDuration);

        const fadeOut = 1 - i / sampleLength;
        ang *= (1 + Math.sin((fadeOut * 45 * Math.PI) / 180)) / 2;
        const wave = Math.sin((ang * Math.PI) / 180);
        const fadeOut2 = Math.min(i / (sampleLength / 32), 1);
        const volume = 0.4;
        data[startIndex + i] = wave * fadeOut * fadeOut2 * volume;
    }
}
