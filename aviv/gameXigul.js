/*jslint devel: true */

var intPlayer = 1,
	intMaxPlayers = 2,
	iDimX = 3,
	iDimY = 3,
	strPlayerSymbol1 = "X",
	strPlayerSymbol2 = "O",
	strPlayerSymbol3 = "+",
	strPlayerSymbol4 = "$",
	strPlayerSymbol5 = "@",
	fz = '7rem',
	aGameMap = [];

function createGameMap(x, y) {

	'use strict';
	
	var i,
		k;
	
	// first delete privious array
	aGameMap = [];
	// now create the array
	for (i = 1; i <= y; i++) {
		aGameMap[i] = [x];
	}
	// enter '' to all the array
	for (i = 1; i <= y; i++){
		for (k = 1; k <= x; k++) {
			aGameMap[i][k] = ' ';
		}
	}
}

function bSearchWin(y, x) {
	
	'use strict';

	var i,
		k,
		bWin = false,
		str = '',
		strWin = '',
		intWinCounter;
	//decide the strWin
	for (i = 1 ; i<= iDimX; i++){
		strWin += aGameMap[y][x];
	}
	
//	direction(y, yDir, x, xDir,str,newY,newX)
// y,y is the position in the multidemantion array of the starting point.
// yDir and xDir are the diretions to go (+1,-1)
// str is the string to search in the array.
// newY,Newx is the position of the new place to search in the array.	
	if (!bWin) {
		//row check
		//go right:
		str = direction(y, 0, x,+1,"",y,x);
		//go lefr: (and add the previous result)
		str = direction(y, 0, x,-1,str,y,x);
		//add curent place
		str += aGameMap[y][x];
		bWin  = (str == strWin) ?  true : bWin = false ;
	}
	
	if (!bWin) {
		//column check
		//go down:
		str = direction(y,+1, x,0,"",y,x);
		//go up: (and add the previous result)
		str = direction(y,-1, x,0,str,y,x);
		//add curent place
		str += aGameMap[y][x];
		bWin  = (str == strWin) ?  true : bWin = false ;
	}

	if (!bWin) {
		//left diagonal
		//go down:
		str = direction(y,+1, x,+1,"",y,x);
		//go up: (and add the previous result)
		str = direction(y,-1, x,-1,str,y,x);
		//add curent place
		str += aGameMap[y][x];
		bWin  = (str == strWin) ?  true : bWin = false ;
	}

	if (!bWin) {
		//right diagonal
		//go down:
		str = direction(y,+1, x,-1,"",y,x);
		//go up: (and add the previous result)
		str = direction(y,-1, x,+1,str,y,x);
		//add curent place
		str += aGameMap[y][x];
		bWin  = (str == strWin) ?  true : bWin = false ;
	}

	return bWin;
}
	


function onClickBox() {

    'use strict';
	
	var bWin = false,
		str,
		x,
		y;
	// on mouseclick:
	// if the box already been marked the condiion will be true  
	// therefore skip all and return back.
	 // inorder not to click twice a botton that already occupied.
	if(this.className.includes('marked')) {
		return;
	}
	// print player symbol, add marked class and update value in array
	switch (intPlayer) {
		case 1:
			this.value = strPlayerSymbol1;
			break;
		case 2:
			this.value = strPlayerSymbol2;
			str=this.id;
			break;
		case 3:
			this.value = strPlayerSymbol3;
			str=this.id;
			break;
		case 4:
			this.value = strPlayerSymbol4;
			str=this.id;
			break;
		case 5:
			this.value = strPlayerSymbol5;
			str=this.id;
			break;
		default:
			alert ("invalid player number riched");
					 }
	str=this.id;
	//box21 slice(3,4) = 2 , slice(4,5)=1
	y = parseInt(str.slice(3,4));
	x = parseInt(str.slice(4,5));
	aGameMap[y][x] = intPlayer;
	this.setAttribute ('class', this.className + ' marked');
	//search for a bWin situation
	bWin = bSearchWin(y,x);
	if (bWin) {
		// alert for winner
		printWiner();
	} else {
		// next player
	if (intPlayer < intMaxPlayers) {
	   intPlayer++;
	   } else {
		   intPlayer = 1;
	   }
	}
}

function printWiner(){
	var p = document.getElementById('winnerGif');
	if (!p.className) {
		p.className = "imganim";
		p.style.visibility = "visible";
	} else {
		p.removeAttribute('class');
		p.style.visibility = "hidden";
	}
	gameOver();
}

function gameOver() {
	
	    'use strict';

	var elm = document.getElementsByClassName('box');
	for (var i = 0 ; i < elm.length; i++) {
		elm[i].className += " marked";
	}
}

