/*jslint devel: true */

var intPlayer=1;

function onClickBox() {

    'use strict';


// on mouseclick:
		// print player symbol
	
		// next playes
		// check game result    
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

function createBox(amount, boardXdimention) {

    'use strict';

    var box = [],
        loopStop = amount,
        i,
        parent = document.querySelector("#board"),
//		boardXdimention,
		boardYdimention,
        boardWidth = "25vw",
		boxHeight,
		boxWidth = (100 / boardXdimention) + "%";
	
	parent.style.width = boardWidth;
	
    
    for (i = 0; i < loopStop; i = i + 1) {
        //creeate div element
        box = document.createElement('div');
        //attache the div to it's parent "#board
        parent.appendChild(box);
        //set class box and id box0,box1..
        box.setAttribute('class', 'box');
		box.setAttribute('id', 'box' + (i + 1));
		//set the width of the box
        box.style.width =  boxWidth;
		//get calculated style value of box width (by its ID) and set it as px for height
		box.style.height = window.getComputedStyle(document.getElementById('box' + (i + 1)), null).getPropertyValue('width');
		document.getElementById('box' + (i + 1)).addEventListener('click', onClickBox);
		document.getElementById('box' + (i + 1)).addEventListener('mouseenter', onMouseEnterBox);
		document.getElementById('box' + (i + 1)).addEventListener('mouseleave', onMouseLeaveBox);
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
		console.log(aBox[i].style.height);
		console.log(aBox[i].style.width);
		
	}
}

function init() {
    
    'use strict';

    createBox(9, 3);
}

window.onload = init;
window.onresize = boxResize;

// issue: for large screen the size of the board is too height !

function screenDimantions() {
	
	'use strict';
	var strHeight = window.getComputedStyle(document.getElementsByTagName('html')[0], null).width,
		strWidth = window.getComputedStyle(document.getElementsByTagName('html')[0], null).height;
}
