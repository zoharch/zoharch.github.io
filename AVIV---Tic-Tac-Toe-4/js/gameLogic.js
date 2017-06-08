var player = 1; /*   -1 -> 'A' for AI moves
					  1 -> 'H' for Human moves
					 -2 -> 'A tmp' for AI temporary examination
					  2 -> 'H tmp' for AI temporary examination what whould Human whould do.
				   */
var level = 3 ; // AI levels: 1- blind , 2 - novice, 3 - master
//states of the game are:

var gameTerminal = "Didn't Start"; /* 0 - "Didn't Start"
								      1 - 'Human win'
									  2 - 'AI win'
									  3 - 'The Game is Draw'; 
									*/
//@param global this for the las cell box was clicked
var _lasPos;
//------------------------------------------------
function toggelPlayer() {
	var _this = _lasPos;
	GameState($('.gameCell'),_this);
	if (gameTerminal == 'The Game is Draw' && Math.abs(player) == 1) {
		console.log('The Game is Draw');
		showGameModal();
		return;
	}
    //if the state is win or draw then terminate the game.
    if ((Math.abs(player) == 1)  && ((gameTerminal == 'AI win') || (gameTerminal == 'Human win'))) {
        console.log( 'winer - paint dash request: '+winner.sequence + ' ' + winner.no )
        paint_dash (winner.sequence,winner.no);
        $("#canvas").show();
        showGameModal();
        return;
    }
	//If AI is examinating the board it uses two agent players: A/H temp
	switch(player) {
		case 1:			
			player = -1; //if a human is playing change the player to AI
			ai();
			break;
		case -1:						
			player = 1;
			break;
		case -2: // 'A tmp' for AI temporary moves
			//game state is only temporary so dont show anything to the screen yet.
			// issue: check game state in ai()
			player = 2;
			ai();
			break;
		case 2: // 'H tmp' for AI temporary examination what whould Human whould do.
			//game state is only temporary so dont show anything to the screen yet.
			// issue: check game state in ai()
			player = -2;
			ai();
			break;
		default:
			console.log('undefined player:'+player);
		   }
	console.log("player is: "+ player);
}

//Event handler for clicing in a box game
function spotClick() {
	console.log("-------------------spot Event--------------------------------------")
	//each cell box value that occuied by a player, 
	//has a non  0 value. Therefore return to avoid
	//ocupy an already ocupied cell again.
	if ($(this).attr('value')!="0") {
		return;
	}
	printSymbol(this);
	_lasPos = this;
	setTimeout(function(){ toggelPlayer() }, 200);
}
//const MAX_ROWS = 3;
//const MAX_COLS = 3
//playerValue = H for Human player, A for AI

//@param aGameMap as the boad play
//@param position of the player cell box 
//State is in gameTerminal.
//States are : 'AI win' , 'Human win' , 'The Game is Draw', 'The Game is still running'.
function GameState(aGameMap,position) {
    var x,y;
    y = Number($(position).attr('id').substr(0,1));
    x = Number($(position).attr('id').substr(2,1));
    
    //  bSearchWin: board , posX , PosY --> updated global obj variable winner
	bSearchWin(aGameMap,x,y);
	if (winner.bwin) {
		//'A tmp'.substr(0,1) = 'A'
        gameTerminal = (player < 0) ? 'AI win' : 'Human win';
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
function bSearchWin(aGameMap,x,y) {
	
	'use strict';

	var i,
		k,
		str = '',
		strWin = (player < 0) ? "AAA" : "HHH";
	winner.bwin = false;
//	direction(y, yDir, x, xDir,str,newY,newX)
// y,y is the position in the multidemantion array of the starting point.
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
		str += $('#'+y+'-'+x).attr('value').substr(0,1); //  aGameMap[y][x];
		if (str == strWin) {
			winner.bwin = true ;
			winner.sequence = 'row';
			winner.no = y;
			}
	}
	
	if (!winner.bwin) {
		//column check
		//go down:
		str = direction(y,+1, x,0,"",y,x);
		//go up: (and add the previous result)
		str = direction(y,-1, x,0,str,y,x);
		//add curent place
		str += $('#'+y+'-'+x).attr('value').substr(0,1); //  aGameMap[y][x];
		if (str == strWin) {
			winner.bwin = true ;
			winner.sequence = 'column';
			winner.no = x;
			}		
	}

	if (!winner.bwin) {
		//left diagonal
		//go down:
		str = direction(y,+1, x,+1,"",y,x);
		//go up: (and add the previous result)
		str = direction(y,-1, x,-1,str,y,x);
		//add curent place
		str += $('#'+y+'-'+x).attr('value').substr(0,1); //  aGameMap[y][x];
		if (str == strWin) {
			winner.bwin = true ;
			winner.sequence = 'Diagonal_down';			
			}
	}

	if (!winner.bwin) {
		//right diagonal
		//go down:
		str = direction(y,+1, x,-1,"",y,x);
		//go up: (and add the previous result)
		str = direction(y,-1, x,+1,str,y,x);
		//add curent place
		str += $('#'+y+'-'+x).attr('value').substr(0,1); //  aGameMap[y][x];
		if (str == strWin) {
			winner.bwin = true ;
			winner.sequence = 'Diagonal_up';			
			}
	}

	return;
}
//-----------------------------------------------
//             direction
//------------------------------------------------
//rturn str
function direction(y, yDir, x, xDir,str,newY,newX) {
	
    'use strict';
	
	newY += yDir;
	newX += xDir;
	if ((0 < newY) && (newY <= MAX_ROWS) && (0 < newX) && (newX <= MAX_COLS)) {
		if ($('#'+newY+'-'+newX).attr('value').substr(0,1) == $('#'+y+'-'+x).attr('value').substr(0,1) ) {
			//('H temp'.substr(0,1)='H')
			str += String($('#'+newY+'-'+newX).attr('value').substr(0,1) );
			str = direction(y, yDir, x, xDir,str,newY,newX);
			}
		}
	return str;
}