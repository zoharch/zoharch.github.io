function creatCanvas () {
	var h_canvas = $('#gameBoard').height()+"px";
	var w_canvas = $('#gameBoard').width()+"px";
	var position = $('#gameBoard').position();
	var t_canvas = position.top;
	var l_canvas = position.left;
	var canvas = $("<canvas>");
	canvas.attr('id','canvas');
	canvas.attr({'height' : h_canvas ,'width': w_canvas} );
	canvas.css({'top' : t_canvas ,'left': l_canvas} );
	$("#bdy").append(canvas);
}


function canvasClear() {
	var canvas = document.getElementById('canvas');
	h_canvas = $('#canvas').height();
	w_canvas = $('#canvas').width();
	var c = canvas.getContext('2d');
	c.clearRect(0,0,w_canvas,h_canvas);
}
// @param string : 'column' , 'row' , 'Diagonal_down' , 'Diagonal_up'
// @param x int number row /column 
function paint_dash (where,no) {
	var x = 2 * no - 1 
	var canvas = document.getElementById('canvas');
	h_canvas = $('#canvas').height();
	w_canvas = $('#canvas').width();
	var c = canvas.getContext('2d');
	//first clear the canvas
	c.clearRect(0,0,w_canvas,h_canvas);
	c.strokeStyle = "black";
	c.lineWidth = 5;
	c.beginPath();
	switch (where) {
		case 'column':
			c.moveTo((x*w_canvas/6),(h_canvas/15));
			c.lineTo((x*w_canvas/6),(14*h_canvas/15));
			break;
		case 'row':
			c.moveTo((w_canvas/30),(x*h_canvas/6));
			c.lineTo((29*w_canvas/30),(x*h_canvas/6));		
			break;
		case 'Diagonal_down':
			c.moveTo((w_canvas/9),(h_canvas/9));
			c.lineTo((8*w_canvas/9),(8*h_canvas/9));
			break;
		case 'Diagonal_up':
			c.moveTo((8*w_canvas/9),(h_canvas/9));
			c.lineTo((w_canvas/9),(8*h_canvas/9));
		}
	c.stroke();
}
