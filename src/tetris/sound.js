import * as console from "../utils/trace.js";

window.addEventListener('load', init, { once: true });
let SOUNDS;
let playMusic;
let context;
let soundReady = false;
const audioBuffers = [];
let // [number/bool] If webaudio doesnt work, then skip download
            webAudioApiFailed = 0;

function init() {
    try {
        SOUNDS = ["gamelose", "gamebump", "gamerow", "menuback", "gamemove"];
        //var context;

        context = new AudioContext();
        function loadSound(id, url) {
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
            request.onload = () => {
                context.decodeAudioData(request.response, buffer => {
                    audioBuffers[id] = buffer;
                    //playSound(buffer);
                    for (var i in SOUNDS) {
                        if (SOUNDS[i][2] != 1) {
                            return;
                        }
                    }
                    for (var i in MUSIC) {
                        if (MUSIC[i][2] != 1) {
                            return;
                        }
                    }
                    menuNav("menu");
                }, onError);
            }
            request.send();
        }

        function onError(e) {
            console.error(e);
        }
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
        for (const i in SOUNDS) {
            loadSound(SOUNDS[i], `sound/${SOUNDS[i]}.wav`);
        }
        console.debug("sound ready");
		/*for (var i in MUSIC) {
			loadSound(MUSIC[i][0], MUSIC[i][1]);
		}*/

    } catch (e) {
        console.error(e);
        context = false;
        webAudioApiFailed = 1;
        //WHERE = 0;
        playSound = playMusic = () => { };
    }
    //menuNav("menu");
}



export function playSound(id) {
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