/*
		AI   -    M A S T E R
		---------------------
For moveCount = 1 , random selection in ai() function.
For other moveCount, this function is called

*/
function aiMaster(options) {
	var move; // AI/Human chosen cell box to play
	// start with random move and loop frew the board to find a better one.
	var maxA = Number.NEGATIVE_INFINITY;
	var maxH = Number.NEGATIVE_INFINITY;
	var bestA = [] , bestH = [],lastId;
	var temp = [],index;
	var humanCanWin = false, humanCanWinPlace;
	var random = options[Math.round((options.length-1)*Math.random())];
	var bestMove = random;
	var min;
	var obj = {};
	if (moveCount == 1) {
		lastId = $(_lasPos).attr('id').substr(0,3);
		console.log("_lasPos: "+lastId);
		switch(lastId) {
			case '1-1' :
			case '3-3' :
			case '1-3' :
			case '3-1':
				bestMove = $("#2-2");
				break;
			case '1-2':
				bestMove = $("#1-1");
				break;
			case '2-1':
				bestMove = $("#1-1");
				break;
			case '3-2':
				bestMove = $("#1-2");
				break;
			case '2-3':
				bestMove = $("#1-3");
				break;
			case '2-2':
				bestMove = $("#1-1");
				break;
			default:
				bestMove = random;
		}
		console.log("moveCount: "+moveCount);
		console.dir(" bestmove: "+$(bestMove).attr('id'));
		return bestMove;
	} 
	for (var i = 0; i < options.length; i++) {
		player = -2;
		if (simulation(options[i])) {
			bestMove=options[i];
			return bestMove;
		} else if (winner.potentialCounter >= maxA) {
			maxA = winner.potentialCounter;
			obj = {"score" : maxA,
				   "place" : options[i]}
			bestA.push(obj);
		}
		player = 2;
		if (simulation(options[i])) {
			bestMove=options[i];
			humanCanWin = true;
			humanCanWinPlace = bestMove;
		} else if (winner.potentialCounter >= maxH) {
			maxH = winner.potentialCounter;
			obj = {"score" : maxH,
				   "place" : options[i]}
			bestH.push(obj);
			console.dir(obj);
		}
	}
	if (humanCanWin) {
		return humanCanWinPlace;
	} else if ($("#2-2").attr("value").substr(0,1) == 'A') {
		for (var i = 0 ; i < bestH.length ; i++) {
			for (var j = 0 ; j < bestA.length ; j++ ) {
				if (bestH[i].score == 2){
					if (moveCount < 4) {
						if (bestA[j].place != bestH[i].place) {
							bestMove = bestA[j].place ;
							return bestMove;
						}
					} else if (bestA[j].place == bestH[i].place) {
							bestMove = bestH[i].place ;
							return bestMove;							   
						}
						
				}
			}
		}
	}
	if (maxH > maxA) {
		for (var i = 0 ; i < bestH.length ; i++) {
			for (var j = 0 ; j < bestA.length ; j++ ) {
				if (bestA[j].place == bestH[i].place && bestH[i].score == 2){
						bestMove = bestA[j].place ;
						return bestMove;
					}
			}
		}
		bestMove = bestH[Math.round((bestH.length-1)*Math.random())].place;	
	} else {
		max = bestA[0].score;
		bestMove = bestA[0].place;
		for (var i = 1 ; i < bestA.length ; i++) {
			if (bestA[i].score > max) {
				max = bestA[i].score;
				bestMove = bestA[i].place;
				}
		}
	}
	return bestMove;
}

function simulation(move) {
	printSymbol(move);
	// check game status
	GameState(move);
	 // clear the bord from AI guses
	(player==-2) ? clearAIgueses(move) : clearAI_Hgueses(move);
	if (gameTerminal == 'AI win' || gameTerminal == 'Human win') {
		return true;
	} else {
		return false;
	}
}