/* =======================================================================*
 *				Minesweeper
 *
 *	api:	Feld.click(x,y) > process // alle nötigen Spielregeln werden ausgeführt
 *				Tile.neighbors(x,y) > daten // modularisierung!!
 *				neighbors.kettenreaktion > daten
 *
 * ======================================================================== */

'use strict';

$( document ).ready(function() {
  minesweeper();
});

var minesweeper = function()
{
	//  "global" variables
	//======================
	var board = new Array(),
			xTiles,
			bombs,
			flagActive = false,
			flags,
			rightFlags,
			visibles,
			bestTry,
			clicks,
			timer,
			sec;

	//  Caching the Dom
	//===================
	var	$app 				= $('#app'),
			$timer 			= $app.find('#timer'),
			$aufAnfang 	= $app.find('#neuBtn'),
			$flagActive = $app.find('#flagsBtn'),
			$flags 			= $app.find('#flags'),
			$brett 			= $app.find('#wrapper'),
			template 		= $brett.html(),

			$gameOver 			= $app.find('#gameOver'),
			$gameOverTitle 	= $gameOver.find('.modal-title'),
			$gameOverBody 	= $gameOver.find('.modal-body'),
			$gameOverButton = $gameOver.find('.modal-footer button'),

			$bestTry 	= $app.find('#bestTry'),
			$lastTry 	= $app.find('#lastTry'),

			$menuBtn 	= $app.find('#menuBtn'),
			$gameMenu = $app.find('#gameMenu'),
			$gmBtn 		= $gameMenu.find('.modal-footer button');

	//  Bind Eventlistener
	//=====================
	$aufAnfang.click(start);
	$gameOverButton.click(start);
	$flagActive.click(_flagBtnClick);
	$menuBtn.click(function(){ $gameMenu.modal() });
	$gmBtn.click(start);

	//  Game Logic
	//===============================================================
	start();

	function start()
	{
		// reset values
		board 			= [];
		xTiles 			= 10;
		rightFlags 	= 0;
		visibles 		= 0;
		clicks 			= 0;
		//bombs 		= 10;
		gameMenu();
		flags 			= bombs;

		sec = 0;
		clearInterval(timer);
		timer = setInterval(function(){ _timer() }, 1000);

		$flags.text(bombs);
		_buildBoard();
	}

	function gameMenu()
	{
		switch($gameMenu.find('input[name="level"]:checked').val()) {
			case '0' : bombs = 5; break;
			case '1' : bombs = 10; break;
			case '2' : bombs = 15; break;
			case '3' : bombs = 20; break;
			default : bombs = 10; break;
		}
	}

	function _buildBoard()
	{
		var pageWidth = Number,
				tileX 		= _tileX();

		spielFeld();
		spreadBombs();
		spreadNums();

		function _tileX()
		{
			if(window.screen.height > window.screen.width) {
				pageWidth = window.screen.width;
			}else pageWidth = window.screen.height - 200;

			var tileX = (pageWidth - 20) / xTiles;

			return tileX;
		}

		function spielFeld()
		{
			$brett.empty().css({
				"width": pageWidth - 20,
				"height": pageWidth - 20
			});

			for(var y = 0; y < xTiles; y++) {
				board[y] = new Array();
				for(var x = 0; x < xTiles; x++) {

					// build board
					var kachel = $(template).css({
						"width":tileX,
						"height":tileX,
						"left":(tileX) * x,
						"top":(tileX) * y
						});
					kachel.attr("id",y + "_" + x);
					kachel.mousedown(_testTile);
					kachel.bind("contextmenu", function(e){ return false; });
					$brett.append(kachel);

					// fill array
					var tile = new Tile();
					board[y][x] = (tile);
				}
			}
		}

		function spreadBombs()
		{
			var randX,
					randY;

			for(var i = 0; i < bombs; i++) {
				randX = Math.round(Math.random() * (xTiles - 1));
				randY = Math.round(Math.random() * (xTiles - 1));

				if(board[randY][randX].value != "x") {
					board[randY][randX].value = "x";
					console.log("Bomb" + i + " x:" + randX + " y:" + randY);
				}else i-- ;
			}
		}

		function spreadNums()
		{
			for(var y = 0; y < xTiles; y++) {
				for(var x = 0; x < xTiles; x++) {

					// find bombs neighbors
					if(board[y][x].value != "x") {
						board[y][x].value = _getNeighbors(y, x, "x").length;
					}
				}
			}
		}
	}

	function _flagBtnClick()
	{
		$flagActive.toggleClass('btn-danger');
		flagActive = (flagActive == false) ? true : false;
	}

	function _timer()
	{
		sec++;
		$timer.text(sec);
	}

	function _getNeighbors(Y, X, char)
	{
		var y = Number(Y),
				x = Number(X),
				rand = xTiles - 1,
				ausgabe = new Array();

		if(y===0){

			// Links Oben
			if(x===0){
				if(board[y][x+1].value	=== char) ausgabe.push((y) + "_" + (x+1)) ;
				if(board[y+1][x].value	=== char) ausgabe.push((y+1) + "_" + (x)) ;
				if(board[y+1][x+1].value	=== char) ausgabe.push((y+1) + "_" + (x+1)) ;
			// Rechts Oben
			}else if(x===rand){
				if(board[y][x-1].value	=== char) ausgabe.push((y) + "_" + (x-1)) ;
				if(board[y+1][x-1].value	=== char) ausgabe.push((y+1) + "_" + (x-1)) ;
				if(board[y+1][x].value	=== char) ausgabe.push((y+1) + "_" + (x)) ;
			// Rest Obere Reihe
			}else {
				if(board[y][x-1].value	=== char) ausgabe.push((y) + "_" + (x-1)) ;
				if(board[y][x+1].value	=== char) ausgabe.push((y) + "_" + (x+1)) ;
				if(board[y+1][x-1].value	=== char) ausgabe.push((y+1) + "_" + (x-1)) ;
				if(board[y+1][x].value	=== char) ausgabe.push((y+1) + "_" + (x)) ;
				if(board[y+1][x+1].value	=== char) ausgabe.push((y+1) + "_" + (x+1)) ;
			}

		}else if(y===rand){
			// Links Unten
			if(x===0){
				if(board[y-1][x].value	=== char) ausgabe.push((y-1) + "_" + (x)) ;
				if(board[y-1][x+1].value	=== char) ausgabe.push((y-1) + "_" + (x+1)) ;
				if(board[y][x+1].value 	=== char) ausgabe.push((y) + "_" + (x+1)) ;
			// Rechts Unten
			}else if(x===rand){
				if(board[y-1][x-1].value	=== char) ausgabe.push((y-1) + "_" + (x-1)) ;
				if(board[y-1][x].value	=== char) ausgabe.push((y-1) + "_" + (x)) ;
				if(board[y][x-1].value	=== char) ausgabe.push((y) + "_" + (x-1)) ;
			// Rest Unere Reihe
			}else {
				if(board[y-1][x-1].value 	=== char) ausgabe.push((y-1) + "_" + (x-1)) ;
				if(board[y-1][x].value	=== char) ausgabe.push((y-1) + "_" + (x)) ;
				if(board[y-1][x+1].value 	=== char) ausgabe.push((y-1) + "_" + (x+1)) ;
				if(board[y][x-1].value	=== char) ausgabe.push((y) + "_" + (x-1)) ;
				if(board[y][x+1].value	=== char) ausgabe.push((y) + "_" + (x+1)) ;
			}

		}else {

			if(x===0) {
				// Links zwischen 1 - 8
				if(board[y-1][x].value	=== char) ausgabe.push((y-1) + "_" + (x)) ;
				if(board[y-1][x+1].value	=== char) ausgabe.push((y-1) + "_" + (x+1)) ;
				if(board[y][x+1].value	=== char) ausgabe.push((y) + "_" + (x+1)) ;
				if(board[y+1][x].value	=== char) ausgabe.push((y+1) + "_" + (x)) ;
				if(board[y+1][x+1].value 	=== char) ausgabe.push((y+1) + "_" + (x+1)) ;

			}else if(x===rand) {
				// Rechts zwischen 1 -8
				if(board[y-1][x-1].value	=== char) ausgabe.push((y-1) + "_" + (x-1)) ;
				if(board[y-1][x].value	=== char) ausgabe.push((y-1) + "_" + (x)) ;
				if(board[y][x-1].value	=== char) ausgabe.push((y) + "_" + (x-1)) ;
				if(board[y+1][x-1].value	=== char) ausgabe.push((y+1) + "_" + (x-1)) ;
				if(board[y+1][x].value	=== char) ausgabe.push((y+1) + "_" + (x)) ;

			}else {
				// Alle Felder Mitte
				if(board[y-1][x-1].value	=== char) ausgabe.push((y-1) + "_" + (x-1)) ;
				if(board[y-1][x].value	=== char) ausgabe.push((y-1) + "_" + (x)) ;
				if(board[y-1][x+1].value	=== char) ausgabe.push((y-1) + "_" + (x+1)) ;
				if(board[y][x-1].value	=== char) ausgabe.push((y) + "_" + (x-1)) ;
				if(board[y][x+1].value	=== char) ausgabe.push((y) + "_" + (x+1)) ;
				if(board[y+1][x-1].value	=== char) ausgabe.push((y+1) + "_" + (x-1)) ;
				if(board[y+1][x].value	=== char) ausgabe.push((y+1) + "_" + (x)) ;
				if(board[y+1][x+1].value	=== char) ausgabe.push((y+1) + "_" + (x+1)) ;
			}
		}

		return ausgabe;
	}

	function _nullTile(y, x)
	{
		//console.log(y + " " + x);
		var neighbors = getChain([y + "_" + x]);
		getNumbers(neighbors);

		function getRendered(y, x)
		{
			// Auf Fahne prüfen
			if(!board[y][x].flag && !board[y][x].visible) {
				_renderTile( y, x );
				board[y][x].visible = true;
				visibles++;
			}
		}

		function getChain(input)
		{
			var leveln = input,
					level1 = input,
					level0,
					temp,
					coord;

			while(level1.length > 0) {
				input = level1;
				level1 = [];

				for(var i = 0; i < input.length; i++) {
					coord = input[i].split("_");
					level0 = _getNeighbors(coord[0], coord[1], 0);
					temp = _entfDoppelte(level0, level1);
					level1 = level1.concat(_entfDoppelte(temp, leveln));
				}
				leveln = leveln.concat(level1);
			}
			return leveln;
		}

		function getNumbers(input)
		{
			var temp1,
					temp2,
					zahlen = new Array(),
					alleZahlen = new Array();

			for(var i = 0; i < input.length; i++) {

				temp1 = input[i].split("_");
				getRendered(temp1[0],temp1[1]);

				// neighbors 1,2,3,4,5 finden
				zahlen = _getNeighbors(temp1[0], temp1[1], 1);
				zahlen = zahlen.concat(_getNeighbors(temp1[0], temp1[1], 2));
				zahlen = zahlen.concat(_getNeighbors(temp1[0], temp1[1], 3));
				zahlen = zahlen.concat(_getNeighbors(temp1[0], temp1[1], 4));
				zahlen = zahlen.concat(_getNeighbors(temp1[0], temp1[1], 5));

				// auf bereits gefundene Felder prüfen
				zahlen = _entfDoppelte(zahlen, alleZahlen);
				alleZahlen = alleZahlen.concat(zahlen);
				//console.log(zahlen);

				// Alle neighbors aufdecken
				for(var j = 0; j < zahlen.length; j++) {
					temp2 = zahlen[j].split("_");
					getRendered(temp2[0],temp2[1]);
				}
			}
		}
	}

	// Tile Module
	//======================================================

	function Tile()
	{
		var value = 0;
		var visible = false;
		var flag = false;

		return {
			value: value,
			visible: visible,
			flag: flag,
		}
	}

	function _renderTile(y,x)
	{
		var tile = board[y][x],
				$kachel = _findKachel(y,x);

		if(flagActive) {
			$kachel.toggleClass('glyphicon glyphicon-flag btn-danger');

		}else if(tile.value == 'x' && $kachel.hasClass('glyphicon-flag')) {
			$kachel.css('background', 'green').unbind();
			$kachel.addClass('visible disabled');

		}else {

			$kachel.removeClass('glyphicon glyphicon-flag btn-danger');
			$kachel.addClass('visible disabled').text(tile.value).unbind();
			//console.log('render' + visibles + ' ' + y + ' ' + x);

			switch(tile.value) {
				case 'x' : $kachel.css('background', 'red'); break;
				case 0 : $kachel.text(''); break;
				case 1 : $kachel.css('color', 'black'); break;
				case 2 : $kachel.css('color', 'green'); break;
				case 3 : $kachel.css('color', 'red'); break;
				case 4 : $kachel.css('color', 'blue'); break;
				case 5 : $kachel.css('color', 'purple'); break;
				default : $kachel; break;
			}
		}
	}

	function _testTile(e)
	{
		if(e.x) {
			console.log("moduleEvt");
			var y = e.y;
			var x = e.x;
		} else {
			console.log("userClick");
			var coord  = _findCoord(e.target);
			var y = coord.y;
			var x = coord.x;
		}

		var $kachel = _findKachel(y, x),
				tile = board[y][x],
				key = e.button;

		if(key === 2 || flagActive) {
			rechtsKlick();

		}else linksClick();


		//  Normal Click
		//================
		function linksClick()
		{
			if(!tile.flag) {
				if (tile.value == "x") {
					// Lose - Game Over
					lose();

				}else if (tile.value == 0)  {
					_nullTile( y, x );
					clicks++;

				}else {
					board[y][x].visible = true;
					_renderTile( y, x );
					visibles++;
					clicks++;
				}
				// Win - Game Over
				if(visibles === (100-bombs)) { win(); }
			}
		}

		//  Flag Click
		//==============
		function rechtsKlick()
		{
			if(tile.flag) {
				tile.flag = false;
				$flags.text(++flags);
				_renderTile(y,x);
				if(tile.value === "x") { rightFlags--; }

			}else if(flags > 0) {
				tile.flag = true;
				$flags.text(--flags);
				_renderTile(y,x);
				if(tile.value === "x") { rightFlags++; }
				// Win - Game Over
				if(rightFlags === bombs) {
					_flagBtnClick();
					win();
				}
			}
		}

		// GAME OVER
		//======================================================

		function win()
		{
			seeAll();
			clearInterval(timer);
			console.log('WIN');

			if(typeof bestTry === 'undefined' || sec < bestTry) {
				bestTry = sec;
				$bestTry.text('Best Try: ' + sec + ' seconds - ' + clicks + ' clicks');

				$gameOverTitle.text('Neuer Rekord!');
				$gameOverBody.text(sec + ' seconds - ' + clicks + ' clicks');
				$gameOver.modal();

			}else {
				$lastTry.text('Last Try: ' + sec + ' seconds - ' + clicks + ' clicks');

				$gameOverTitle.text('Gewonnen!');
				$gameOverBody.text(sec + ' seconds - ' + clicks + ' clicks');
				$gameOver.modal();
			}
		}

		function lose()
		{
			seeAll();
			clearInterval(timer);
			console.log('LOSE');

			$gameOverTitle.text('Das war eine Bombe!');
			$gameOverBody.text('Du hast leider verloren!');
			$gameOver.modal();
		}

		function seeAll()
		{
			for(var y = 0; y < xTiles; y++) {
				for(var x = 0; x < xTiles; x++) {
					if(!e.visible) { _renderTile( y, x ); }
				}
			}
		}
	}

	// Helpers
	//======================================================

	function _findCoord(kachel)
	{
		var coord = kachel.id.split("_");
		return {
			x: Number(coord[1]),
			y: Number(coord[0])
		}
	}

	function _findKachel(y,x)
	{
		return $brett.find("#" + y + "_" + x);
	}

	function _entfDoppelte(array1, array2)
	{
		var temp = [];
		var treffer = false;

		for(var i = 0; i < array1.length; i++) {
			for(var j = 0; j < array2.length; j++) {

				if(array1[i] === array2[j]) {
					treffer = true;
					break;
				}
			}

			if(treffer === false) {
				temp.push(array1[i]);
			}
			treffer = false;
		}
		return temp;
	}

	// Module API
	//======================================================

	return {
		start: start,
		click: function(y,x,key){
			var moduleEvt = {
				y: y,
				x: x,
				button: key,
			}
			_testTile(moduleEvt);
		},
	}

}

