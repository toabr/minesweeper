/* =======================================================================*
*				Minesweeper
*
*	api:	Feld.click(x,y) > process // alle nötigen Spielregeln werden ausgeführt
*				Tile.neighbors(x,y) > daten // modularisierung!!
*				neighbors.kettenreaktion > daten
*
* ======================================================================== */
import Tile from './tile'

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

    for (var y = 0; y < boardSpan; y++) {
      const row = []

      for (var x = 0; x < boardSpan; x++) {
        var tile = new Tile(x, y, clickHandler);
        row.push(tile);

        $board.append(tile.btn);
      }

      boardMap[y] = row;
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
      var neighbors = getAdjacent({ x: bombX, y: bombY });

      for(var i=0; i< neighbors.length; i++) {
        var x = neighbors[i].x;
        var y = neighbors[i].y;

        if(!boardMap[y][x].bomb) {
          boardMap[y][x].addDanger();
        }
      }
    }
  }


  /**
   * returns coordinates of adjacent board cells
   * 
   * @param {{ x, y }} target 
   * @returns {array} - of { x, y }
   */
  function getAdjacent(target = { x, y }) {
    var neighbors = [
      { x: -1, y: -1 },
      { x: 0, y: -1 },
      { x: 1, y: -1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: -1, y: 1 },
      { x: -1, y: 0 }
    ];
    var output = [];

    /**
     * TODO: output = neighbors.filter
     */
    for(var i=0; i< neighbors.length; i++) {
      var neighborX = target.x + neighbors[i].x;
      var neighborY = target.y + neighbors[i].y;

      if (neighborY < boardSpan && neighborY > -1 && neighborX < boardSpan && neighborX > -1) {
        output.push({ x: neighborX, y: neighborY });
      }
    }
    return output;
  }


  /**
   * returns coordinates of neighbors
   * - find connected zeros + adjecent cells (0-8)
   * - ! dont collect adjecent cells of:
   *   - flagged cells (0-8)
   *   - already revealed cells (1-8)
   * 
   * @param {{x,y}} t0 - target 0 / starter
   * @returns {array} of {x,y}
   */
  function getNeighbors(t0 = { x, y }) {
    let testStack = [t0]

    // work the stack, first in first out
    for (let i = 0; i < testStack.length; i++) {
      const target = testStack[i]

      // just work with 0
      if (dangerLevel(target) !== 0) continue

      // get coordinates for all adjacent board cells
      const adjacent = getAdjacent(target)

      // filter !revealed && !flag
      const collected = adjacent.filter(el => (!isRevealed(el) && !hasFlag(el)))

      // push collected onto stack & uniquify
      const squash = [...testStack, ...collected]
      testStack = [...new Map(squash.map(obj => [JSON.stringify(obj), obj])).values()];
    }

    console.log('= testStack', testStack)
    return testStack
  }

  
  /**
   * TODO: Tile class methodes ?
   */
  const dangerLevel = ({ x, y }) => boardMap[y][x].danger

  const isRevealed = ({ x, y }) => boardMap[y][x].revealed

  const hasFlag = ({ x, y }) => boardMap[y][x].flag


  /**
   * reveal neighbors
   * @param {array} list - of {x,y}
   */
  function revealNeighbors(list) {
    for (let i = 0; i < list.length; i++) {
      const x = list[i].x
      const y = list[i].y
      boardMap[y][x].render()
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
				$flagModeBtn.addClass('active');
				flagMode = state;
			}else {
				$flagModeBtn.removeClass('active');
				flagMode = state;
			}
		}else {
			$flagModeBtn.toggleClass('active');
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

  function clickHandler() {
    const tile = this

    if (flagMode) {
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

          const neighbors = getNeighbors({ x: tile.x, y: tile.y });
          revealNeighbors(neighbors)

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
