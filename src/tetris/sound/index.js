import * as console from "../../utils/trace.js";

export let activated = true;

export function deactivate() {
    activated = false;
}

import { soundReady, context, audioBuffers } from "./load";

export function playSound(id) {
    if (activated !== true) {
        console.debug("sound deactivated");
        return false;
    }
    console.debug("playSound:" + id);
    if (soundReady !== true) {
        console.debug("tried to play sound before ready");
        return false;
    }
	/*if (settings_ch[0][2] != 1) {
		return false;
	}*/
    if (context == false) {
        console.debug("tried to play sound with disabled context");
        return false;
    }
    try {
        const source = context.createBufferSource(); // creates a sound source
        source.loop = false;
        source.buffer = audioBuffers[id];
        source.playbackRate.value = 1.0;
        // tell the source which sound to play
        source.connect(context.destination); // connect the source to the context's destination (the speakers)
        source.start(0); // play the source now
        setTimeout(() => {
            source.disconnect();
        }, ((source.buffer.length / context.sampleRate) * 1000) + 100);
    } catch (e) {
        console.warn(e);
    };
}