let SOUNDS;
let playMusic;
export let context;
export let soundReady = false;
export const audioBuffers = [];
let // [number/bool] If webaudio doesnt work, then skip download
    webAudioApiFailed = 0;

if (global.browser) {
    window.addEventListener('load', init, { once: true });
}

import { sounds } from "./sounds";

export function init() {
    try {
        SOUNDS = sounds;
        //var context;

        context = new AudioContext();

        let currentMusicPlaying;
        let toKill;

        playMusic = id => {
            // disabled sound.. i wanna hear music while making my tetris.. :)
            return "blah";
            if (settings_ch[0][2] != 1) {
                return false;
            }
            if (context == false) {
                return false;
            }
            try {
                if (toKill != undefined) {
                    toKill.noteOff(0);
                    toKill.disconnect();
                }
                const source = context.createBufferSource(); // creates a sound source
                source.loop = true;

                source.buffer = audioBuffers[id];
                source.playbackRate.value = 1.0;
                // tell the source which sound to play
                source.connect(context.destination); // connect the source to the context's destination (the speakers)
                source.start(0); // play the source now
                toKill = source;
            } catch (e) {
                console.debug(e.message);
                console.debug(typeof (audioBuffers[id]));
            };
        }

        soundReady = true;
        var tasks = [];
        for (const i in SOUNDS) {
            tasks.push((async function () {
                var buffer = await loadSound(SOUNDS[i], `sound/${SOUNDS[i]}.wav`, context);
                audioBuffers[SOUNDS[i]] = buffer;
            })());
        }
        Promise.all(tasks).then(() => {
            console.debug("sound ready");
        });
    } catch (e) {
        console.error(e);
        context = false;
        webAudioApiFailed = 1;
        //WHERE = 0;
        playSound = playMusic = () => { };
    }
    //menuNav("menu");
}

/**
 * 
 * @param {string} id 
 * @param {string} url 
 * @param {AudioContext} context 
 */
async function loadSound(id, url, context) {
    return new Promise((res, rej) => {
        if (context == false) {
            return false;
        }
        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        const idd = id;
        // Decode asynchronously
        request.onprogress = ({ loaded, total }) => {
            return;
            (ed => {
                for (const i in SOUNDS) {
                    if (SOUNDS[i][0] == ed) {
                        return SOUNDS[i];
                    }
                }
                /*for (var i in MUSIC) {
                    if (MUSIC[i][0] == ed) {
                        return MUSIC[i];
                    }
                }*/
            })(idd)[2] = (id, loaded / total);
        }
        request.onload = async () => {
            res(await context.decodeAudioData(request.response));
        }
        request.send();
    });
}