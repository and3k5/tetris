// TETRIS.JS
window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (b) {
	window.setTimeout(b, 1E3 / 60)
};

var ctx;
document.body.appendChild((ctx = document.createElement("canvas").getContext("2d")).canvas); ;

var FPS = 0;

var WIDTH, HEIGHT, BRICKSIZE, GRID_WIDTH, GRID_HEIGHT, gameX, gameY, CANVAS_WIDTH, CANVAS_HEIGHT, GRAPHIC_FONT, GRAPHIC_MENU_FONTSIZE, GRAPHIC_MENUDESC_FONTSIZE,
GRAPHIC_MENU_DISTANCE, GRAPHIC_BOARD_FONTSIZE, GRAPHIC_SCORE_FONTSIZE, LOGOWIDTH, LOGOHEIGHT, LOGOX, LOGOY;

// Game canvas size variables
/*function initVars() {
WIDTH=10;
HEIGHT=20;
BRICKSIZE=(function(){if(arguments[0]!=undefined){return arguments[0];}else{return 20;}})(arguments[0]);
GRID_WIDTH=WIDTH*BRICKSIZE;
GRID_HEIGHT=HEIGHT*BRICKSIZE;
gameX=((GRID_WIDTH)/2);
gameY=((GRID_HEIGHT)/4);
CANVAS_WIDTH=(GRID_WIDTH)*2;
CANVAS_HEIGHT=(GRID_HEIGHT)*1.5;
GRAPHIC_FONT="Verdana"
GRAPHIC_MENU_FONTSIZE=BRICKSIZE*1.25;
GRAPHIC_MENUDESC_FONTSIZE=BRICKSIZE;
GRAPHIC_MENU_DISTANCE=GRAPHIC_MENU_FONTSIZE*1.5;
GRAPHIC_BOARD_FONTSIZE=BRICKSIZE-5;
GRAPHIC_SCORE_FONTSIZE=BRICKSIZE;
LOGOWIDTH=(CANVAS_WIDTH)-20;
LOGOHEIGHT=LOGOWIDTH/4.125;
LOGOX=10;
LOGOY=20;
}*/

function initVars() {
	WIDTH = 10;
	HEIGHT = 20;
	//BRICKSIZE=(function(){if(arguments[0]!=undefined){return arguments[0];}else{return 20;}})(arguments[0]);


	CANVAS_WIDTH = window.innerWidth; ;
	CANVAS_HEIGHT = window.innerHeight;

	if (window.innerWidth > window.innerHeight) {
		// upper- and lowermargin = 20px
		// divide by amount of rows (20 - HEIGHT)
		BRICKSIZE = ((window.innerHeight - 40) / HEIGHT)
	} else {}

	GRID_WIDTH = WIDTH * BRICKSIZE;
	GRID_HEIGHT = HEIGHT * BRICKSIZE;
	gameX = (CANVAS_WIDTH / 2) - (GRID_WIDTH / 2)
	gameY = 20;

	GRAPHIC_FONT = "Verdana"
		GRAPHIC_MENU_FONTSIZE = BRICKSIZE * 0.75;
	GRAPHIC_MENUDESC_FONTSIZE = BRICKSIZE;
	GRAPHIC_MENU_DISTANCE = GRAPHIC_MENU_FONTSIZE * 1.5;
	GRAPHIC_BOARD_FONTSIZE = BRICKSIZE - 5;
	GRAPHIC_SCORE_FONTSIZE = BRICKSIZE;
	LOGOWIDTH = GRID_WIDTH;
	LOGOHEIGHT = LOGOWIDTH / 4.125;
	LOGOX = gameX;
	LOGOY = gameY;
}

initVars();
function testBrickSize(minus) {
	var test_BRICKSIZE = BRICKSIZE - minus;
	var test_GRID_WIDTH = WIDTH * test_BRICKSIZE;
	var test_GRID_HEIGHT = HEIGHT * test_BRICKSIZE;
	var test_CANVAS_WIDTH = (test_GRID_WIDTH) * 2;
	var test_CANVAS_HEIGHT = (test_GRID_HEIGHT) * 1.5;
	var tableSize = 23.8;
	if (test_CANVAS_HEIGHT > window.innerHeight - (tableSize * 2)) {
		return false;
	} else {
		return true;
	}
}

/*function updateScreenTest() {
if ((CANVAS_HEIGHT>window.innerHeight)||(window.innerHeight-CANVAS_HEIGHT>40)) {
var mn=0-(BRICKSIZE-1);
while ((testBrickSize(mn)==false)&&(mn<(BRICKSIZE-1))) {
mn++;
}
return mn;
}
return 0;
}*/

