/*jslint devel: true */

var intPlayer = 1,
	intMaxPlayers = 2,
	iDimX = 3,
	iDimY = 3,
	strPlayerSymbol1 = "X",
	strPlayerSymbol2 = "O",
	aGameMap = [];

function createGameMap(x, y) {

	'use strict';
	
	var i;
	
	for (i = 1; i <= y; i++) {
		aGameMap[i] = [x];
	}
}

function bSearchWin(y, x) {
	
	'use strict';

	var i,
		bWin = false,
		str = '',
		intWinCounter;
	//check for the row (all the columns with the same value)
	for (i = 1; i <= iDimX; i++) {
		str += aGameMap[y][i];
	}
	
	(str == '111' || str == '222') ? bWin = true : bWin = false ;
	str = '';
	
	if (!bWin) {
		//check for the column (all the rows with the same value)
		for(i = 1; i <= iDimY ; i++) {
			str += aGameMap[i][x];
		}
		(str == '111' || str == '222') ? bWin = true : bWin = false ;
		str = '';
	}
//	if (!bWin) {
//		//check for the diagonal
//		//x-1;y-1 and x+1;y+1 or
//		//x-1;y+1 and x+1;y-1
//		for (i = 1; i <= y; i++) {
//		aGameMap[y][i] == aGameMap[y][x] ? bWin = bWin & true : bWin = bWin & false;
//		}
//	}
	return bWin;
}
	
function gameOver() {
	
	    'use strict';

	alert("gameover");
}

function onClickBox() {

    'use strict';
	
	var bWin = false,
		str,
		x,
		y;
	// on mouseclick:
	// if the box already contains a value the condiion will be true if(this.value) 
	// therefore skip all and return back.
	 //
	if(this.value) {
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
		default:
			alert ("invalid player number riched");
					 }
	str=this.id;
	//box21 slice(3,4) = 2 , slice(4,5)=1
	y = parseInt(str.slice(3,4));
	x = parseInt(str.slice(4,5));
	aGameMap[y][x] = intPlayer;
	this.setAttribute ('class', ' marked');
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
	alert("Winner !!!");
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
		strClass,
		amount = intYdimantion * intXdimantion,
        loopStop = amount,
        x,y,
        parent = document.querySelector("#board"),
        boardWidth = "25vw",
		boxHeight,
		boxWidth = (100 / intXdimantion) + "%";
	
	parent.style.width = boardWidth;
	
    
	// first remove the old board if exist
	
	box = document.getElementsByClassName('box');
	// css remove-> display:none.
	for(var i = 0; i < box.length; i++ ) {
		strClass = box[i].className;
		strClass += ' remove';
		box[i].setAttribute('class', strClass);
	}
		
	
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
	document.getElementById('players').onchange = changePlayers;

    createGameMap(iDimX, iDimY);
	createBox(iDimX, iDimY);
	
}

window.onload = init;
window.onresize = boxResize;

function changePlayers(){
	var str = this.value;
	//position start from 0
	//take the first letter:
	intMaxPlayers = str.slice(0,1);
	iDimX = str.slice(1,2);
	iDimY = str.slice(2,3);
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
