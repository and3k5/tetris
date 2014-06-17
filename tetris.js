// TETRIS.JS
window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (b) {
	window.setTimeout(b, 1000/60)
};
//document.body.appendChild((ctx = document.createElement("canvas").getContext("2d")).canvas); ;
//var nextRandom = Math.round(Math.random() * (bricksform.length - 1));
// {ingame:false,game:TetrisGame}
function Brick() {
	var o=arguments[0];
	if (o==undefined) {
		o={'ingame':false,'game':null,'bricks':null};
	}
	
	this.game = o.game;
	this.ingame = o.ingame;
	
	/*if (this.ingame) {
		rnd = this.game.nextRandom;
	}*/
	
	var brfrm=this.game.getBricksform();
	var rnd = Math.round(Math.random() * (brfrm.length - 1));
	
	this.color = this.game.getColors()[rnd].copy();
	//this.cn = rnd + 2;
	this.blocks = brfrm[rnd].concat();

	/*if ((o.ingame)&&(game!=null)) {
		//switch (settings_ch[2][2]) {
		//case 0:
		//	this.game.nextRandom = Math.round(Math.random() * (brfrm.length - 1));
		//	break;
		//case 1:
		this.game.nextRandom = (rnd + 1) % brfrm.length;
		//	break;
		//}
	}*/
	this.moving = true;
	this.x = Math.round(((this.game.getWIDTH()) / 2) - (this.blocks[0].length / 2));
	this.y = Math.round(0 - (this.blocks.length));
}
Brick.prototype.checkCollision = function (x, y, brcks) {
	var i,
	i1,
	i2;
	for (i in brcks) {
		for (i1 in brcks[i].blocks) {
			for (i2 in brcks[i].blocks[i1]) {
				if (brcks[i].blocks[i1][i2] == 1) {
					var cond1 = (x == brcks[i].x + parseInt(i2));
					var cond2 = (y == brcks[i].y + parseInt(i1));
					var cond3 = (this != brcks[i]);
					if (cond1 && cond2 && cond3) {
						return false;
					} else {}
				}
			}
		}
	}
	return true;
}
Brick.prototype.getHeight = function () {
	var i1,
	i2,
	height = 0;
	for (i1 in this.blocks) {
		for (i2 in this.blocks[i1]) {
			if (this.blocks[i1][i2] == 1) {
				height = Math.max(height, (parseInt(i1) + 1));
			}
		}
	}
	return height;
}
Brick.prototype.getWidth = function () {
	var i1,
	i2,
	high = 0,
	low = (this.game.getWIDTH()),
	countrow = 0;
	for (i1 in this.blocks) {
		countrow = 0;
		for (i2 in this.blocks[i1]) {
			if (this.blocks[i1][i2] == 1) {
				high = Math.max(high, (parseInt(i2) + 2));
				low = Math.min(low, (parseInt(i2) + 2));
				countrow++;
			}
		}
	}
	return (high - low) + 1;
}
Brick.prototype.getBlockY = function () {
	var cnt = 0;
	var rtn = 0;
	var i1,
	i2;
	for (i1 in this.blocks) {
		for (i2 in this.blocks[i1]) {
			if (this.blocks[i1][i2] == 0) {
				cnt++;
			}
		}
		if (cnt == this.blocks[0].length) {
			rtn++;
		} else {
			return rtn;
		}
	}

}
Brick.prototype.getBlockX = function () {
	var cnt = 0;
	var rtn = 0;
	for (i = 0; i < 4; i++) {
		cnt = 0;
		for (i1 in this.blocks) {
			if (this.blocks[i1][i] == 0) {
				cnt++;
			}
		}
		if (cnt == this.blocks.length) {
			rtn++;
		} else {
			return rtn;
		}
	}
}

