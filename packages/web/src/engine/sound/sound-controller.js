import generators from "./generators";

export class SoundController {
    activated = true;
    ready = false;
    #context = null;
    #generators = null;
    failed = false;
    #audioBuffers = [];
    #initialized = false;
    constructor() {

    }

    init() {
        if (this.#initialized !== false)
            throw new Error("SoundController can only be initialized once");
        this.#initialized = true;
        try {
            this.#context = new AudioContext();
            for (const generator of generators) {
                console.log(generator);
                this.#audioBuffers[generator.name] = generator.buffer(this.#context);
            }
            this.ready = true;
        } catch (e) {
            console.error(e);
            this.#context = null;
            this.failed = true;
        }

        this.ready = true;
    }

    get allSoundKeys() {
        return Object.keys(this.#audioBuffers);
    }

    playSound(id, {throwErrors = false} = {}) {
        if (this.failed == true) {
            return false;
        }
        if (this.activated !== true) {
            console.debug("sound deactivated");
            return false;
        }
        console.debug("playSound:" + id);
        if (this.ready !== true) {
            console.warn("tried to play sound before ready");
            return false;
        }
        if (!(this.#context instanceof AudioContext)) {
            console.debug("tried to play sound with an invalid AudioContext");
            return false;
        }
        try {
            const source = this.#context.createBufferSource(); // creates a sound source
            source.loop = false;
            source.buffer = this.#audioBuffers[id];
            source.playbackRate.value = 1.0;
            // tell the source which sound to play
            source.connect(this.#context.destination); // connect the source to the context's destination (the speakers)
            source.start(0); // play the source now
            var timeout = ((buffer.length / this.#context.sampleRate) * 1000) + 100;
            setTimeout(() => source.disconnect(),timeout);
            return true;
        } catch (e) {
            console.warn(e);
            if (throwErrors)
                throw e;
            return false;
        }
    }
}