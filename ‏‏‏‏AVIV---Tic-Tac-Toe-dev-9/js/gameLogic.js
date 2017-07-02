var friend = 0; // 0 - AI , 1 = play agains friends
var player = 1; /*   -1 -> 'A' for AI moves
					  1 -> 'H' for Human moves
					 -2 -> 'A tmp' for AI temporary examination
					  2 -> 'H tmp' for AI temporary examination what whould Human whould do.
					  0 -> 'friend'
				   */
var level = 3 ; // AI levels: 1- blind , 2 - novice, 3 - master 
//states of the game are:
const AmountOfVictoriestoTheNextLevel = 3;
const AmountOFailurstoGoDownLevel = 3;
var win_count = 0;
var fail_count = 0;
var moveCount = 0;
var amountOfSymbolsForPotentialWining = 2;
var amountOfSymbolsToWin = 3;


var gameTerminal = "Didn't Start"; /* -1 - "The Game is still running"
									   0 - "Didn't Start"
								       1 - 'Human win'
									   2 - 'AI win'
									   3 - 'The Game is Draw' 
									   4 -  'Freind win'
									   5 - "level up"
									   6 - "level down"
									*/
//@param global this for the las cell box was clicked
var _lasPos;
//------------------------------------------------
function toggelPlayer() {
	var _this = _lasPos,stopTheGame = false;;
	GameState(_this);
	if (Math.abs(player) != 2) {
		stopTheGame = makeDecisionsAcordingGameState();
	}
	if (!stopTheGame) {
		if (friend) {
			player = player==1 ? 0:1;
		} else {
			player = - player;
			if (player!=1) ai();
		}
	}
	return;
}
function winCounts() { // Human or AI win
	var life,next_win_counter,tmp;
	if (gameTerminal == 'Human win') {
		next_win_counter = win_count + Math.ceil((100/AmountOfVictoriestoTheNextLevel));
			if (next_win_counter >= 98) {
				updateLevel(+1);
				win_count=0;
				fail_count=0;
				} else {
					win_count = next_win_counter;
				}
			updateProgress(win_count);
	} else {
		fail_count++;
		life = $("#hearts").children();
		if (life.length == 1 || fail_count>=AmountOFailurstoGoDownLevel) {
			updateLevel(-1);
			win_count=0;
			fail_count=0;
		} else if (life.length > 1) {
			$("#hearts img:last-child").addClass("bounceIn");
			tmp = $("#hearts img:last-child");
			$("#hearts img:last-child").remove();
			$("#HeartAnimation").css("z-index","5");
			$("#HeartCopy").append(tmp);
			$( ".bounceIn" ).animate({ 
				"top": "+=5vh", 
				"left": "+=3vh",
				"width": "+=100px",
				"height": "+=100px"}, 5000,function() {
					$( ".bounceIn" ).toggle( "explode", {pieces: 50 })});
		}
	}
}

function updateLevel(x) {
	progressBarInit();
	if (x>0) {
		hearts_paint(2); // no limit designed for max hearts.
		//update modal msg
		gameTerminal = "level up";
		if (level<3) {
			level++;
			} else {
				level = 3;
				progressBarshow(false);
			}
		} else {
			//update modal msg
			gameTerminal = "level down";
			if (level == 3) {
				progressBarshow(true);
				} else if (level>1) {
					level--;
				  } else level = 1;
		}
	showLevel();
}
//if the state is win or draw then terminate the game so return is true
function makeDecisionsAcordingGameState () {
	switch (gameTerminal) {
		case 'Human win':
		case 'AI win':
//			if (!friend) {winCounts();}
		case 'Freind win':
			creatCanvas();
			paint_dash (winner.sequence,winner.no);
			$("#canvas").show();
		case 'The Game is Draw':
			showGameModal();
			return true;
			break;
		default:
			return false;
	}
}
//Event handler for clicing in a box game
function spotClick() {
	//each cell box value that occuied by a player, 
	//has a non  0 value. Therefore return to avoid
	//ocupy an already ocupied cell again.
	if ($(this).attr('value')!="0") {
		return;
	}
	moveCount++;
	printSymbol(this);
	_lasPos = this;
	if (!parseInt(friend)) {
		setTimeout(function(){ toggelPlayer() }, 200);
	} else {
		toggelPlayer();
	}
}
//const MAX_ROWS = 3;
//const MAX_COLS = 3
//playerValue = H for Human player, A for AI

