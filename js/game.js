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
	boardSpan: 8,
	board: null,
	bombs: 8,
	flagMode: false,
	get score() { return Math.pow(this.boardSpan,2) - this.bombs },

	start: function() {
		// reset values
		this.setHandlers();
		this.board = document.getElementById('board');
		this.buildBoard();
		this.spreadBombs();
		this.spreadNums();
		// this.score = Math.pow(this.boardSpan,2) - this.bombs;
	},

	restart: function() {
		for(var i=0; i< objects.length; i++) {
			objects[i].clean();
		}
		game.spreadBombs();
		game.spreadNums();
	},

	setHandlers: function() {
		$('.reload').click(this.restart);
		$('#toggleFlagModeBtn').click(this.toggleFlagMode);
		$('#menuBtn').click(function(){ $('#gameMenu').modal() });
	},

	buildBoard: function() {
		for(var y=0; y<this.boardSpan; y++) {
		  var row = [],
		  		htmlRow = document.createElement('div');
		  		htmlRow.className = 'btn-group btn-block';
		  for(var x=0; x<this.boardSpan; x++) {
		  	var tile = new Tile(x,y);
		    row.push(tile);
		    htmlRow.appendChild(tile.btn);
		  }
		  this.boardMap[y] = row;
		  this.board.appendChild(htmlRow);
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
  var btn = document.createElement('div');
		  btn.className = 'btn btn-tile';
		  btn.addEventListener('click', this, false);
	var icon = document.createElement('span');
			// icon.className = 'glyphicon glyphicon-plus';
			icon.innerHTML = '';
	this.icon = icon;
  this.btn = btn;
  this.btn.appendChild(this.icon);

  this.addEvents();

  objects.push(this);
}

Tile.prototype.addEvents = function () {
  this.btn.addEventListener('click', this);
}

Tile.prototype.removeEvents = function () {
  this.btn.removeEventListener('click', this);
}

Tile.prototype.handleEvent = function(e) {
  switch (e.type) {
      case 'click': this.click(e);
  }
}

Tile.prototype.click = function(e) {
	console.log('click ' + this.x + ':' + this.y);
// LET THE RENDER FUNCTION DO THE RENDER STUFF !!!
	if(game.flagMode) {
		this.toggleFlag();
	}else if(!this.revealed && !this.flag) {
		if (!this.bomb) {
	  	if(!this.danger > 0) {
	  		game.revealNeighbors(this.x, this.y);
	  	}else {
	  		this.render();
	  	}
	  }else {
	  	this.render();
	  	$('#gameOver').modal();
	  }
	}
}

Tile.prototype.setBomb = function() {
	this.bomb = true;
	// this.btn.className = 'btn btn-bomb';
	// this.btn.innerHTML = 'X';
}

Tile.prototype.addDanger = function() {
	this.danger++;
	// this.btn.innerHTML = this.danger;
}

Tile.prototype.toggleFlag = function() {
	this.flag = !this.flag;
	this.btn.classList.toggle('btn-tile');
	this.btn.classList.toggle('btn-flag-active');
	console.log('Flag: ' + this.flag);
}

Tile.prototype.render = function() {
	console.log('render ' + this.x + ':' + this.y);
	this.revealed = true;
	this.removeEvents();
	if(this.bomb) {
		this.btn.className = 'btn btn-bomb';
	}else {
		this.btn.className = 'btn btn-revealed';
		this.icon.className = '';
		this.icon.innerHTML = this.danger;
	}
}

Tile.prototype.clean = function() {
	this.danger = 0;
  this.bomb = false;
  this.flag = false;
  this.revealed = false;
  this.btn.className = 'btn btn-tile';
  this.icon.className = 'glyphicon glyphicon-plus';
  this.icon.innerHTML = '';
  // this.btn.removeAttribute('disabled');
  this.addEvents();
}

$( document ).ready(function() {
  game.start();
});