Brick.prototype.rotate = function (way) {
	if (this.game.getRUNNING()) {
		var blocks2 = [];
		var w = this.blocks[0].length;
		var h = this.blocks.length;
		var x,
		y,
		row;
		for (y = 0; y < h; y++) {
			row = [];
			for (x = 0; x < w; x++) {
				row[x] = this.blocks[w - x - 1][y];
			}
			blocks2[y] = row;
		}
		with ({
			okay : function (brick, bl) {
				var i1,
				i2;
				for (i1 in bl) {
					for (i2 in bl[i1]) {
						if (bl[i1][i2] == 1) {
							if ((brick.checkCollision(brick.x + parseInt(i2), brick.y + parseInt(i1), this.game.bricks) == false) || ((brick.y + Brick.emulate(bl).getHeight()) >= this.game.HEIGHT) || ((brick.x + Brick.emulate(bl).getWidth() + Brick.emulate(bl).getBlockX()) > (this.game.getWIDTH())) || ((brick.x + Brick.emulate(bl).getBlockX()) < 0)) {
								return false;
							}
						}
					}
				}
				return true;
			}
		})
		if (okay(this, blocks2)) {
			//yeah
		} else {
			if (((this.x + Brick.emulate(blocks2).getWidth() + Brick.emulate(blocks2).getBlockX()) > (this.game.getWIDTH()))) {
				this.x--;
				if (okay(this, blocks2)) {
					// yeah
				} else {
					this.x++;
					return false;
				}
			} else if (((this.x + Brick.emulate(blocks2).getBlockX()) < 0)) {
				this.x++;
				if (okay(this, blocks2)) {
					//yeah
				} else {
					this.x--;
					return false;
				}
			} else {
				return false;
			}
		}

		this.blocks = blocks2;

	}
}
Brick.prototype.moveleft = function () {
	if (this.game.getRUNNING()) {
		playSound("gamemove");
		var i,
		i1,
		i2,
		may_i_fall = true;
		if (this.moving) {
			for (i1 in this.blocks) {
				for (i2 in this.blocks[i1]) {
					if (this.blocks[i1][i2] == 1) {
						if ((this.checkCollision(this.x + parseInt(i2) - 1, this.y + parseInt(i1), this.game.bricks) == false) || ((this.x + this.getBlockX()) <= 0)) {
							may_i_fall = false;
						}
					}
				}
			}
			if (may_i_fall) {
				this.x--;

			}
		}

	}
}
Brick.prototype.moveright = function () {
	if (this.game.getRUNNING()) {
		playSound("gamemove");
		var i,
		i1,
		i2,
		may_i_fall = true;
		if (this.moving) {
			for (i1 in this.blocks) {
				for (i2 in this.blocks[i1]) {
					if (this.blocks[i1][i2] == 1) {
						if ((this.checkCollision(this.x + parseInt(i2) + 1, this.y + parseInt(i1), this.game.bricks) == false) || ((this.x + this.getWidth() + this.getBlockX()) >= (this.game.getWIDTH()))) {
							may_i_fall = false;
						}
					}
				}
			}
			if (may_i_fall) {
				this.x++;

			}
		}

	}
}
Brick.prototype.smashdown = function () {
	if (this.game.getRUNNING() && this.game.getMAYDROP()) {
		playSound("gamebump");
		this.moving = false;
		this.y = this.getLowestPosition(this.game.bricks);
		if ((this.y + this.getBlockY()) >= 0) {
			var sliced = this.slice_up();
			this.game.bricks.splice(this.findMe(), 1);
			for (i in sliced) {
				this.game.bricks.push(sliced[i])
			}
			checkLines();
			this.game.bricks.push(new Brick(0));

			HOLDINGCOUNT = 0;
		} else {
			menuNav("gamelose");
			playSound("gamelose");
		}
		MAYDROP = false;

	}
}
Brick.prototype.movedown = function () {
	if (this.game.getRUNNING()) {
		var i,
		i1,
		i2,
		may_i_fall = true;
		if (this.moving) {
			for (i1 in this.blocks) {
				for (i2 in this.blocks[i1]) {
					if (this.blocks[i1][i2] == 1) {
						if ((this.checkCollision(this.x + parseInt(i2), this.y + parseInt(i1) + 1, this.game.bricks) == false) || ((this.y + this.getHeight()) >= this.game.HEIGHT)) {
							may_i_fall = false;
						}
					}
				}
			}
			if (may_i_fall) {
				this.y++;

			} else {
				this.moving = false;
				playSound("gamebump");
				if ((this.y + this.getBlockY()) >= 0) {
					var sliced = this.slice_up();
					this.game.bricks.splice(this.findMe(), 1);
					for (i in sliced) {
						this.game.bricks.push(sliced[i]);
					}
					checkLines();
					this.game.bricks.push(new Brick(0));
					HOLDINGCOUNT = 0;
				} else {
					menuNav("gamelose");
					playSound("gamelose");
				}
			}
		}

	}
}
Brick.prototype.getLowestPosition = function (br) {
	var h = this.getHeight();
	var this_x = this.x,
	this_y = this.y,
	i1,
	i2;
	var stillgood = true,
	isgood = true;
	while ((stillgood)) {
		isgood = true;
		for (i1 in this.blocks) {
			for (i2 in this.blocks[i1]) {
				if (this.blocks[i1][i2] == 1) {
					if ((this.checkCollision(this_x + parseInt(i2), this_y + parseInt(i1), br) == false) || ((this_y + h) > this.game.HEIGHT)) {
						isgood = false;
					} else {}
				}
			}
		}
		if (isgood == true) {
			this_y++;
		} else {
			stillgood = false;
		}
	}
	return this_y - 1;
}
Brick.prototype.slice_up = function () {
	var rtn = [];
	var i,
	i1,
	i2;
	var this_color = this.color;
	for (i1 in this.blocks) {
		for (i2 in this.blocks[i1]) {
			if (this.blocks[i1][i2] == 1) {
				rtn.push((function (x, y) {
						var tmp = new Brick();
						tmp.moving = false;
						tmp.blocks = [[1]];
						tmp.color = this_color;
						tmp.x = x;
						tmp.y = y;
						return tmp;
					})(parseInt(i2) + this.x, parseInt(i1) + this.y));
			}
		}
	}
	return rtn;
}
Brick.prototype.findMe = function () {
	for (i in this.game.bricks) {
		if (this.game.bricks[i] == this) {
			return i;
		}
	}
	return -1;
}