// isue: add the symbol of player to the curseure.
function onMouseEnterBox() {
	
	'use strict';
	
	// a marked box asigned with class = marked
    var strThisClass = this.className;
	
	if (!strThisClass.match(/marked/g)) {
		//set class marked if it isn't marked already
		strThisClass += ' hover';
		this.setAttribute('class', strThisClass);
	}
}

function onMouseLeaveBox() {

    'use strict';

    //if hover class added in onMouseEnter
	// replace the class with the original box class
	if (this.className.match(/hover/g)) {
		this.setAttribute('class', 'box');
	}

}

function createBox(intYdimantion, intXdimantion) {

    'use strict';

    var box,
		aList,
		amount = intYdimantion * intXdimantion,
        loopStop = amount,
        x,y,
        parent = document.querySelector("#board"),
		boxHeight,
		boxWidth = (100 / intXdimantion) + "%";
    //----------------------------------------------
	// first remove old boexs if exist
	// Get the <main> element with id="board"
	aList = document.getElementById("board");
	// As long as <main> has a child node, remove it
	while (aList.hasChildNodes()) {
		aList.removeChild(aList.firstChild);
	}
	
	box = document.getElementsByClassName('box');
	// css remove-> display:none.
	for(var i = 0; i < box.length; i++ ) {
		box[i].parentNode.removeChild
		strClass = box[i].className;
		strClass += ' remove';
		box[i].setAttribute('class', strClass);
	}
	//---------------------------------------------
	// create boexes
	//
    for (y = 1; y <= intYdimantion; y++) {
		for (x = 1; x <= intXdimantion; x++) {
		//creeate input element
        box = document.createElement('input');
		box.setAttribute('type', 'button');
        //attache the <input> to it's parent "#board
        parent.appendChild(box);
        //set class box and id box11,box12, box13,...
        box.setAttribute('class', 'box');
		//id of row and column
		box.setAttribute('id', 'box' + y + x);
		//set the width of the box
        box.style.width =  boxWidth;
		//set font size
		box.style.fontSize = fz;
		//get calculated style value of box width (by its ID) and set it as px for height
		box.style.height = window.getComputedStyle(document.getElementById('box' + y + x), null).getPropertyValue('width');
		document.getElementById('box' + y + x).addEventListener('click', onClickBox);
		document.getElementById('box' + y + x).addEventListener('mouseenter', onMouseEnterBox);
		document.getElementById('box' + y + x).addEventListener('mouseleave', onMouseLeaveBox);
		}
    }
}

function boxResize() {

	'use strict';
	
	// fixing the height acording to box width.
	var i,
		aBox = document.getElementsByClassName('box'),
		loopStop = aBox.length;
	
	for (i = 0; i < loopStop; i = i + 1) {
     	// get calculated width value of the box and set it to its height property.
		// the width is in vw value so it is resizes acording to the new screen demantion.
		aBox[i].style.height = window.getComputedStyle(aBox[i], null).getPropertyValue('width');
	}
}

function init() {
    
    'use strict';
	//board dimention Y * X
	//create the memory board and then display it.
	// set event for select box of nomber players
	//set event for button newGame
	document.getElementById('players').onchange = changePlayers;
	
	document.getElementById('newGame').onclick = newGame;

    newGame();
	
}

window.onload = init;
window.onresize = boxResize;

function changePlayers(){
	var str = this.value,
		arrElm;
	//position start from 0
	//take the first letter:
	intMaxPlayers = str.slice(0,1);
	iDimX = str.slice(1,2);
	iDimY = str.slice(2,3);
	intPlayer = 1;
	switch (Number(intMaxPlayers)) {
		case 2:
			fz = '7rem';
			break;
		case 3:
			fz = '3rem';
			break;
		case 4:
			fz = '1.5rem';
			break;
		case 5:
			fz = '1.2rem';
			break;
		default:
			fz = '1rem';
			console.log("error in line 306, switch function default has reached in changeplayers()");
			break;
				 }
	
    	newGame();
}

function newGame() {
	intPlayer = 1;
	var p = document.getElementById('winnerGif');
	p.removeAttribute('class');
	p.style.visibility = "hidden";
	createGameMap(iDimX, iDimY);
	createBox(iDimX, iDimY);
}
// issue: for large screen the size of the board is too height !
//
//function screenDimantions() {
//	
//	'use strict';
//	var strHeight = window.getComputedStyle(document.getElementsByTagName('html')[0], null).width,
//		strWidth = window.getComputedStyle(document.getElementsByTagName('html')[0], null).height;
//}
