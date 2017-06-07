function creatCanvas () {
	var h_canvas = $('#gameBoard').height()+"px";
	var w_canvas = $('#gameBoard').width()+"px";
	var position = $('#gameBoard').position();
	var t_canvas = position.top;
	var l_canvas = position.left;
	var canvas = $("<canvas>");
	canvas.attr('id','canvas');
	canvas.css({'height' : h_canvas ,'width': w_canvas} );
	canvas.css({'top' : t_canvas ,'left': l_canvas} );

	$("#bdy").append(canvas);
}
// @params boolean true to show the canvas false to hide.
function canvas_show(bShow) {
	var show = bShow ? '5' : '-1';
	$("#canvas").css('z-index',show);
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
	var x = (no * 2) - 1;
	var canvas = document.getElementById('canvas');
	h_canvas = canvas.height;
	w_canvas = canvas.width;
	var c = canvas.getContext('2d');
	//first clear the canvas
	c.clearRect(0,0,w_canvas,h_canvas);
	c.strokeStyle = "black";
	c.lineWidth = 5;
	c.beginPath();
	switch (where) {
		case 'column':
			c.moveTo((x*w_canvas/6),(h_canvas/6));
			c.lineTo((x*w_canvas/6),(5*h_canvas/6));
			break;
		case 'row':
			c.moveTo((w_canvas/6),(x*h_canvas/6));
			c.lineTo((5*w_canvas/6),(x*h_canvas/6));		
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
