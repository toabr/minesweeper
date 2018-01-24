/* =======================================================================*
 *				Minesweeper
 *
 *	api:	Feld.click(x,y) > process // alle nötigen Spielregeln werden ausgeführt
 *				Tile.neighbors(x,y) > daten // modularisierung!!
 *				neighbors.kettenreaktion > daten
 *
 * ======================================================================== */

var game = (function() {
	'use strict';

	// Game Variables
	var boardMap 	= [],
			bombsMap 	= [],
			boardSpan = 8,
			bombs 		= 8,
			flagMode,
			flagCount,
			score,
			timer,
			sec,
			bestTry;

	// Caching the Dom
	var $hud 						= $('#hud'),
			$timer 					= $('#timer'),
			$menuBtn 				= $hud.find('#menuBtn'),
			$flagModeBtn		= $hud.find('#flagModeBtn'),
			$flagCount 			= $hud.find('#flagCount'),

			$reloads				= $('.reload'),
			$board					= $('#board'),
			$gameMenu				= $('#gameMenu'),
			$gameOver				= $('#gameOver'),

			$bestTry 				= $('#bestTry'),
			$lastTry 				= $('#lastTry');

	// Initialize The First Game
	setHandlers();
	init();

	function init() {
		gameMenu();
		buildBoard();
		toggleFlagMode(false);
		flagCount = bombs;
		$flagCount.html(flagCount);
		score = 0;
		spreadBombs();
		spreadNums();

		sec = 0;
		clearInterval(timer);
		timer = setInterval(function(){ _timer() }, 1000);
	}

	function gameMenu() {
		switch($gameMenu.find('input[name="level"]:checked').val()) {
			case '0' : boardSpan = 6; bombs = 4; break;
			case '1' : boardSpan = 8; bombs = 8; break;
			case '2' : boardSpan = 12; bombs = 16; break;
			case '3' : boardSpan = 18; bombs = 28; break;
		}
	}

	function setHandlers() {
		$reloads.click(init);
		$flagModeBtn.click(toggleFlagMode);
		$menuBtn.click(function(){ $gameMenu.modal() });
	}

	function _timer() {
		sec++;
		$timer.text(sec);
	}

	function buildBoard() {
		boardMap 	= [];
		$board.html('');

		for(var y = 0; y < boardSpan; y++) {
		  var row = [],
		  		htmlRow = document.createElement('div');
		  		htmlRow.className = 'btn-group btn-block';
		  for(var x = 0; x < boardSpan; x++) {
		  	var tile = new Tile(x,y);
		    row.push(tile);
		    htmlRow.appendChild(tile.btn);
		  }
		  boardMap[y] = row;
		  $board.append(htmlRow);
		}
	}

	function spreadBombs() {
		bombsMap = [];

		var randX,
				randY;

		for(var i=0; i<bombs; i++) {
			randX = Math.round(Math.random() * (boardSpan - 1));
			randY = Math.round(Math.random() * (boardSpan - 1));

			if(!boardMap[randY][randX].bomb) {
				// console.log(boardMap[randY][randX]);
				bombsMap.push([randX, randY]);
				boardMap[randY][randX].setBomb();
			}else i-- ;
		}
	}

	function spreadNums() {
		for(var j=0; j<bombsMap.length; j++) {
			var bombX = bombsMap[j][0];
			var bombY = bombsMap[j][1];
			var neighbors = getNeighbors(bombX, bombY);

			for(var i=0; i< neighbors.length; i++) {
				var x = neighbors[i][0];
				var y = neighbors[i][1];

				if(!boardMap[y][x].bomb) {
					boardMap[y][x].addDanger();
				}
			}
		}
	}

	function getNeighbors(targetX, targetY) {
		var neighbors = [[-1,-1], [0,-1], [1,-1], [1,0], [1,1], [0,1], [-1,1], [-1,0]];
		var output = [];

		for(var i=0; i< neighbors.length; i++) {
			var neighborX = targetX + neighbors[i][0];
			var neighborY = targetY + neighbors[i][1];

			if (neighborY < boardSpan && neighborY > -1 && neighborX < boardSpan && neighborX > -1) {
				output.push([neighborX, neighborY]);
			}
		}
		return output;
	}

	function revealNeighbors(targetX, targetY) {
		var neighbors = [[targetX, targetY]];
		var neighborList = neighbors.slice();

		while(neighbors.length > 0) {
			var tmp = getNeighbors(neighbors[0][0], neighbors[0][1]);

			for(var i=0; i<tmp.length; i++) {
				var tile = boardMap[tmp[i][1]][tmp[i][0]];

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
			boardMap[y][x].render();
		}
	}

	function revealAll() {
		for(var y=0; y < boardMap.length; y++) {
			for(var x=0; x < boardMap[y].length; x++) {
				boardMap[y][x].render();
			}
		}
	}

	function toggleFlagMode(state) {
		if((typeof state) === 'boolean') {
			if(state) {
				$flagModeBtn.addClass('btn-flag-active');
				flagMode = state;
			}else {
				$flagModeBtn.removeClass('btn-flag-active');
				flagMode = state;
			}
		}else {
			$flagModeBtn.toggleClass('btn-flag-active');
			flagMode = !flagMode;
		}
	}

	function toggleFlag(tile) {
		if(tile.flag) {
			tile.toggleFlag();
			++flagCount;
			score = (tile.bomb ? score-1 : score+1);
		}else if(flagCount > 0) {
	    tile.toggleFlag();
	    --flagCount;
	    score = (tile.bomb ? score+1 : score-1);
	  }
	  $flagCount.html(flagCount);
	  // console.log('flagCount: ' + flagCount);
	  // console.log('score: ' + score);
	}

	function gameOver(state) {
		$gameOver.find('.modal-title').html(messages[state].header);
		$gameOver.find('.modal-body').html(messages[state].body)
		.append(' ' + sec + ' seconds');
		$gameOver.modal();
	}

	return {
		map: function() {
			return boardMap
		},
		click: function (tile) {
		  if(flagMode) {
		  	toggleFlag(tile);
		  	if(score === bombs) { // WIN
		  		clearInterval(timer);
		  		// console.log(typeof bestTry);
		  		if((typeof bestTry === 'undefined') || sec < bestTry) {
		  			revealAll();
		  			gameOver('record');
		  			bestTry = sec;
		  			$bestTry.html(sec + ' seconds');
		  			$lastTry.prepend('<a href="#" class="list-group-item">record: ' + sec + ' seconds</a>');
		  		} else {
		  			revealAll();
		  			gameOver('win');
		  			$lastTry.prepend('<a href="#" class="list-group-item">won: ' + sec + ' seconds</a>');
		  		}
		  	} else if(flagCount === 0) {
		  		revealAll();
		  		clearInterval(timer);
		    	gameOver('falseFlag');
		    	$lastTry.prepend('<a href="#" class="list-group-item">lost: ' + sec + ' seconds</a>');
		  	}

		  }else if(!tile.revealed && !tile.flag) {
		    if (!tile.bomb) {
		      if(!tile.danger > 0) {
		        revealNeighbors(tile.x, tile.y);
		      } else { tile.render(); }
		    } else {
		    	clearInterval(timer);
		    	console.log(tile);
		    	revealAll();
		    	tile.blink();
		    	gameOver('bomb');
		    	$lastTry.prepend('<a href="#" class="list-group-item">lost: ' + sec + ' seconds</a>');
		    }
		  }
		}
	}

})();

var messages = {
	'win': {
		header: 'WINNER',
		body: 'You did it in',
	},
	'record': {
		header: 'NEW RECORD',
		body: 'Congratulations that is a new record in',
	},
	'bomb': {
		header: 'BOOM',
		body: 'That was a bomb after',
	},
	'falseFlag': {
		header: 'OH NO!',
		body: 'You are running out of Flags after',
	},
};
