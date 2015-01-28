window.addEventListener('load', init, false);
var playSound, playMusic, context;
function init() {
	try {
		SOUNDS=["gamelose","gamebump","gamerow","menuback","gamemove"];
		//var context;
		var audioBuffers = [];
		context = new AudioContext();
		function loadSound(id, url) {
			if (context == false) {
				return false;
			}
			var request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.responseType = 'arraybuffer';
			var idd = id;
			// Decode asynchronously
			request.onprogress = function (e) {
				return;
				(function (ed) {
					for (i in SOUNDS) {
						if (SOUNDS[i][0] == ed) {
							return SOUNDS[i];
						}
					}
					/*for (i in MUSIC) {
						if (MUSIC[i][0] == ed) {
							return MUSIC[i];
						}
					}*/
				})(idd)[2] = (id, e.loaded / e.total);
			}
			request.onload = function () {
				context.decodeAudioData(request.response, function (buffer) {
					audioBuffers[id] = buffer;
					//playSound(buffer);
					for (i in SOUNDS) {
						if (SOUNDS[i][2] != 1) {
							return;
						}
					}
					for (i in MUSIC) {
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
		var currentMusicPlaying;
		var toKill;

		playMusic = function (id) {
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
				var source = context.createBufferSource(); // creates a sound source
				source.loop = true;

				source.buffer = audioBuffers[id];
				source.playbackRate.value = 1.0;
				// tell the source which sound to play
				source.connect(context.destination); // connect the source to the context's destination (the speakers)
				source.noteOn(0); // play the source now
				toKill = source;
			} catch (e) {
				console.log(e.message);
				console.log(typeof(audioBuffers[id]));
			};
		}

		playSound = function (id) {
			/*if (settings_ch[0][2] != 1) {
				return false;
			}*/
			if (context == false) {
				return false;
			}
			try {
				var source = context.createBufferSource(); // creates a sound source
				source.loop = false;
				source.buffer = audioBuffers[id];
				source.playbackRate.value = 1.0;
				// tell the source which sound to play
				source.connect(context.destination); // connect the source to the context's destination (the speakers)
				source.noteOn(0); // play the source now
				setTimeout(function () {
					source.disconnect();
				}, ((source.buffer.length / context.sampleRate) * 1000) + 100);
			} catch (e) {};
		}
		for (i in SOUNDS) {
			loadSound(SOUNDS[i], "sound/"+SOUNDS[i]+".wav");
		}
		/*for (i in MUSIC) {
			loadSound(MUSIC[i][0], MUSIC[i][1]);
		}*/

	} catch (e) {
		console.error(e);
		context = false;
		webAudioApiFailed = 1;
		WHERE = 0;
		playSound = playMusic = function () {};
	}
	//menuNav("menu");
}
