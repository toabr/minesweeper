/* =======================================================================*
 *				Minesweeper
 *
 *	api:	Feld.click(x,y) > process // alle nötigen Spielregeln werden ausgeführt
 *				Tile.neighbors(x,y) > daten // modularisierung!!
 *				neighbors.kettenreaktion > daten
 *
 * ======================================================================== */

'use strict';

var game = {

	boardMap: [],
	bombsMap: [],
	boardSpan: 10,
	board: null,
	bombs: 10,
	flagMode: false,
	score: this.boardSpan + 5,

	start: function() {
		// reset values
		this.setHandlers();
		this.board = document.getElementById('board');
		this.buildBoard();
		this.spreadBombs();
		this.spreadNums();
	},

	restart: function() {
		for(var i=0; i< objects.length; i++) {
			objects[i].clean();
		}
		game.spreadBombs();
		game.spreadNums();
	},

	setHandlers: function() {
		document.getElementById('reloadBtn').addEventListener('click', this.restart);
		document.getElementById('toggleFlagModeBtn').addEventListener('click', this.toggleFlagMode);
	},

	buildBoard: function() {
		for(var y=0; y<this.boardSpan; y++) {
		  var row = [];
		  for(var x=0; x<this.boardSpan; x++) {
		    row.push(new Tile(x, y));
		  }
		  this.boardMap[y] = row;
		}
	},

	spreadBombs: function() {
		this.bombsMap = [];

		var randX,
				randY;

		for(var i=0; i<this.bombs; i++) {
			randX = Math.round(Math.random() * (this.boardSpan - 1));
			randY = Math.round(Math.random() * (this.boardSpan - 1));

			if(!this.boardMap[randY][randX].bomb) {
				this.bombsMap.push([randX, randY]);
				this.boardMap[randY][randX].setBomb();
			}else i-- ;
		}
	},

	spreadNums: function() {
		for(var j=0; j<this.bombsMap.length; j++) {
			var bombX = this.bombsMap[j][0];
			var bombY = this.bombsMap[j][1];
			var neighbors = this.getNeighbors(bombX, bombY);

			for(var i=0; i< neighbors.length; i++) {
				var x = neighbors[i][0];
				var y = neighbors[i][1];

				if(!this.boardMap[y][x].bomb) {
					this.boardMap[y][x].addDanger();
				}
			}
		}
	},

	getNeighbors: function(targetX, targetY) {
		var neighbors = [[-1,-1], [0,-1], [1,-1], [1,0], [1,1], [0,1], [-1,1], [-1,0]];
		var output = [];

		for(var i=0; i< neighbors.length; i++) {
			var neighborX = targetX + neighbors[i][0];
			var neighborY = targetY + neighbors[i][1];

			if (neighborY < this.boardSpan && neighborY > -1 && neighborX < this.boardSpan && neighborX > -1) {
				output.push([neighborX, neighborY]);
			}
		}
		return output;
	},

	revealNeighbors: function(targetX, targetY) {
		var neighbors = [[targetX, targetY]];
		var neighborList = neighbors.slice();

		while(neighbors.length > 0) {
			var tmp = this.getNeighbors(neighbors[0][0], neighbors[0][1]);

			for(var i=0; i<tmp.length; i++) {
				var tile = game.boardMap[tmp[i][1]][tmp[i][0]];

				if(!neighborList.contains(tmp[i])) {
					if(!tile.flag && !tile.revealed) {
						if(tile.danger === 0) {
							console.log('render');
							neighborList.push(tmp[i]);
							neighbors.push(tmp[i]);
						}else {
							neighborList.push(tmp[i]);
						}
					}
				}
			}
			neighbors.shift();
		}

		for(var i=0; i< neighborList.length; i++) {
			var x = neighborList[i][0];
			var y = neighborList[i][1];
			this.boardMap[y][x].render();
		}
	},

	toggleFlagMode: function() {
		this.classList.toggle('btn-flag-active');
		game.flagMode = !game.flagMode;
	}

}


// Tile Object
// ================================================

var objects = [];

function Tile(x, y) {
	this.x = x;
	this.y = y;
  this.danger = 0;
  this.bomb = false;
  this.flag = false;
  this.revealed = false;
  var btn = document.createElement('button');
		  btn.className = 'btn btn-primary';
		  btn.innerHTML = '+';
		  btn.addEventListener('click', this, false);
  this.btn = btn;
  game.board.appendChild(btn);

  objects.push(this);
}

Tile.prototype.handleEvent = function(e) {
    switch (e.type) {
        case 'click': this.click(e);
    }
}

Tile.prototype.click = function(e) {
	if(!this.revealed) {
		if(!game.flagMode) {
			if (!this.bomb) {
		  	if(!this.danger > 0) {
		  		this.render();
		  		game.revealNeighbors(this.x, this.y);
		  	}else {
		  		this.render();
		  	}
		  }else {
		  	this.render();
		  }
		}else {
			this.toggleFlag();
		}
	}
}

Tile.prototype.setBomb = function() {
	this.bomb = true;
	this.btn.className = 'btn btn-danger';
	this.btn.innerHTML = 'X';
}

Tile.prototype.addDanger = function() {
	this.danger++;
	this.btn.innerHTML = this.danger;
}

Tile.prototype.toggleFlag = function() {
	// if(!this.flag) {
	// 	this.flag = true;
	// 	this.btn.innerHTML = 'F';
	// } else {
	// 	this.flag = false;
	// 	this.btn.innerHTML = this.danger;
	// }
	this.flag = !this.flag;
	this.btn.classList.toggle('btn-primary');
	this.btn.classList.toggle('btn-flag-active');
	console.log('Flag: ' + this.flag);
}

Tile.prototype.render = function() {
	this.revealed = true;
	if(this.bomb) {
		this.btn.className = 'btn btn-danger';
		this.btn.innerHTML = 'X';
	}else {
		this.btn.className = 'btn btn-success';
		this.btn.innerHTML = this.danger;
	}
}

Tile.prototype.clean = function() {
	this.danger = 0;
  this.bomb = false;
  this.flag = false;
  this.btn.className = 'btn btn-primary';
  this.btn.innerHTML = '+';
}

$( document ).ready(function() {
  game.start();
});
