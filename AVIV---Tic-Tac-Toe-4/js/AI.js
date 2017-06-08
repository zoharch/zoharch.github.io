// ai function
function ai() {
	//options[] recieve empty cells Array
	var options = searchForEmptyCells();
	// Select Inteligence based on global var level
	switch(level) {
		case 1:
			// AI - Blind - choose a random empty cell
			var selection = options[Math.round((options.length-1)*Math.random())];
			break;
		case 2:
			//AI - Novice level, TBD.
			break;
		case 3:
			// AI Master
			selection = aiMaster(options);
			break;
		default: 
			console.log('ai() default: invalid level happend');
				}
	player = -1; // symbolise AI player vers H (for Human) player
	printSymbol(selection);
	_lasPos = selection;
	toggelPlayer();
	
} 

// AI Master
// Aoptions[] are all the empty cells available for a move.
// @returns a cell box to move to.
// AI plays virtually on the Board.
// It starts from its first optional move and mark it on the borad,
// using the function printSymbol(selection) that sets the value of the 
// cell coresponding to A/H temp moves. The function is not symboilzing an img on the cell
// so nothing shows up. It also replaces the class 'spot' with 'AIguess'.
// Then toggleplayer() function starts and first it calls to GameState() function.
// GameState() function check the bord and setts the game state
// in gameTerminal global variable.
// Then the function toggleplayer() toggles tmp players A tmp to H tmp and vise versia. 
// Untill ai() changes the player to A. 
// for that player, toggleplayer() will change the player back to H and then it will
// be H turn.
// procees to choos for the best move:
// AI check each option to find a winning.
// If a winning was found it cleard the bord and place it's move.
// If not, it search for the Human options after it's move and if it 
// descover that Human can win it choos his move inorder to block it.
// clearing the bord is done with the function clearAIgueses() that selects
// all cells with '.AIguess' and change their value to 0, and replace the classs
// again to 'spot' inorder to get the board clean again to try the second option.
// future enhance: evaluate score function to grade each move option
//                 evaluate Minimax - alpha beta pruning algoritem
//                 set selection for the return result move of Minimax.
function aiMaster(Aoptions) {
	var AImove; // AI chosen cell box to play
	var Hmove;  // Human chosen cell box to play
	var Hoptions = []; //  H options for a move
	// start with random move and loop frew the board to find a better one.
	var bestMove = Aoptions[Math.round((Aoptions.length-1)*Math.random())];
	for (var i = 0; i < Aoptions.length; i++) {
		player = -2;
		AImove = Aoptions[i];
		printSymbol(AImove);
		// check game status
		GameState($('.gameCell'),AImove);
		//states of the game are:
		//"Didn't Start" ; 'AI win' ; 'Human win'; 'The Game is Draw'; 		
		if (gameTerminal == 'AI win') {
			bestMove = AImove;
			clearAIgueses(AImove);
			return bestMove;
		}		
		// now lets look what H options are:
		Hoptions = searchForEmptyCells();
		//if the returned object is an empty array of columns, length=0		
		if (Hoptions.length) {
			for (var k = 0; k < Hoptions.length; k++) {
				player = 2;
				Hmove = Hoptions[k];
				printSymbol(Hmove);
				// check game status
				GameState($('.gameCell'),Hmove);
				clearAI_Hgueses(Hmove);
				//states of the game are:
				//"Didn't Start" ; 'AI win' ; 'Human win'; 'The Game is Draw'; 				
				if (gameTerminal == 'Human win') {
					// if Human player is going to win, lets block it !
					// let's us take it's move.
					// clear the borad from guessing and take action !
					clearAIgueses(AImove)
					bestMove = Hmove; 
					return bestMove;
				}
			}
		clearAIgueses(AImove); // clear the bord from AI guses
		}
	}
	return bestMove;
}