/*function resizeC() {
if ((CANVAS_HEIGHT>window.innerHeight)||(window.innerHeight-CANVAS_HEIGHT>40)) {
BRICKSIZE-=updateScreenTest();
initVars(BRICKSIZE);
}
}*/

var WHERE = -1;
var FROM = 0;
var webAudioApiFailed = 0; // If webaudio doesnt work, then skip download
// 0 = menu
// 1 = ingame
// 2 = paused
// 3 = tutorial
// 4 = about
// 5 = lost game
// 6 = Settings
var pause = false;
var SCORE = 0;
var bricks = [];
var bricksform = [
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
];
var tetrislogo = [[55, 10], [50, 0], [0, 0], [5, 10], [20, 10], [35, 40], [50, 40], [35, 10], [55, 10], [70, 10], [75, 20], [50, 20], [75, 20], [80, 30], [55, 30], [80, 30], [85, 40], [50, 40], [35, 10], [55, 10], [50, 0], [100, 0], [105, 10], [85, 10], [100, 40], [85, 40], [110, 40], [103, 30], [110, 40], [120, 40], [108, 25], [112, 25], [105, 10], [100, 0], [115, 0], [120, 10], [100, 10], [120, 10], [120, 10], [135, 40], [120, 40], [105, 10], [120, 10], [115, 0], [145, 0], [152, 15], [132, 15], [152, 15], [165, 40], [135, 40], [130, 30], [150, 30]];
var tetrislogo2 = [[0, 0], [145, 0], [165, 40], [35, 40], [20, 10], [5, 10]];
var SELECTED_MENU = 0;
var HOLDING = null;
var HOLDINGCOUNT = 0;
var MAYDROP = true;
var colors = [new Color(255, 0, 0, 1), new Color(0, 255, 0, 1), new Color(0, 0, 255, 1), new Color(255, 255, 0, 1), new Color(0, 255, 255, 1), new Color(255, 0, 255, 1), new Color(0, 128, 128, 1)]
function emulateBrick(vblocks) {
	var tmp = new Brick();
	tmp.moving = false;
	tmp.blocks = vblocks;
	return tmp;
}
function Color(r, g, b, a) {
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;
	var dis = this;
	this.add = function (_r, _g, _b, _a) {
		return (new Color(Math.min(255, (dis.r + _r)), dis.g + _g, dis.b + _b, dis.a + _a))
	}
	this.toRGBAString = function () {
		return "rgba(" + parseInt(dis.r) + "," + parseInt(dis.g) + "," + parseInt(dis.b) + "," + parseFloat(dis.a) + ")";
	}
	this.copy = function () {
		return new Color(dis.r, dis.g, dis.b, dis.a);
	}
}