Brick.emulate = function (vblocks) {
	var tmp = new Brick();
	tmp.moving = false;
	tmp.blocks = vblocks;
	return tmp;
}

function TetrisGame() {
	var WIDTH, 						// [number] Bricks x count
		HEIGHT, 					// [number] Bricks y count
		BRICKSIZE, 					// [number] Size of a brick (in pixels)
		GRID_WIDTH, 				// [number] Width of grid
		GRID_HEIGHT, 				// [number] Height of grid
		gameX, 						// [number] gamex position (soon to be deleted)
		gameY,						// [number] gamey position (soon to be deleted)
		CANVAS_WIDTH, 				// [number] canvas width (soon to be deleted)
		CANVAS_HEIGHT,				// [number] canvas height (soon to be deleted)
		FPS = 0,					// [number] FPS counter
		GRAPHIC_FONT,				// [string] Font name
		GRAPHIC_MENU_FONTSIZE,		// [number] Menu font size
		GRAPHIC_MENUDESC_FONTSIZE,	// [number] Menu subtext font size
		GRAPHIC_MENU_DISTANCE, 		// [number] Menu ???
		GRAPHIC_BOARD_FONTSIZE, 	// [number] Board font size
		GRAPHIC_SCORE_FONTSIZE,		// [number] Score font size
		RUNNING=true,				// [bool] running
		ctx,						// [Graphic Context] Game 2d context
		h_ctx,						// [Graphic Context] Game holding brick 2d context
		n_ctx,						// [Graphic Context] Game next brick 2d context
		WHERE=-1,					// [number] Current showing screen
										// 0 = menu
										// 1 = ingame
										// 2 = paused
										// 3 = tutorial
										// 4 = about
										// 5 = lost game
										// 6 = Settings
		FROM=0,						// [number] Unused (might be removed)
		webAudioApiFailed = 0,		// [number/bool] If webaudio doesnt work, then skip download
		SELECTED_MENU = 0,			// [number] Selected menu item
		HOLDING = null,				// [Brick] current holding brick
		HOLDINGCOUNT = 0,			// count of holding
		MAYDROP = true,				// Fix to avoid Space to repeat keydown events
		SCORE=0,
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
	
	this.nextRandom = Math.round(Math.random() * (bricksform.length - 1));
	
	Object.defineProperties(this,{
		"bricks": {
			get: function () {
				return bricks;
			},
			set: function (v) {
				if ((v=="")&&(typeof([])=="object")) {
					SCORE = 0;
					HOLDINGCOUNT = 0;
					HOLDING = null;
					bricks = [];
				}else{
					console.log("nein");
				}
			}
		},
		"WIDTH": {
			get: function () {
				return WIDTH;
			},
			set: function (v) {
				console.log("nein");
			}
		},
		"HEIGHT": {
			get: function () {
				return HEIGHT;
			},
			set: function (v) {
				console.log("nein");
			}
		}
	});
	
	this.getBricksform=function () { return bricksform; };
	this.getColors=function () { return colors; };
	this.getMAYDROP=function () { return MAYDROP; };
	this.getRUNNING = function () { return RUNNING; };
	this.getWIDTH = function () { return WIDTH; };
	this.bricksform = bricksform;
	
	function checkXY(x, y) {
		var i,
		i1,
		i2;
		for (i in bricks) {
			for (i1 in bricks[i].blocks) {
				for (i2 in bricks[i].blocks[i1]) {
					if (bricks[i].blocks[i1][i2] == 1) {
						var cond1 = (x == bricks[i].x + parseInt(i2));
						var cond2 = (y == bricks[i].y + parseInt(i1));
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
			SCORE++;
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
	function checkLines() {
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
					clearLine(i);
					setTimeout(arguments.callee, 0);
					return 0;
				}
			}
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
	function holdingShift() {
		if (HOLDINGCOUNT < 1) {
			if (HOLDING == null) {
				HOLDING = getMovingBrick();
				bricks[getMovingBrick().findMe()] = new Brick(0);
				HOLDINGCOUNT++;
			} else {
				var HOLDING2 = HOLDING;
				HOLDING = getMovingBrick();
				var tmp = new Brick();
				HOLDING2.x = tmp.x;
				HOLDING2.y = tmp.y;
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
		h_ctx.canvas.width=BRICKSIZE*4;
		h_ctx.canvas.height=BRICKSIZE*4;
		
		n_ctx.clearRect(0, 0, n_ctx.canvas.width, n_ctx.canvas.height);
		n_ctx.canvas.width=BRICKSIZE*4;
		n_ctx.canvas.height=BRICKSIZE*4;
	}
	function tiles(ctx) {
		// Grid
		var ix = 0,
		iy = 0;
		ctx.lineWidth = 1;
		ctx.strokeStyle = "rgba(0,255,0,0.5)";
		ctx.fillStyle = "white";
		for (ix = 0; ix <= (GRID_WIDTH); ix += BRICKSIZE) {
			ctx.beginPath();
			ctx.lineTo(gameX + ix, gameY);
			ctx.lineTo(gameX + ix, gameY + (GRID_HEIGHT));
			ctx.closePath();
			ctx.stroke();
		}
		for (iy = 0; iy <= (GRID_HEIGHT); iy += BRICKSIZE) {
			ctx.beginPath();
			ctx.lineTo(gameX, gameY + iy);
			ctx.lineTo(gameX + (GRID_WIDTH), gameY + iy);
			ctx.closePath();
			ctx.stroke();
		}
		// NextBox field
		
		n_ctx.lineWidth = 1;
		n_ctx.strokeStyle = "rgba(0,255,0,0.5)";
		n_ctx.fillStyle = "white";
		n_ctx.font = GRAPHIC_SCORE_FONTSIZE + "px " + GRAPHIC_FONT;
		//n_ctx.fillText("Score: " + SCORE, (CANVAS_WIDTH / 2), 20);
		var nextBrickW = BRICKSIZE * 4;
		var nextBrickH = BRICKSIZE * 4;
		var nextBrickX = 0;//gameX + GRID_WIDTH;
		var nextBrickY = 0;//gameY;
		n_ctx.font = GRAPHIC_BOARD_FONTSIZE + "px " + GRAPHIC_FONT;
		n_ctx.fillText("Next: ", nextBrickX + (n_ctx.measureText("N").width / 2), nextBrickY + (GRAPHIC_BOARD_FONTSIZE + 2));
		n_ctx.strokeRect(nextBrickX, nextBrickY, nextBrickW, nextBrickH);
		var i1,
		i2;
		var BRICKSIZEDIV = 1.5;
		for (i1 in bricksform[nextRandom]) {
			for (i2 in bricksform[nextRandom][i1]) {
				if (bricksform[nextRandom][i1][i2] == 1) {
					makeBrick(n_ctx, nextBrickX + (parseInt(i2) * (BRICKSIZE / BRICKSIZEDIV)) + ((nextBrickW / 2) - ((Brick.emulate(bricksform[nextRandom]).getWidth() / 2) * (BRICKSIZE / BRICKSIZEDIV))), nextBrickY + (parseInt(i1) * (BRICKSIZE / BRICKSIZEDIV)) + ((nextBrickH / 2) - ((Brick.emulate(bricksform[nextRandom]).getHeight() / 2) * (BRICKSIZE / BRICKSIZEDIV))), BRICKSIZE / BRICKSIZEDIV, BRICKSIZE / BRICKSIZEDIV, colors[nextRandom]);
				}
			}
		}
		// HoldingField
		h_ctx.lineWidth = 1;
		h_ctx.strokeStyle = "rgba(0,255,0,0.5)";
		h_ctx.fillStyle = "white";
		var nextBrickW = BRICKSIZE * 4;
		var nextBrickH = BRICKSIZE * 4;
		var nextBrickX = 0;//gameX - nextBrickW; ;
		var nextBrickY = 0;//gameY;
		h_ctx.font = GRAPHIC_BOARD_FONTSIZE + "px " + GRAPHIC_FONT;
		h_ctx.fillText("Hold: ", nextBrickX + (h_ctx.measureText("H").width / 2), nextBrickY + (GRAPHIC_BOARD_FONTSIZE + 2));
		h_ctx.strokeRect(nextBrickX, nextBrickY, nextBrickW, nextBrickH);
		var i1,
		i2;
		var BRICKSIZEDIV = 1.5;
		if (HOLDING != null) {
			for (i1 in HOLDING.blocks) {
				for (i2 in HOLDING.blocks[i1]) {
					if (HOLDING.blocks[i1][i2] == 1) {
						makeBrick(h_ctx, nextBrickX + (parseInt(i2) * (BRICKSIZE / BRICKSIZEDIV)) + ((nextBrickW / 2) - ((Brick.emulate(HOLDING.blocks).getWidth() / 2) * (BRICKSIZE / BRICKSIZEDIV))), nextBrickY + (parseInt(i1) * (BRICKSIZE / BRICKSIZEDIV)) + ((nextBrickH / 2) - ((Brick.emulate(HOLDING.blocks).getHeight() / 2) * (BRICKSIZE / BRICKSIZEDIV))), BRICKSIZE / BRICKSIZEDIV, BRICKSIZE / BRICKSIZEDIV, HOLDING.color);
					}
				}
			}
		}
	}
	function inGameGraphic(ctx) {
		clearAndResize(ctx);
		tiles(ctx);
		var i,
		i1,
		i2;
		for (i in bricks) {
			if (settings_ch[1][2] == 1) {
				if (bricks[i].moving) {
					//ctx.fillStyle="rgba(255,255,255,0.5)";
					var tmp_lowestPos = bricks[i].getLowestPosition(bricks);
					for (i1 in bricks[i].blocks) {
						for (i2 in bricks[i].blocks[i1]) {
							if (bricks[i].blocks[i1][i2] == 1) {
								if ((((tmp_lowestPos * BRICKSIZE) + (parseInt(i1) * BRICKSIZE)) >= 0) && (((bricks[i].y * BRICKSIZE) + (parseInt(i1) * BRICKSIZE)) <= (GRID_HEIGHT))) {
									makeBrick(ctx, gameX + (bricks[i].x * BRICKSIZE) + (parseInt(i2) * BRICKSIZE), gameY + (tmp_lowestPos * BRICKSIZE) + (parseInt(i1) * BRICKSIZE), BRICKSIZE, BRICKSIZE, new Color(255, 255, 255, 0.2));
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
							makeBrick(ctx, gameX + (bricks[i].x * BRICKSIZE) + (parseInt(i2) * BRICKSIZE), gameY + (bricks[i].y * BRICKSIZE) + (parseInt(i1) * BRICKSIZE), BRICKSIZE, BRICKSIZE, bricks[i].color);
						}
					}
				}
			}

		}

	}

	function getMovingBrick() {
		var i;
		for (i in bricks) {
			if (bricks[i].moving) {
				return bricks[i];
			}
		}
	}
	var GAMECONTROLDOWN = false;
	var MOVESPEED=1000;
	function gameControlDown() {
		if (GAMECONTROLDOWN == false) {
			(function () {
				GAMECONTROLDOWN = true;
				if (WHERE == 1) {
					getMovingBrick().movedown();
					setTimeout(arguments.callee, MOVESPEED);
				} else {
					GAMECONTROLDOWN = false;
				}
			})();
		}
	}
	function keyh(e) {
		switch (e.keyCode) {
		case 37:
			// left arrow
			e.preventDefault();
			if (WHERE == 1) {
				// ingame
				getMovingBrick().moveleft();
			} else if ((WHERE == 0) || (WHERE == 2) || (WHERE == 5)) {
				// in a menu
				menuup();
			} else if (WHERE == 6) {
				// Settings
				menutoggleleft();
			} else if ((WHERE == 3) || (WHERE == 4)) {
				// tutorial or about
				menuNav("menu");
				playSound("menuback");
			}
			break;
		case 38:
			// up arrow
			e.preventDefault();
			if (WHERE == 1) {
				// ingame
				getMovingBrick().rotate();
			} else if ((WHERE == 0) || (WHERE == 2) || (WHERE == 5) || (WHERE == 6)) {
				// in a menu
				menuup();
			} else if ((WHERE == 3) || (WHERE == 4)) {
				// tutorial or about
				menuNav("menu");
				playSound("menuback");
			}
			break;
		case 39:
			// right arrow
			e.preventDefault();
			if (WHERE == 1) {
				// ingame
				getMovingBrick().moveright();
			} else if ((WHERE == 0) || (WHERE == 2) || (WHERE == 5)) {
				// in a menu
				menudown();
			} else if (WHERE == 6) {
				// Settings
				menutoggleright();
			} else if ((WHERE == 3) || (WHERE == 4)) {
				// tutorial or about
				menuNav("menu");
				playSound("menuback");

			}
			break;
		case 40:
			//down arrow
			e.preventDefault();
			if (WHERE == 1) {
				// ingame
				getMovingBrick().movedown();
			} else if ((WHERE == 0) || (WHERE == 2) || (WHERE == 5) || (WHERE == 6)) {
				// in a menu
				menudown();
			} else if ((WHERE == 3) || (WHERE == 4)) {
				// tutorial or about
				menuNav("menu");
				playSound("menuback");

			}
			break;
		case 32:
			//space
			e.preventDefault();
			if (WHERE == 1) {
				// ingame
				getMovingBrick().smashdown();
			} else if ((WHERE == 3) || (WHERE == 4)) {
				// tutorial or about
				menuNav("menu");
				playSound("menuback");

			}
			break;
		case 27:
			// escape
			e.preventDefault();
			if (WHERE == 1) {
				// ingame
				menuNav("paused");
				playSound("menuback");
			} else if ((WHERE == 3) || (WHERE == 4)) {
				// tutorial, about or settings
				menuNav("menu");
				playSound("menuback");
			} else if (WHERE == 6) {
				WHERE = FROM;
				playSound("menuback");
			}
			break;
		case 13:
			// enter
			e.preventDefault();
			if ((WHERE == 0) || (WHERE == 2) || (WHERE == 5)) {
				menuselect();
			} else if ((WHERE == 3) || (WHERE == 4)) {
				menuNav("menu");
				playSound("menuback");

			}
			break;
		case 16:
			// shift
			e.preventDefault();
			if ((WHERE == 1)) {
				holdingShift();
			}
			break;
		default:
			// not defined in this..
			//console.log("Key pressed: ",e.keyCode);
			break;
		}
	}
	function keyup(e) {
		switch (e.keyCode) {
		case 32:
			//space
			MAYDROP = true;
			break;
		}
	}
	function graphicControlLoop() {
		// CTX GRAPHICS
		requestAnimFrame(arguments.callee);
		(function gameLoop() {
			var thisLoop = new Date;
			var fps = 1000 / (thisLoop - lastLoop);
			lastLoop = thisLoop;
			xF++;
			if (xF % 10 == 0) {
				F = fps;
			}

		})();

		switch (WHERE) {
		case  - 1:
			// loading..
			loadingGraphic(ctx);
			break;
		case 0:
			// menu
			//menuGraphic();
			allMenuGraphic(ctx);
			break;
		case 1:
			// ingame
			inGameGraphic(ctx);
			break;
		case 2:
			// game paused
			allMenuGraphic(ctx);
			break;
		case 3:
			// Tutorial
			tutorialGraphic(ctx);
			break;
		case 4:
			// About
			aboutGraphic(ctx);
			break;
		case 5:
			// Lost game
			allMenuGraphic(ctx);
			break;
		case 6:
			allMenuGraphic(ctx);
			break;
		default:
			break;
		}
		ctx.fillStyle = "white";
		ctx.font = "8px Verdana";
		ctx.fillText(Math.round(F * 10) / 10, 10, 10);
	};
	this.init = function () { 
		function initVars() {
			WIDTH = 10;
			HEIGHT = 20;
			BRICKSIZE=30;

			CANVAS_WIDTH = BRICKSIZE * WIDTH;
			CANVAS_HEIGHT = BRICKSIZE * HEIGHT;

			GRID_WIDTH = WIDTH * BRICKSIZE;
			GRID_HEIGHT = HEIGHT * BRICKSIZE;
			gameX = 0;
			gameY = 0;

			
			GRAPHIC_FONT = "Verdana"
				GRAPHIC_MENU_FONTSIZE = BRICKSIZE * 0.75;
			GRAPHIC_MENUDESC_FONTSIZE = BRICKSIZE;
			GRAPHIC_MENU_DISTANCE = GRAPHIC_MENU_FONTSIZE * 1.5;
			GRAPHIC_BOARD_FONTSIZE = BRICKSIZE - 5;
			GRAPHIC_SCORE_FONTSIZE = BRICKSIZE;
		}

		initVars();
		
		window.addEventListener("load",function () {
			window.addEventListener("keydown", keyh, false);
			window.addEventListener("keyup", keyup, false);
			window.addEventListener("mousemove", mouseMove, false);
			window.addEventListener("mousedown", mouseDown, false);

			//setInterval("resizeC()",1500);


			// executing

			ctx = document.querySelector("canvas#game").getContext("2d");
			h_ctx = document.querySelector("canvas#holding").getContext("2d");
			n_ctx = document.querySelector("canvas#next").getContext("2d");
			
			graphicControlLoop();
			
		},false);
		
		WHERE = 1;
		RUNNING = true;
		bricks = [];
		SCORE = 0;
		HOLDINGCOUNT = 0;
		HOLDING = null;
		bricks.push(new Brick({ingame:true,game:this}));
		gameControlDown();
		
	}
};

TetrisGame.prototype = {
    get bricksform(){
        return this._value;
    },
    set bricksform(val){
        this._value = val;
    }
};