//@param aGameMap as the board play
//@param position of the player cell box 
//State is in gameTerminal.
//States are : 'AI win' , 'Human win' , 'The Game is Draw', 'The Game is still running'.
function GameState(position) {
    var x,y;
    y = Number($(position).attr('id').substr(0,1));
    x = Number($(position).attr('id').substr(2,1));
    
    //  bSearchWin: board , posX , PosY --> updated global obj variable winner
	bSearchWin(x,y);
	if (winner.bwin) {
        gameTerminal = (player < 0) ? 'AI win' : 'Human win';
		gameTerminal = (player == 0) ? "Freind win" : gameTerminal;
		//if the returned object is an empty array of columns, length=0
    } else if (searchForEmptyCells().length==0) { 
        //check if it is a finale state, (all bord is ocupied)
        // if no empty cells then the function will return nothing.
        gameTerminal = 'The Game is Draw';  
    } else {
		gameTerminal = 'The Game is still running';
	}
}
// searchfor empty cells
//each time Human plays, the class spot is removed.
// when AI plays, it first descover all posibilities.
// it plays on the board virtually without showing the other player his guessings.
// therefore it replace the class sopt with the class AIguess.
function searchForEmptyCells() {
	var emptyCells = $('.spot');
	return emptyCells;
}
//-----------------------------------------------
//         bSearchWin -  check wining state
// return winner object 
// winner.win = true if a winner was found
// winner.sequence = row , column , left diagonal , right diagonal
// winner.no = row/column number
//------------------------------------------------
function bSearchWin(x,y) {
	
	'use strict';

	var i,
		k,
		str = '',strWin="",
		curentValue;
	for (i = 0 ; i < amountOfSymbolsToWin ; i ++) {
		strWin += (player < 0) ? "A" : "H";
		strWin += (player==0) ? 'F' : "";
	}
		
	winner.potentialCounter = 0;
	winner.bwin = false;
	curentValue = $('#'+y+'-'+x).attr('value').substr(0,1);
//	direction(y, yDir, x, xDir,str,newY,newX)
// y,x is the position in the multidemantion array of the starting point.
// yDir and xDir are the diretions to go (+1,-1)
// str is the string to search in the array.
// newY,Newx is the position of the new place to search in the array.	
	if (!winner.bwin) {
		//row check
		//go right:
		str = direction(y, 0, x,+1,"",y,x);
		//go lefr: (and add the previous result)
		str = direction(y, 0, x,-1,str,y,x);
		//add curent place
		str += curentValue;
		if (str == strWin) {
			winner.bwin = true ;
			winner.sequence = 'row';
			winner.no = y;
		} else if (potentialToWin(str,curentValue)) {
			winner.potentialCounter++;
		}
	}
	
	if (!winner.bwin) {
		//column check
		//go down:
		str = direction(y,+1, x,0,"",y,x);
		//go up: (and add the previous result)
		str = direction(y,-1, x,0,str,y,x);
		//add curent place
		str += curentValue;
		if (str == strWin) {
			winner.bwin = true ;
			winner.sequence = 'column';
			winner.no = x;
		} else if (potentialToWin(str,curentValue)) {
			winner.potentialCounter++;
		}
	}

	if (!winner.bwin) {
		//left diagonal
		//go down:
		str = direction(y,+1, x,+1,"",y,x);
		//go up: (and add the previous result)
		str = direction(y,-1, x,-1,str,y,x);
		//add curent place
		str += curentValue;
		if (str == strWin) {
			winner.bwin = true ;
			winner.sequence = 'Diagonal_down';			
		} else if (potentialToWin(str,curentValue)) {
			winner.potentialCounter++;
		}
	}

	if (!winner.bwin) {
		//right diagonal
		//go down:
		str = direction(y,+1, x,-1,"",y,x);
		//go up: (and add the previous result)
		str = direction(y,-1, x,+1,str,y,x);
		//add curent place
		str += curentValue;
		if (str == strWin) {
			winner.bwin = true ;
			winner.sequence = 'Diagonal_up';			
		} else if (potentialToWin(str,curentValue)) {
			winner.potentialCounter++;
		}
	}

	return;
}
function potentialToWin (str,char) {
	if (str.length<amountOfSymbolsToWin) {
		return false;
	}
	var counter = 0;
	for (var i = 0 ; i < str.length; i++) {
		if (str[i] == char) {
			counter++;
		}
	}
	if (counter >= amountOfSymbolsForPotentialWining) {
		return true;
	} else {
		return false;
	}
}
//-----------------------------------------------
//             direction
//------------------------------------------------
//rturn str
function direction(y, yDir, x, xDir,str,newY,newX) {
	
    'use strict';
	
	var valueHere,valueNext
	newY += yDir;
	newX += xDir;
	if ((0 < newY) && (newY <= MAX_ROWS) && (0 < newX) && (newX <= MAX_COLS)) {
		valueHere = $('#'+y+'-'+x).attr('value').substr(0,1);
		valueNext = $('#'+newY+'-'+newX).attr('value').substr(0,1);
		if (valueHere == valueNext || valueNext == "0" ) {
			//('H temp'.substr(0,1)='H')
			str += String($('#'+newY+'-'+newX).attr('value').substr(0,1) );
			str = direction(y, yDir, x, xDir,str,newY,newX);
			}
		}
	return str;
}