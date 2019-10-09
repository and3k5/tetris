import Color from "./color.js";
import Brick from "./brick.js";
import { playSound } from "./sound.js";

function TetrisGame() {
	var WIDTH, // [number] Bricks x count
	HEIGHT, // [number] Bricks y count
	BRICKSIZE, // [number] Size of a brick (in pixels)
	GRID_WIDTH, // [number] Width of grid
	GRID_HEIGHT, // [number] Height of grid
	CANVAS_WIDTH, // [number] canvas width (soon to be deleted)
	CANVAS_HEIGHT, // [number] canvas height (soon to be deleted)
	FPS = 0, // [number] FPS counter
	PENDINGUPDATE = false, // [Bool] Update to graphic
	GRAPHIC_FONT, // [string] Font name
	GRAPHIC_MENU_FONTSIZE, // [number] Menu font size
	GRAPHIC_MENUDESC_FONTSIZE, // [number] Menu subtext font size
	GRAPHIC_MENU_DISTANCE, // [number] Menu ???
	GRAPHIC_BOARD_FONTSIZE, // [number] Board font size
	GRAPHIC_SCORE_FONTSIZE, // [number] Score font size
	RUNNING = true, // [bool] running
	ctx, // [Graphic Context] Game 2d context
	h_ctx, // [Graphic Context] Game holding brick 2d context
	n_ctx, // [Graphic Context] Game next brick 2d context
	WHERE = -1, // [number] Current showing screen
	// 0 = menu
	// 1 = ingame
	// 2 = paused
	// 3 = tutorial
	// 4 = about
	// 5 = lost game
	// 6 = Settings
	FROM = 0, // [number] Unused (might be removed)
	webAudioApiFailed = 0, // [number/bool] If webaudio doesnt work, then skip download
	SELECTED_MENU = 0, // [number] Selected menu item
	SETTING_GHOST = true, // [bool] ghost option
		HOLDING = null, // [Brick] current holding brick
	HOLDINGCOUNT = 0, // count of holding
	scoreelement = null,
	MAYDROP = true, // Fix to avoid Space to repeat keydown events
	SCORE = 0,
	bricks = [],
	bricksform = [
		[[0, 1, 0],
			[0, 1, 0],
			[0, 1, 1]],

		[[0, 1, 0],
			[0, 1, 0],
			[1, 1, 0]],

		[[0, 1, 1],
			[1, 1, 0],
			[0, 0, 0]],

		[[1, 1, 0],
			[0, 1, 1],
			[0, 0, 0]],

		[[0, 1, 0],
			[1, 1, 1],
			[0, 0, 0]],

		[[1, 1],
			[1, 1]],

		[[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0]]
	],
	colors = [new Color(255, 0, 0, 1), new Color(0, 255, 0, 1), new Color(0, 0, 255, 1), new Color(255, 255, 0, 1), new Color(0, 255, 255, 1), new Color(255, 0, 255, 1), new Color(0, 128, 128, 1)];
	var nextRandom = Math.round(Math.random() * (bricksform.length - 1));

	function setScore(v) {
		SCORE = v;
		scoreelement.innerHTML = SCORE;
	}
	Object.defineProperties(this, {
		"bricks" : {
			get : function () {
				return bricks;
			},
			set : function (v) {
				if ((v == "") && (typeof([]) == "object")) {
					setScore(0);
					HOLDINGCOUNT = 0;
					HOLDING = null;
					bricks = [];
				} else {
					return false;
				}
			}
		},
		"WIDTH" : {
			get : function () {
				return WIDTH;
			},
			set : function (v) {
				return false;
			}
		},
		"HEIGHT" : {
			get : function () {
				return HEIGHT;
			},
			set : function (v) {
				return false;
			}
		},
		"PENDINGUPDATE" : {
			get : function () {
				return PENDINGUPDATE;
			},
			set : function (v) {
				PENDINGUPDATE = v;
			}
		},
		"nextRandom" : {
			get : function () {
				return nextRandom;
			},
			set : function (v) {
				nextRandom = v;
			}
		},
		"MAYDROP" : {
			get : function () {
				return MAYDROP;
			},
			set : function (v) {
				MAYDROP = v;
			}
		}
	});

	this.getBricksform = function () {
		return bricksform;
	};
	this.getColors = function () {
		return colors;
	};
	//this.getMAYDROP=function () { return MAYDROP; };
	this.getRUNNING = function () {
		return RUNNING;
	};
	this.getWIDTH = function () {
		return WIDTH;
	};
	this.bricksform = bricksform;

	function checkXY(x, y) {
		var i,
		j,
		k,
		bri_len,
		blo_len,
		brl_len;
		for (i=0,bri_len=bricks.length;i<bri_len;i++) {
			for (j=0,blo_len=bricks[i].blocks.length;j<blo_len;j++) {
				for (k=0,brl_len=bricks[i].blocks[j].length;k<brl_len;k++) {
					if (bricks[i].blocks[j][k] == 1) {
						var cond1 = (x == bricks[i].x + parseInt(k));
						var cond2 = (y == bricks[i].y + parseInt(j));
						var cond3 = (bricks[i].moving == false);
						if (cond1 && cond2 && cond3) {
							return true;
						}
					}
				}
			}
		}
		return false;
	}
	function clearLine(l) {
		if (RUNNING) {
			setScore(SCORE + 1);
			playSound("gamerow");
			var toDelete = (function (line) {
				var i,
				i1,
				i2;
				var rtn = [];
				var tx = 0;
				var times = 0;
				for (times = 0; times <= WIDTH; times++) {
					for (i in bricks) {
						for (i1 in bricks[i].blocks) {
							for (i2 in bricks[i].blocks[i1]) {
								if (bricks[i].blocks[i1][i2] == 1) {
									var cond1 = (line == bricks[i].y + parseInt(i1));
									var cond2 = (bricks[i].moving == false);
									if (cond1 && cond2) {
										bricks.splice(parseInt(i), 1);
									}
								}
							}
						}
					}
				}
				return rtn;
			})(l);
			var movedown = (function (line) {
				var i,
				i1,
				i2;
				var rtn = [];
				var tx = 0;
				var times = 0;
				for (i in bricks) {
					for (i1 in bricks[i].blocks) {
						for (i2 in bricks[i].blocks[i1]) {
							if (bricks[i].blocks[i1][i2] == 1) {
								var cond1 = (line > bricks[i].y + parseInt(i1));
								var cond2 = (bricks[i].moving == false);
								if (cond1 && cond2) {
									bricks[i].y++;
								}
							}
						}
					}
				}

				return rtn;
			})(l);
		}
	}
	this.checkLines = function () {
		//check for full lines
		if (RUNNING) {
			var i;
			var cx;
			for (i = HEIGHT; i > 1; i--) {
				var cnt = 0;
				for (cx = 0; cx <= WIDTH - 1; cx++) {
					if (checkXY(cx, i)) {
						cnt++;
					}
				}
				if (cnt == WIDTH) {
					clearLine(i++);
				}
			}
			PENDINGUPDATE = true;
		}
	}
	function makeBrick(ctx, x, y, w, h, color) {
		var fstyle = ctx.createRadialGradient(x + (w / 2), y + (h / 2), 0, x + (w / 2), y + (h / 2), 40);
		fstyle.addColorStop(0, new Color(color.r, color.g, color.b, color.a).toRGBAString());
		fstyle.addColorStop(1, new Color(color.r, color.g, color.b, color.a * 0.5).toRGBAString());
		ctx.fillStyle = fstyle;
		ctx.fillRect(x, y, w, h);
		var fstyle = ctx.createLinearGradient(x + (w / 2), y, x + (w / 2), y + h);
		fstyle.addColorStop(0.2, new Color(color.r, color.g, color.b, 0.5).toRGBAString());
		fstyle.addColorStop(0, new Color(0, 0, 0, 0.9).toRGBAString());
		ctx.fillStyle = fstyle;
		ctx.fillRect(x, y, w, h);
		var fstyle = ctx.createLinearGradient(x, y + (h / 2), x + w, y + (h / 2));
		fstyle.addColorStop(0.3, new Color(color.r * 0.7, color.g * 0.7, color.b * 0.7, 0).toRGBAString());
		fstyle.addColorStop(0, new Color(0, 0, 0, 0.4).toRGBAString());
		ctx.fillStyle = fstyle;
		ctx.fillRect(x, y, w, h);
		var fstyle = ctx.createLinearGradient(x + (w / 2), y, x + (w / 2), y + h);
		fstyle.addColorStop(0.8, new Color(color.r * 0.1, color.g * 0.1, color.b * 0.1, 0).toRGBAString());
		fstyle.addColorStop(1, new Color(0, 0, 0, 1).toRGBAString());
		ctx.fillStyle = fstyle;
		ctx.fillRect(x, y, w, h);
		var fstyle = ctx.createLinearGradient(x, y + (h / 2), x + w, y + (h / 2));
		fstyle.addColorStop(0.8, new Color(color.r * 0.2, color.g * 0.2, color.b * 0.2, 0).toRGBAString());
		fstyle.addColorStop(1, new Color(0, 0, 0, 1).toRGBAString());
		ctx.fillStyle = fstyle;
		ctx.fillRect(x, y, w, h);
	}

	function getMovingBrick() {
		var i;
		for (i in bricks) {
			if (bricks[i].moving) {
				return bricks[i];
			}
		}
	}

	function holdingShift() {
		if (HOLDINGCOUNT < 1) {
			if (HOLDING == null) {
				HOLDING = getMovingBrick();
				bricks[getMovingBrick().findMe()] = new Brick({
						ingame : true,
						game : getMovingBrick().game
					});
				HOLDINGCOUNT++;
			} else {
				var HOLDING2 = HOLDING;
				HOLDING = getMovingBrick();
				HOLDING2.resetPosition();
				bricks[getMovingBrick().findMe()] = HOLDING2;
				HOLDINGCOUNT++;
			}
		}
	}
	function clearAndResize(ctx) {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.canvas.width = CANVAS_WIDTH;
		ctx.canvas.height = CANVAS_HEIGHT;

		h_ctx.clearRect(0, 0, h_ctx.canvas.width, h_ctx.canvas.height);
		h_ctx.canvas.width = BRICKSIZE * 4;
		h_ctx.canvas.height = BRICKSIZE * 4;

		n_ctx.clearRect(0, 0, n_ctx.canvas.width, n_ctx.canvas.height);
		n_ctx.canvas.width = BRICKSIZE * 4;
		n_ctx.canvas.height = BRICKSIZE * 4;
	}
	function tiles(ctx) {
		// Grid
		return 0;
		var ix = 0,
		iy = 0;
		ctx.lineWidth = 1;
		ctx.strokeStyle = "rgba(0,255,0,0.5)";
		ctx.fillStyle = "white";
		for (ix = 0; ix <= (GRID_WIDTH); ix += BRICKSIZE) {
			ctx.beginPath();
			ctx.lineTo(ix, 0);
			ctx.lineTo(ix, GRID_HEIGHT);
			ctx.closePath();
			ctx.stroke();
		}
		for (iy = 0; iy <= (GRID_HEIGHT); iy += BRICKSIZE) {
			ctx.beginPath();
			ctx.lineTo(0, iy);
			ctx.lineTo(GRID_WIDTH, iy);
			ctx.closePath();
			ctx.stroke();
		}

		
	}
	function inGameGraphic(ctx) {
		clearAndResize(ctx);
		tiles(ctx);
		var i,
		i1,
		i2;
		for (i in bricks) {
			if (SETTING_GHOST) {
				if (bricks[i].moving) {
					//ctx.fillStyle="rgba(255,255,255,0.5)";
					var tmp_lowestPos = bricks[i].getLowestPosition(bricks);
					for (i1 in bricks[i].blocks) {
						for (i2 in bricks[i].blocks[i1]) {
							if (bricks[i].blocks[i1][i2] == 1) {
								if ((((tmp_lowestPos * BRICKSIZE) + (parseInt(i1) * BRICKSIZE)) >= 0) && (((bricks[i].y * BRICKSIZE) + (parseInt(i1) * BRICKSIZE)) <= (GRID_HEIGHT))) {
									makeBrick(ctx, (bricks[i].x * BRICKSIZE) + (parseInt(i2) * BRICKSIZE), (tmp_lowestPos * BRICKSIZE) + (parseInt(i1) * BRICKSIZE), BRICKSIZE, BRICKSIZE, new Color(255, 255, 255, 0.2));
								}
							}
						}
					}
				}
			}
			for (i1 in bricks[i].blocks) {
				for (i2 in bricks[i].blocks[i1]) {
					if (bricks[i].blocks[i1][i2] == 1) {
						if ((((bricks[i].y * BRICKSIZE) + (parseInt(i1) * BRICKSIZE)) >= 0) && (((bricks[i].y * BRICKSIZE) + (parseInt(i1) * BRICKSIZE)) <= (GRID_HEIGHT))) {
							makeBrick(ctx, (bricks[i].x * BRICKSIZE) + (parseInt(i2) * BRICKSIZE), (bricks[i].y * BRICKSIZE) + (parseInt(i1) * BRICKSIZE), BRICKSIZE, BRICKSIZE, bricks[i].color);
						}
					}
				}
			}

		}
		// NextBox field
		var BRICKSIZESCALE = 1.5;
		
		var nextBrickX = (BRICKSIZE / BRICKSIZESCALE)*2;
		var nextBrickY = (BRICKSIZE / BRICKSIZESCALE)*2;
		
		for (var i1 in bricksform[nextRandom]) {
			for (var i2 in bricksform[nextRandom][i1]) {
				if (bricksform[nextRandom][i1][i2] == 1) {
					makeBrick(n_ctx, nextBrickX + (parseInt(i2) * (BRICKSIZE / BRICKSIZESCALE)), nextBrickY + (parseInt(i1) * (BRICKSIZE / BRICKSIZESCALE)), BRICKSIZE / BRICKSIZESCALE, BRICKSIZE / BRICKSIZESCALE, colors[nextRandom]);
				}
			}
		}

		// HoldingField
		h_ctx.lineWidth = 1;
		h_ctx.strokeStyle = "rgba(0,255,0,0.5)";
		h_ctx.fillStyle = "white";
		
		var holdBrickX = 0;
		var holdBrickY = 0;
		
		if (HOLDING != null) {
			for (var i1 in HOLDING.blocks) {
				for (var i2 in HOLDING.blocks[i1]) {
					if (HOLDING.blocks[i1][i2] == 1) {
						makeBrick(h_ctx, holdBrickX + (parseInt(i2) * (BRICKSIZE / BRICKSIZESCALE)), holdBrickY + (parseInt(i1) * (BRICKSIZE / BRICKSIZESCALE)) , BRICKSIZE / BRICKSIZESCALE, BRICKSIZE / BRICKSIZESCALE, HOLDING.color);
					}
				}
			}
		}
	}

	var GAMECONTROLDOWN = false;
	var MOVESPEED = 1000;
	function gameControlDown() {
		if (GAMECONTROLDOWN == false) {
			var func = function () {
				GAMECONTROLDOWN = true;
				if (WHERE == 1) {
					getMovingBrick().movedown();
					setTimeout(func, MOVESPEED);
				} else {
					GAMECONTROLDOWN = false;
				}
			};
			func();
		}
	}
	function keyh(e) {
		switch (e.keyCode) {
		case 37:
		case 38:
		case 39:
		case 40:
		case 32:
			e.preventDefault();
			if (RUNNING) {
				// 32 = space brick.smashdown()
				// 37 = left brick.moveleft()
				// 38 = up brick.rotate()
				// 39 = right brick.moveright()
				// 40 = down brick.movedown()
				getMovingBrick()[Array(32).concat("smashdown", Array(4)).concat("moveleft,rotate,moveright,movedown".split(","))[e.keyCode]]();
			}
			break;
		case 27:
			// escape
			e.preventDefault();
			if (RUNNING) {
				// ingame
				menuNav("paused");
				playSound("menuback");
			}
			break;
		case 16:
			// shift
			e.preventDefault();
			if (RUNNING) {
				holdingShift();
			}
			break;
		}
	}
	function keyup(e) {
		if (e.keyCode == 32)
			MAYDROP = true;
	}
	function graphicControlLoop() {
		// CTX GRAPHICS
		requestAnimationFrame(graphicControlLoop);
		if (PENDINGUPDATE) {
			inGameGraphic(ctx);
			PENDINGUPDATE = false;
		}
	};
	this.init = function (g, h, n, sc) {
		WIDTH = 10;
		HEIGHT = 20;
		BRICKSIZE = 30;

		CANVAS_WIDTH = BRICKSIZE * WIDTH;
		CANVAS_HEIGHT = BRICKSIZE * HEIGHT;

		GRID_WIDTH = WIDTH * BRICKSIZE;
		GRID_HEIGHT = HEIGHT * BRICKSIZE;

		GRAPHIC_FONT = "Verdana";
		GRAPHIC_MENU_FONTSIZE = BRICKSIZE * 0.75;
		GRAPHIC_MENUDESC_FONTSIZE = BRICKSIZE;
		GRAPHIC_MENU_DISTANCE = GRAPHIC_MENU_FONTSIZE * 1.5;
		GRAPHIC_BOARD_FONTSIZE = BRICKSIZE - 5;
		GRAPHIC_SCORE_FONTSIZE = BRICKSIZE;
		WHERE = 1;
		RUNNING = true;
		bricks = [];
		scoreelement = sc;
		setScore(0);
		HOLDINGCOUNT = 0;
		HOLDING = null;
		bricks.push(new Brick({
				ingame : true,
				game : this
			}));
		gameControlDown();

		window.addEventListener("keydown", keyh, false);
		window.addEventListener("keyup", keyup, false);

		ctx = /*document.querySelector("canvas#game")*/
			g.getContext("2d");
		h_ctx = /*document.querySelector("canvas#holding")*/
			h.getContext("2d");
		n_ctx = /*document.querySelector("canvas#next")*/
			n.getContext("2d");
		clearAndResize(ctx);
		graphicControlLoop();
	}
};

TetrisGame.prototype = {
	get bricksform() {
		return this._value;
	},
	set bricksform(val) {
		this._value = val;
	}
};

export default TetrisGame