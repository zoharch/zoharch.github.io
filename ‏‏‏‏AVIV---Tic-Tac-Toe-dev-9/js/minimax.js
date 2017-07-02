/*
Alpha–beta pruning
-------------------
01 function alphabeta(node, depth, α, β, maximizingPlayer)
02      if depth = 0 or node is a terminal node
03          return the heuristic value of node
04      if maximizingPlayer
05          v := -∞
06          for each child of node
07              v := max(v, alphabeta(child, depth – 1, α, β, FALSE))
08              α := max(α, v)
09              if β ≤ α
10                  break (* β cut-off *)
11          return v
12      else
13          v := +∞
14          for each child of node
15              v := min(v, alphabeta(child, depth – 1, α, β, TRUE))
16              β := min(β, v)
17              if β ≤ α
18                  break (* α cut-off *)
19          return v
(* Initial call *)
alphabeta(origin, depth, -∞, +∞, TRUE)

*/

// AI Master
// options[] are all the empty cells available for a move.
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
// AI check each option to find a winning using alpha beta prunning algorithem.
// If a winning was found it clears the bord and place it's move.

//@node = cell option to play
function alphabeta(node, depth, α, β, maximizingPlayer) {
    var score,tempScore, v , child;  
		printSymbol(node);
		// check game status
		GameState($('.gameCell'),node);
	if (depth == 0 || 
		gameTerminal.includes("win") || 
		gameTerminal.includes("Draw"))   
	{
		switch(gameTerminal) 
		{
		  case 'AI win': score = depth+100;
			  break;
		  case 'Human win': score = depth - 100;
			  break;
		  default: score = 0;
		 }
//------------------------------
console.log("score: "+score+" depth: "+depth );
console.log("-------");
console.log($("#1-1").attr('value').substr(0,1)+"-"+$("#1-2").attr('value').substr(0,1) +"-"+$("#1-3").attr('value').substr(0,1));
console.log($("#2-1").attr('value').substr(0,1)+"-"+$("#2-2").attr('value').substr(0,1) +"-"+$("#2-3").attr('value').substr(0,1));
console.log($("#3-1").attr('value').substr(0,1)+"-"+$("#3-2").attr('value').substr(0,1) +"-"+$("#3-3").attr('value').substr(0,1));
console.log("-------");
//------------------------------
		if (maximizingPlayer) {
			clearAI_Hgueses(node);
		} else {
			clearAIgueses(node);
		}
		return score;
	 }
          
      if (maximizingPlayer) {
		  player = -2;
          v = Number.NEGATIVE_INFINITY ;
		  child = searchForEmptyCells();
		  for (var i = 0 ; i < child.length ; i++) {
			  tempScore = alphabeta(child[i],child.length , α, β, false);
			  clearAI_Hgueses(child[i]);
			  if (tempScore > v) {
				v = tempScore;
			  }
            α = Math.max(α, v);
            if (β <= α) 
				break; //(* β cut-off *)
			
		  }
		  console.log("max: "+v);
          return v;
	  }
      else { //minimizer player
		  player = 2;//switch player
          v = Number.POSITIVE_INFINITY;
		  child = searchForEmptyCells();
		  for (var i = 0 ; i < child.length ; i++) {
			  tempScore = alphabeta(child[i],child.length , α, β, true);
			  clearAIgueses(child[i]);
			  if (tempScore < v) {
				v = tempScore;
			  }
              β = Math.min(β, v);
              if (β <= α) 
				  break; //(* α cut-off *)
		  }
		  console.log("min: "+v);
          return v;
	  }
}
//(* Initial call *)
//alphabeta(origin, depth, -∞, +∞, TRUE)
function paint_aiBoard(i,length) {
	var x = $("#gameBoard").children();
	var div;
	var val = "";
	for (var k = 0 ; k < x.length ; k++) {
		div = $("<div>");
		div.attr('id',"ai-"+k+i);
//		div.css({'height':'100px'});
		div.addClass('col-4');
		val = $($("#gameBoard").children()[k]).attr('value');
		div.html(val);
		div.attr('value',val);
		$("#AIboard").append(div);
	}
	$("#AIboard").append($("<hr>"));
	$("#ai-0"+i).addClass('border border-top-0 border-left-0');
	$("#ai-1"+i).addClass('border border-top-0');
	$("#ai-2"+i).addClass('border border-top-0 border-right-0');
	$("#ai-3"+i).addClass('border border-left-0');
	$("#ai-4"+i).addClass('border');
	$("#ai-5"+i).addClass('border border-right-0');
	$("#ai-6"+i).addClass('border border-bottom-0 border-left-0');
	$("#ai-7"+i).addClass('border border-bottom-0');
	$("#ai-8"+i).addClass('border border-bottom-0 border-right-0');
}

function minimax(options) {
	var AImove,tempScore; // AI chosen cell box to play
	// start with random move and call alpha beta.
	var maxScore = Number.NEGATIVE_INFINITY ; 
//	var bestMove = options[Math.round((options.length-1)*Math.random())]
	for (var i = 0 , tempScore; i < options.length ; i++) {
		player = -2;
		tempScore = alphabeta(options[i], options.length, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true);
		if (tempScore > maxScore) {
			maxScore = tempScore;
			bestMove = options[i];
			}
		clearAIgueses(options[i]);
//		paint_aiBoard(i,options.length);
	}
	return bestMove;
}