var nextRandom = Math.round(Math.random() * (bricksform.length - 1));
function Brick() {
	var rnd = Math.round(Math.random() * (bricksform.length - 1));
	if (arguments[0] != undefined) {
		rnd = nextRandom;
	}
	this.color = colors[rnd].copy();
	this.cn = rnd + 2;
	this.blocks = bricksform[rnd].concat();
	if (arguments[0] != undefined) {
		switch (settings_ch[2][2]) {
		case 0:
			nextRandom = Math.round(Math.random() * (bricksform.length - 1));
			break;
		case 1:
			nextRandom = (rnd + 1) % bricksform.length;
			break;
		}
	}
	this.moving = true;
	this.x = Math.round((WIDTH / 2) - (this.blocks[0].length / 2));
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
	low = WIDTH,
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
	if (WHERE == 1) {
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
							if ((brick.checkCollision(brick.x + parseInt(i2), brick.y + parseInt(i1), bricks) == false) || ((brick.y + emulateBrick(bl).getHeight()) >= HEIGHT) || ((brick.x + emulateBrick(bl).getWidth() + emulateBrick(bl).getBlockX()) > WIDTH) || ((brick.x + emulateBrick(bl).getBlockX()) < 0)) {
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
			if (((this.x + emulateBrick(blocks2).getWidth() + emulateBrick(blocks2).getBlockX()) > WIDTH)) {
				this.x--;
				if (okay(this, blocks2)) {
					// yeah
				} else {
					this.x++;
					return false;
				}
			} else if (((this.x + emulateBrick(blocks2).getBlockX()) < 0)) {
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
	if (WHERE == 1) {
		playSound("gamemove");
		var i,
		i1,
		i2,
		may_i_fall = true;
		if (this.moving) {
			for (i1 in this.blocks) {
				for (i2 in this.blocks[i1]) {
					if (this.blocks[i1][i2] == 1) {
						if ((this.checkCollision(this.x + parseInt(i2) - 1, this.y + parseInt(i1), bricks) == false) || ((this.x + this.getBlockX()) <= 0)) {
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
	if (WHERE == 1) {
		playSound("gamemove");
		var i,
		i1,
		i2,
		may_i_fall = true;
		if (this.moving) {
			for (i1 in this.blocks) {
				for (i2 in this.blocks[i1]) {
					if (this.blocks[i1][i2] == 1) {
						if ((this.checkCollision(this.x + parseInt(i2) + 1, this.y + parseInt(i1), bricks) == false) || ((this.x + this.getWidth() + this.getBlockX()) >= WIDTH)) {
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
	if ((WHERE == 1) && (MAYDROP == true)) {
		playSound("gamebump");
		this.moving = false;
		this.y = this.getLowestPosition(bricks);
		if ((this.y + this.getBlockY()) >= 0) {
			var sliced = this.slice_up();
			bricks.splice(this.findMe(), 1);
			for (i in sliced) {
				bricks.push(sliced[i])
			}
			checkLines();
			bricks.push(new Brick(0));

			HOLDINGCOUNT = 0;
		} else {
			menuNav("gamelose");
			playSound("gamelose");
		}
		MAYDROP = false;

	}
}
Brick.prototype.movedown = function () {
	if (WHERE == 1) {
		var i,
		i1,
		i2,
		may_i_fall = true;
		if (this.moving) {
			for (i1 in this.blocks) {
				for (i2 in this.blocks[i1]) {
					if (this.blocks[i1][i2] == 1) {
						if ((this.checkCollision(this.x + parseInt(i2), this.y + parseInt(i1) + 1, bricks) == false) || ((this.y + this.getHeight()) >= HEIGHT)) {
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
					bricks.splice(this.findMe(), 1);
					for (i in sliced) {
						bricks.push(sliced[i]);
					}
					checkLines();
					bricks.push(new Brick(0));
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
					if ((this.checkCollision(this_x + parseInt(i2), this_y + parseInt(i1), br) == false) || ((this_y + h) > HEIGHT)) {
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
	for (i in bricks) {
		if (bricks[i] == this) {
			return i;
		}
	}
	return -1;
}

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
	if (WHERE == 1) {
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
	if (WHERE == 1) {
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
	if (ctx.canvas.width != window.innerWidth) {
		ctx.canvas.width = window.innerWidth;
	}
	if (ctx.canvas.height != window.innerHeight) {
		ctx.canvas.height = window.innerHeight;
	}
	/*if (ctx.canvas.width!=CANVAS_WIDTH) {
	ctx.canvas.width=CANVAS_WIDTH;
	}
	if (ctx.canvas.height!=CANVAS_HEIGHT) {
	ctx.canvas.height=CANVAS_HEIGHT;
	}*/
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
	for (iy = 0; iy < (GRID_HEIGHT); iy += BRICKSIZE) {
		ctx.beginPath();
		ctx.lineTo(gameX, gameY + iy);
		ctx.lineTo(gameX + (GRID_WIDTH), gameY + iy);
		ctx.closePath();
		ctx.stroke();
	}
	// NextBox field
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba(0,255,0,0.5)";
	ctx.fillStyle = "white";
	ctx.font = GRAPHIC_SCORE_FONTSIZE + "px " + GRAPHIC_FONT;
	ctx.fillText("Score: " + SCORE, (CANVAS_WIDTH / 2), 20);
	var nextBrickW = BRICKSIZE * 4;
	var nextBrickH = BRICKSIZE * 4;
	var nextBrickX = gameX + GRID_WIDTH;
	var nextBrickY = gameY;
	ctx.font = GRAPHIC_BOARD_FONTSIZE + "px " + GRAPHIC_FONT;
	ctx.fillText("Next: ", nextBrickX + (ctx.measureText("N").width / 2), nextBrickY + (GRAPHIC_BOARD_FONTSIZE + 2));
	ctx.strokeRect(nextBrickX, nextBrickY, nextBrickW, nextBrickH);
	var i1,
	i2;
	var BRICKSIZEDIV = 1.5;
	for (i1 in bricksform[nextRandom]) {
		for (i2 in bricksform[nextRandom][i1]) {
			if (bricksform[nextRandom][i1][i2] == 1) {
				makeBrick(ctx, nextBrickX + (parseInt(i2) * (BRICKSIZE / BRICKSIZEDIV)) + ((nextBrickW / 2) - ((emulateBrick(bricksform[nextRandom]).getWidth() / 2) * (BRICKSIZE / BRICKSIZEDIV))), nextBrickY + (parseInt(i1) * (BRICKSIZE / BRICKSIZEDIV)) + ((nextBrickH / 2) - ((emulateBrick(bricksform[nextRandom]).getHeight() / 2) * (BRICKSIZE / BRICKSIZEDIV))), BRICKSIZE / BRICKSIZEDIV, BRICKSIZE / BRICKSIZEDIV, colors[nextRandom]);
			}
		}
	}
	// HoldingField
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba(0,255,0,0.5)";
	ctx.fillStyle = "white";
	var nextBrickW = BRICKSIZE * 4;
	var nextBrickH = BRICKSIZE * 4;
	var nextBrickX = gameX - nextBrickW; ;
	var nextBrickY = gameY;
	ctx.font = GRAPHIC_BOARD_FONTSIZE + "px " + GRAPHIC_FONT;
	ctx.fillText("Hold: ", nextBrickX + (ctx.measureText("H").width / 2), nextBrickY + (GRAPHIC_BOARD_FONTSIZE + 2));
	ctx.strokeRect(nextBrickX, nextBrickY, nextBrickW, nextBrickH);
	var i1,
	i2;
	var BRICKSIZEDIV = 1.5;
	if (HOLDING != null) {
		for (i1 in HOLDING.blocks) {
			for (i2 in HOLDING.blocks[i1]) {
				if (HOLDING.blocks[i1][i2] == 1) {
					makeBrick(ctx, nextBrickX + (parseInt(i2) * (BRICKSIZE / BRICKSIZEDIV)) + ((nextBrickW / 2) - ((emulateBrick(HOLDING.blocks).getWidth() / 2) * (BRICKSIZE / BRICKSIZEDIV))), nextBrickY + (parseInt(i1) * (BRICKSIZE / BRICKSIZEDIV)) + ((nextBrickH / 2) - ((emulateBrick(HOLDING.blocks).getHeight() / 2) * (BRICKSIZE / BRICKSIZEDIV))), BRICKSIZE / BRICKSIZEDIV, BRICKSIZE / BRICKSIZEDIV, HOLDING.color);
				}
			}
		}
	}
}
function inGameGraphic() {
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

function Menu(headline, menus) {
	this.headline = headline;
	this.menus = menus;
}

// Initial Menu
var menu =
	[["Play game!", "newgame"],
	["Settings", "settings"],
	["Tutorial", "tutorial"],
	["About", "about"]];
// Pause menu
var pause_menu =
	[["Resume", "resumegame"],
	["Settings", "settings"],
	["Restart", "newgame"],
	["End game", "menu"]];
// End game menu
var end_menu =
	[["Play again", "newgame"],
	["Back to menu", "menu"]];

var settings_ch = [
	["Sounds", [false, true], 0],
	["Ghost mode", [false, true], 0],
	["Brick mode", ["Random", "Collate"], 0]

];

function menuNav(page) {
	switch (page) {
	case "newgame":
		WHERE = 1;
		bricks = [];
		SCORE = 0;
		HOLDINGCOUNT = 0;
		HOLDING = null;
		bricks.push(new Brick(0));
		gameControlDown();
		break;
	case "resumegame":
		WHERE = 1;
		gameControlDown();
		break;
	case "menu":
		WHERE = 0;
		bricks = [];
		SCORE = 0;
		playMusic("menumusic");
		break;
	case "tutorial":
		WHERE = 3;
		break;
	case "about":
		WHERE = 4;
		break;
	case "paused":
		WHERE = 2;
		break;
	case "gamelose":
		WHERE = 5;
		HOLDINGCOUNT = 0;
		HOLDING = null;
		break;
	case "settings":
		FROM = WHERE;
		WHERE = 6;
		break;
	case "":
		break;
	}
}

var collectedMenu = [menu, 0, pause_menu, 0, 0, end_menu, settings_ch];

function menudown() {
	SELECTED_MENU = (SELECTED_MENU + 1) % collectedMenu[WHERE].length;
	playSound("menuscroll");
}
function menuup() {
	SELECTED_MENU = (((SELECTED_MENU - 1) + collectedMenu[WHERE].length) % collectedMenu[WHERE].length);
	playSound("menuscroll");
}

function menutoggleright() {
	//console.log((collectedMenu[WHERE][SELECTED_MENU][2]),(collectedMenu[WHERE][SELECTED_MENU][1]));
	collectedMenu[WHERE][SELECTED_MENU][2] = (((collectedMenu[WHERE][SELECTED_MENU][2] + 1) + (collectedMenu[WHERE][SELECTED_MENU][1].length)) % collectedMenu[WHERE][SELECTED_MENU][1].length);
	playSound("menuselect");
}

function menutoggleleft() {
	//console.log((collectedMenu[WHERE][SELECTED_MENU][2]),(collectedMenu[WHERE][SELECTED_MENU][1]));
	collectedMenu[WHERE][SELECTED_MENU][2] = (((collectedMenu[WHERE][SELECTED_MENU][2] + 1) + (collectedMenu[WHERE][SELECTED_MENU][1].length)) % collectedMenu[WHERE][SELECTED_MENU][1].length);
	playSound("menuselect");
}

function menuselect() {
	menuNav(collectedMenu[WHERE][SELECTED_MENU][1]);
	playSound("menuselect");
}

function logoGraphic() {
	var radgrad = ctx.createLinearGradient(LOGOX, LOGOY + (LOGOHEIGHT / 2), LOGOX + LOGOWIDTH, LOGOY + (LOGOHEIGHT / 2));
	radgrad.addColorStop(0, 'rgba(128,100,100,1)');
	radgrad.addColorStop(0.2, 'rgba(123,123,123,1)');
	radgrad.addColorStop(1, 'rgba(200,200,200,1)');
	ctx.fillStyle = radgrad;
	ctx.strokeStyle = "white";
	ctx.save();
	ctx.translate((LOGOWIDTH / 2) + LOGOX, (LOGOHEIGHT / 2) + LOGOY);
	ctx.rotate((1 - Math.sin(Date.now() / 100) * 2) * Math.PI / 180);
	ctx.translate( - (LOGOWIDTH / 2) - LOGOX,  - (LOGOHEIGHT / 2) - LOGOY);
	(function (x, y, w, h) {
		// fill
		ctx.beginPath();
		ctx.lineWidth = 2;
		for (i in tetrislogo2) {
			ctx.lineTo(x + ((tetrislogo2[i][0] / 165) * w), y + ((tetrislogo2[i][1] / 40) * h))
		}
		ctx.fill();
		ctx.closePath();
		//165 x 40
		ctx.beginPath();
		ctx.lineWidth = 2;
		for (i in tetrislogo) {
			ctx.lineTo(x + ((tetrislogo[i][0] / 165) * w), y + ((tetrislogo[i][1] / 40) * h))
		}
		ctx.stroke();
		ctx.closePath();

	})(LOGOX, LOGOY, LOGOWIDTH, LOGOHEIGHT);

	ctx.restore();

	// By and3k5
	var byText = "by And3k5";
	var byFontSize = GRAPHIC_MENU_FONTSIZE * 0.60;
	ctx.font = "bold " + byFontSize + "px Verdana";
	var byX = LOGOX + LOGOWIDTH - (ctx.measureText(byText).width);
	var byY = LOGOY + LOGOHEIGHT + byFontSize + BRICKSIZE;
	var byW = byX + (ctx.measureText(byText).width);
	var byH = byY + byFontSize;
	var radgrad = ctx.createLinearGradient(byX, byY, byW, byH);
	radgrad.addColorStop(0, 'rgba(0,0,0,1)');
	radgrad.addColorStop(0.5, 'rgba(123,123,123,1)');
	radgrad.addColorStop(1, 'rgba(0,0,0,1)');
	ctx.fillStyle = radgrad;
	ctx.fillText(byText, byX, byY);
	ctx.lineWidth = 1;
	ctx.strokeText(byText, byX, byY);
}
var fireballs = [];
function Fireball() {
	this.x = Math.random() * CANVAS_WIDTH;
	this.y = Math.random() * CANVAS_HEIGHT;
	this.spd = 0.5 + Math.random() * 2;
}
function updateFireballs() {
	for (i in fireballs) {
		fireballs[i].y -= fireballs[i].spd;
		if (fireballs[i].y < 0) {
			fireballs[i].x = Math.random() * CANVAS_WIDTH;
			fireballs[i].y = CANVAS_HEIGHT;
		}
	}
}
(function () {
	var i;
	for (i = 0; i <= 40; i++) {
		fireballs.push(new Fireball());
	}
})();
function makeFireball(ctx, x, y, w, h, color) {
	var fstyle = ctx.createRadialGradient(x + (w / 2), y + (h / 2), 0, x + (w / 2), y + (h / 2), 10);
	fstyle.addColorStop(0, new Color(255, 255, 255, 1).toRGBAString());
	fstyle.addColorStop(1, new Color(0, 0, 0, 0).toRGBAString());
	ctx.fillStyle = fstyle;
	ctx.fillRect(x, y, w, h);
}
function coolGraphic(ctx) {
	ctx.fillStyle = "rgba(255,255,255,0.1)";
	ctx.strokeStyle = "white";
	ctx.beginPath();
	ctx.arc(10, 10, 300, 0, Math.PI * 2, false);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = "rgba(255,255,255,1)";
	ctx.strokeStyle = "white";
	ctx.beginPath();
	var i;
	for (i in fireballs) {
		makeFireball(ctx, fireballs[i].x, fireballs[i].y, 20, 20);
	}
	ctx.closePath();
	ctx.fill();
	updateFireballs();
}
var SELECTED_MENU_BUFFER = [];
var SELECTED_MENU_BUFFER_CURSOR = 0;
function GET_SELECTED_MENU() {
	var i,
	result = 0;
	for (i = 0; i < SELECTED_MENU_BUFFER.length; i++) {
		result += SELECTED_MENU_BUFFER[i];
	}
	return result / SELECTED_MENU_BUFFER.length;
}
SELECTED_MENU_BUFFER = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
function launchMenuBuffer() {
	// SELECTED MENU BUFFER;
	SELECTED_MENU_BUFFER[SELECTED_MENU_BUFFER_CURSOR] = SELECTED_MENU;
	SELECTED_MENU_BUFFER_CURSOR = (SELECTED_MENU_BUFFER_CURSOR + 1) % SELECTED_MENU_BUFFER.length;
}

function mouseMove(e) {
	var STARTY = LOGOHEIGHT * 2 + LOGOY;
	var y_ = 0;
	y_ += GRAPHIC_MENU_DISTANCE;
	var cMenu = collectedMenu[WHERE];

	for (i in cMenu) {
		var curTextX = (1 - Math.max(0, Math.min(1, Math.abs(i - GET_SELECTED_MENU()))));

		var xStart = gameX;
		var yStart = STARTY + y_ - GRAPHIC_MENU_FONTSIZE;
		var xEnd = xStart + GRID_WIDTH;
		var yEnd = yStart + GRAPHIC_MENU_DISTANCE;

		if (((e.offsetX > xStart) && (e.offsetX < xEnd)) && ((e.offsetY > yStart) && (e.offsetY < yEnd))) {
			if (SELECTED_MENU != parseInt(i)) {
				playSound("menuscroll");
			}
			SELECTED_MENU = parseInt(i);
		}

		y_ += GRAPHIC_MENU_DISTANCE;
	}

}

function mouseDown(e) {
	var STARTY = LOGOHEIGHT * 2 + LOGOY;
	var y_ = 0;
	y_ += GRAPHIC_MENU_DISTANCE;
	var cMenu = collectedMenu[WHERE];

	for (i in cMenu) {
		var curTextX = (1 - Math.max(0, Math.min(1, Math.abs(i - GET_SELECTED_MENU()))));

		var xStart = gameX;
		var yStart = STARTY + y_ - GRAPHIC_MENU_FONTSIZE;
		var xEnd = xStart + GRID_WIDTH;
		var yEnd = yStart + GRAPHIC_MENU_DISTANCE;

		if (((e.offsetX > xStart) && (e.offsetX < xEnd)) && ((e.offsetY > yStart) && (e.offsetY < yEnd))) {
			SELECTED_MENU = parseInt(i);
			menuselect();

		}

		y_ += GRAPHIC_MENU_DISTANCE;
	}

}

function allMenuGraphic() {
	clearAndResize(ctx);
	coolGraphic(ctx);
	ctx.fillStyle = "white";
	ctx.strokeStyle = "white";

	logoGraphic();
	var STARTY = LOGOHEIGHT * 2 + LOGOY;
	var y_ = 0;
	ctx.font = "bold " + GRAPHIC_MENU_FONTSIZE + "px " + GRAPHIC_FONT;
	ctx.fillStyle = "white";
	ctx.fillText("Menu", gameX, STARTY + y_);
	y_ += GRAPHIC_MENU_DISTANCE;
	var cMenu = collectedMenu[WHERE];
	var radgrad = ctx.createLinearGradient(LOGOX + (LOGOWIDTH / 2), STARTY, LOGOX + (LOGOWIDTH / 2), STARTY + (GRAPHIC_MENU_DISTANCE * cMenu.length) + GRAPHIC_MENU_FONTSIZE);
	radgrad.addColorStop(0, 'rgba(123,123,123,1)');
	radgrad.addColorStop(0.5, 'rgba(200,200,200,1)');
	radgrad.addColorStop(1, 'rgba(123,123,123,1)');
	ctx.fillStyle = radgrad;

	ctx.fillRect(gameX, (STARTY - GRAPHIC_MENU_FONTSIZE) + ((GET_SELECTED_MENU() + 1) * GRAPHIC_MENU_DISTANCE), GRID_WIDTH, GRAPHIC_MENU_DISTANCE);

	for (i in cMenu) {
		ctx.font = "bold " + GRAPHIC_MENU_FONTSIZE + "px " + GRAPHIC_FONT;
		ctx.lineWidth = 2;
		var curTextX = (1 - Math.max(0, Math.min(1, Math.abs(i - GET_SELECTED_MENU()))));

		ctx.fillStyle = "black";
		ctx.strokeStyle = "rgba(" + parseInt((1 - curTextX) * 123) + ",150," + parseInt((1 - curTextX) * 123) + ",1)";
		ctx.fillText(cMenu[i][0], gameX + curTextX * BRICKSIZE, STARTY + y_);
		ctx.strokeText(cMenu[i][0], gameX + curTextX * BRICKSIZE, STARTY + y_);

		if (WHERE == 6) {
			ctx.fillText("" + cMenu[i][1][cMenu[i][2]] + "", gameX + GRID_WIDTH - ctx.measureText("" + cMenu[i][1][cMenu[i][2]] + "").width, STARTY + y_);
			ctx.strokeText(cMenu[i][1][cMenu[i][2]], gameX + GRID_WIDTH - ctx.measureText("" + cMenu[i][1][cMenu[i][2]] + "").width, STARTY + y_);
		}

		y_ += GRAPHIC_MENU_DISTANCE;
	}
	launchMenuBuffer();
}

function tutorialGraphic() {
	clearAndResize(ctx);
	coolGraphic(ctx);
	ctx.fillStyle = "white";
	ctx.strokeStyle = "white";
	logoGraphic();
	var STARTY = LOGOHEIGHT * 2 + LOGOY;
	var y_ = 0;
	ctx.font = "bold " + GRAPHIC_MENU_FONTSIZE + "px " + GRAPHIC_FONT;
	ctx.fillStyle = "white";
	ctx.fillText("Tutorial!", 10, STARTY + y_);
	y_ += 30;
	var keyDesc = [
		["Up", "Rotate the brick"],
		["Right,Left", "Navigate the brick"],
		["Down", "Drop the brick (slow)"],
		["Space", "Fast drop/slam the brick"],
		["Esc", "Pause the game"]
	];
	for (i in keyDesc) {
		ctx.font = "bold " + GRAPHIC_MENUDESC_FONTSIZE + "px " + GRAPHIC_FONT;
		ctx.fillText(keyDesc[i][0], 20, STARTY + y_);
		ctx.font = GRAPHIC_MENUDESC_FONTSIZE + "px " + GRAPHIC_FONT;
		ctx.fillText(keyDesc[i][1], 30, STARTY + y_ + GRAPHIC_MENUDESC_FONTSIZE * 1.5);
		y_ += GRAPHIC_MENUDESC_FONTSIZE * 3;
	}
}

function aboutGraphic() {
	clearAndResize(ctx);
	coolGraphic(ctx);
	ctx.fillStyle = "white";
	ctx.strokeStyle = "white";
	logoGraphic();
	var STARTY = LOGOHEIGHT * 2 + LOGOY;
	var y_ = 0;
	ctx.font = "bold " + GRAPHIC_MENU_FONTSIZE + "px " + GRAPHIC_FONT;
	ctx.fillStyle = "white";
	ctx.fillText("About!", 10, STARTY + y_);
	y_ += GRAPHIC_MENUDESC_FONTSIZE * 2;
	ctx.font = GRAPHIC_MENUDESC_FONTSIZE + "px " + GRAPHIC_FONT;
	var sliced1 = fragmentText("This game is a 'copy' of the original game called tetris.", CANVAS_WIDTH - 20, GRAPHIC_MENUDESC_FONTSIZE + "px Verdana");
	var sliced2 = fragmentText("This version of Tetris is made by And3k5 (http://and3k5.dk/).", CANVAS_WIDTH - 20, GRAPHIC_MENUDESC_FONTSIZE + "px Verdana");
	var sliced3 = fragmentText("This is coded by help from these things, which i couldn't do without:", CANVAS_WIDTH - 20, GRAPHIC_MENUDESC_FONTSIZE + "px Verdana");
	var sl;
	for (wads in(sl = [sliced1, sliced2, sliced3])) {
		for (i in sl[wads]) {
			ctx.font = GRAPHIC_MENUDESC_FONTSIZE + "px " + GRAPHIC_FONT;
			ctx.fillText(sl[wads][i], 10, STARTY + y_);
			y_ += GRAPHIC_MENUDESC_FONTSIZE;
		}
	}
	y_ += 10;
	var helps = [
		["fragmentText", "Source: http://goo.gl/qqUx8 - Some pieces are edited by me (difficulties with ctx.font)"],
		["Google", "When i had to find references (I'm forgetful!)"],
		["Winamp", "Plays music while I'm concentrated"]
	];
	for (i in helps) {
		ctx.font = "bold " + GRAPHIC_MENUDESC_FONTSIZE + "px " + GRAPHIC_FONT;
		ctx.fillText(helps[i][0], 10, STARTY + y_);
		var tmp = fragmentText(helps[i][1], CANVAS_WIDTH - 30, GRAPHIC_MENUDESC_FONTSIZE + "px Verdana");
		for (izx in tmp) {
			ctx.fillText(tmp[izx], 15, STARTY + y_ + 15);
			y_ += GRAPHIC_MENUDESC_FONTSIZE;
		}
		y_ += 30;
	}
}
var lastLoop = Date.now();
var xF = 0;
var F = 0;
var SOUNDS = [
	["menuscroll", "sound/menuscroll.wav", 0],
	["menuback", "sound/menuback.wav", 0],
	["menuselect", "sound/menuselect.wav", 0],
	["gamemove", "sound/gamemove.wav", 0],
	["gamelose", "sound/gamelose.wav", 0],
	["gamebump", "sound/gamebump.wav", 0],
	["gamerow", "sound/gamerow.wav", 0]
];
var MUSIC = [
	["menumusic", "sound/menumusic.wav", 0]
];
function loadingGraphic() {
	clearAndResize(ctx);
	coolGraphic(ctx);
	ctx.fillStyle = "white";
	ctx.strokeStyle = "white";
	logoGraphic();
	var STARTY = LOGOHEIGHT * 2 + LOGOY;
	var y_ = STARTY;
	ctx.fillStyle = "white";
	for (i in SOUNDS) {
		ctx.fillText(SOUNDS[i][0] + " " + SOUNDS[i][2], 10, y_);
		y_ += GRAPHIC_MENUDESC_FONTSIZE;
	}
	for (i in MUSIC) {
		ctx.fillText(MUSIC[i][0] + " " + MUSIC[i][2], 10, y_);
		y_ += GRAPHIC_MENUDESC_FONTSIZE;
	}
}
(function () {
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
		loadingGraphic();
		break;
	case 0:
		// menu
		//menuGraphic();
		allMenuGraphic();
		break;
	case 1:
		// ingame
		inGameGraphic();
		break;
	case 2:
		// game paused
		allMenuGraphic();
		break;
	case 3:
		// Tutorial
		tutorialGraphic();
		break;
	case 4:
		// About
		aboutGraphic();
		break;
	case 5:
		// Lost game
		allMenuGraphic();
		break;
	case 6:
		allMenuGraphic();
		break;
	default:
		break;
	}
	ctx.fillStyle = "white";
	ctx.font = "8px Verdana";
	ctx.fillText(Math.round(F * 10) / 10, 10, 10);
})();
function getMovingBrick() {
	var i;
	for (i in bricks) {
		if (bricks[i].moving) {
			return bricks[i];
		}
	}
}
var GAMECONTROLDOWN = false;
function gameControlDown() {
	if (GAMECONTROLDOWN == false) {
		(function () {
			GAMECONTROLDOWN = true;
			if (WHERE == 1) {
				getMovingBrick().movedown();
				setTimeout(arguments.callee, 1000);
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
window.addEventListener("keydown", keyh, false);
window.addEventListener("keyup", keyup, false);
window.addEventListener("mousemove", mouseMove, false);
window.addEventListener("mousedown", mouseDown, false);

//setInterval("resizeC()",1500);
