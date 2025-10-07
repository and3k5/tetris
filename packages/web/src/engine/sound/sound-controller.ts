import generators from "./generators";

export class SoundController {
    activated = true;
    ready = false;
    private _context = null;
    private _generators = null;
    failed = false;
    private _audioBuffers = [];
    private _initialized = false;
    constructor() {}

    init() {
        if (this._initialized !== false)
            throw new Error("SoundController can only be initialized once");
        this._initialized = true;
        try {
            this._context = new AudioContext();
            for (const generator of generators) {
                console.log(generator);
                this._audioBuffers[generator.name] = generator.buffer(this._context);
            }
            this.ready = true;
        } catch (e) {
            console.error(e);
            this._context = null;
            this.failed = true;
        }

        this.ready = true;
    }

    get allSoundKeys() {
        return Object.keys(this._audioBuffers);
    }

    playSound(id, { throwErrors = false } = {}) {
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
        if (!(this._context instanceof AudioContext)) {
            console.debug("tried to play sound with an invalid AudioContext");
            return false;
        }
        try {
            const source = this._context.createBufferSource(); // creates a sound source
            source.loop = false;
            source.buffer = this._audioBuffers[id];
            source.playbackRate.value = 1.0;
            // tell the source which sound to play
            source.connect(this._context.destination); // connect the source to the context's destination (the speakers)
            source.start(0); // play the source now
            const timeout = (source.buffer.length / this._context.sampleRate) * 1000 + 100;
            setTimeout(() => source.disconnect(), timeout);
            return true;
        } catch (e) {
            console.warn(e);
            if (throwErrors) throw e;
            return false;
        }
    }
}
