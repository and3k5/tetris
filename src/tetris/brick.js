import { playSound } from "./sound.js";

function Brick(options) {
	var o = options || {'ingame' : false,'game' : null};

	this.game = o.game;
	this.ingame = o.ingame;
	var x,
	y;

	Object.defineProperties(this, {
		"x" : {
			get : function () {
				return x;
			},
			set : function (v) {
				x = v;
				if (this.ingame && (this.game != null)) {
					this.game.PENDINGUPDATE = true;
				}
			}
		},
		"y" : {
			get : function () {
				return y;
			},
			set : function (v) {
				y = v;
				if (this.ingame && (this.game != null)) {
					this.game.PENDINGUPDATE = true;
				}
			}
		}
	});

	if (this.ingame) {
		var brfrm = this.game.bricksform;
		var rnd = this.game.nextRandom;
		this.color = this.game.getColors()[rnd].copy();
		this.blocks = brfrm[rnd].concat();
		this.moving = true;
		this.x = Math.round(((this.game.getWIDTH()) / 2) - (this.blocks[0].length / 2));
		this.y = Math.round(0 - (this.blocks.length));
		this.game.nextRandom = Math.round(Math.random() * (brfrm.length - 1));
	}

}
Brick.prototype.resetPosition = function () {
	this.x = Math.round(((this.game.getWIDTH()) / 2) - (this.blocks[0].length / 2));
	this.y = Math.round(0 - (this.blocks.length));
}
Brick.prototype.checkCollision = function (x, y, brcks) {
	for (var i in brcks) {
		for (var i1 in brcks[i].blocks) {
			for (var i2 in brcks[i].blocks[i1]) {
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
	var height = 0;
	for (var i1 in this.blocks) {
		for (var i2 in this.blocks[i1]) {
			if (this.blocks[i1][i2] == 1) {
				height = Math.max(height, (parseInt(i1) + 1));
			}
		}
	}
	return height;
}
Brick.prototype.getWidth = function () {
	var high = 0,
	low = (1E309), // 1E309 = infinity
	countrow = 0;
	for (var i1 in this.blocks) {
		countrow = 0;
		for (var i2 in this.blocks[i1]) {
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
	for (var i1 in this.blocks) {
		for (var i2 in this.blocks[i1]) {
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
	for (var i = 0; i < 4; i++) {
		cnt = 0;
		for (var i1 in this.blocks) {
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
Brick.prototype.rotate_okay = function (brick, bl) {
	for (var i1 in bl) {
		for (var i2 in bl[i1]) {
			if (bl[i1][i2] == 1) {
				if ((brick.checkCollision(brick.x + parseInt(i2), brick.y + parseInt(i1), this.game.bricks) == false) || ((brick.y + Brick.emulate(bl).getHeight()) >= this.game.HEIGHT) || ((brick.x + Brick.emulate(bl).getWidth() + Brick.emulate(bl).getBlockX()) > (this.game.getWIDTH())) || ((brick.x + Brick.emulate(bl).getBlockX()) < 0)) {
					return false;
				}
			}
		}
	}
	return true;
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
		if (this.rotate_okay(this, blocks2)) {
			//yeah
			if (this.ingame && (this.game != null)) {
				this.game.PENDINGUPDATE = true;
			}
		} else {
			if (((this.x + Brick.emulate(blocks2).getWidth() + Brick.emulate(blocks2).getBlockX()) > (this.game.getWIDTH()))) {
				this.x--;
				if (this.rotate_okay(this, blocks2)) {
					// yeah
					if (this.ingame && (this.game != null)) {
						this.game.PENDINGUPDATE = true;
					}
				} else {
					this.x++;
					return false;
				}
			} else if (((this.x + Brick.emulate(blocks2).getBlockX()) < 0)) {
				this.x++;
				if (this.rotate_okay(this, blocks2)) {
					//yeah
					if (this.ingame && (this.game != null)) {
						this.game.PENDINGUPDATE = true;
					}
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
		var may_i_fall = true;
		if (this.moving) {
			for (var i1 in this.blocks) {
				for (var i2 in this.blocks[i1]) {
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
		var may_i_fall = true;
		if (this.moving) {
			for (var i1 in this.blocks) {
				for (var i2 in this.blocks[i1]) {
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
	if (this.game.getRUNNING() && this.game.MAYDROP) {
		playSound("gamebump");
		this.moving = false;
		this.y = this.getLowestPosition(this.game.bricks);
		this.game.PENDINGUPDATE=true;
		if ((this.y + this.getBlockY()) >= 0) {
			var sliced = this.slice_up();
			this.game.bricks.splice(this.findMe(), 1);
			for (var i in sliced) {
				this.game.bricks.push(sliced[i])
			}
			this.game.checkLines();
			this.game.bricks.push(new Brick({
					ingame : true,
					game : this.game
				}));
			this.game.HOLDINGCOUNT = 0;
		} else {
			menuNav("gamelose");
			playSound("gamelose");
		}
		this.game.MAYDROP = false;

	}
}
Brick.prototype.movedown = function () {
	if (this.game.getRUNNING()) {
		var i,
		may_i_fall = true;
		if (this.moving) {
			for (var i1 in this.blocks) {
				for (var i2 in this.blocks[i1]) {
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
					for (var i in sliced) {
						this.game.bricks.push(sliced[i]);
					}
					this.game.checkLines();
					this.game.bricks.push(new Brick({
							ingame : true,
							game : this.game
						}));
					this.game.HOLDINGCOUNT = 0;
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
	this_y = this.y;
	var stillgood = true,
	isgood = true;
	while ((stillgood)) {
		isgood = true;
		for (var i1 in this.blocks) {
			for (var i2 in this.blocks[i1]) {
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
	for (var i1 in this.blocks) {
		for (var i2 in this.blocks[i1]) {
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
	for (var i in this.game.bricks) {
		if (this.game.bricks[i] == this) {
			return i;
		}
	}
	return -1;
}

Brick.emulate = function (vblocks) {
	var tmp = new Brick({
			ingame : false,
			game : null
		});
	tmp.moving = false;
	tmp.blocks = vblocks;
	return tmp;
}

export default Brick