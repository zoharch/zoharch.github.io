const MAX_ROWS = 3;
const MAX_COLS = 3;
const X = "img/x-png-18.png";
const O = "img/O-Jolle_insigna.png";
//*********************************************
//------------------------------------------------
// global 
//
    var winner = new Object();
	var levelUpdate = false;
	var levelMsg = "";
// 
//------------------------
//on load Jquery :
$(function () {
	$("#loading").css('display','none');
	$("#idAiSelect").on("click",{value: 0},gameType);
	$("#idFreind").on("click",{value: 1},gameType);
	$("#gameBoard").on("click",".gameCell",spotClick);
	hearts_paint(3);
	$("#indicators").css("visibility","visible");
	progressBarInit();
	showLevel();
	board_paint();
	$("#newGame").on("click",newGame);
//	testHumanWin(2);
});
function newGame() {
	moveBack();
	adaptationToNavbar();
	restart();
}
function progressBarshow(bState) {
	bState ? $("#sucessProgress").show() : $("#sucessProgress").hide();
}
function progressBarInit() {
	win_count = 0;
	updateProgress(win_count);
}   
function updateProgress(x) {
	$("#sucessProgress").css('width',x+"%");
	$("#sucessProgress").attr("aria-valuenow",String(x));
	$("#id_progress_text").html(String(x)+"%");
}
function gameType(event) {
	// tofggle button
	if ($(this).attr('aria-pressed')=="true") 
		return;
	adaptationToNavbar();
	$(this).attr('aria-pressed',"true");
	var id_SyblingButton = $(this).attr('id') == "idFreind" ? "#idAiSelect" : "#idFreind";
	$(id_SyblingButton)
		.attr('aria-pressed',"false")
		.removeClass("active");
	$(this).addClass("active");
	friend  =  event.data. value;
	//adapt ui acordingly
	var h = $("#indicators").height();
	if (friend==1) {
		$("#indicators").addClass("hidden");
		$("#paddingEmpty")
			.css("height",h)
			.removeClass("hidden");
	} else {
		$("#indicators").removeClass("hidden");
		$("#paddingEmpty").addClass("hidden");
	}
	restart();
}
function adaptationToNavbar() {
	//navbar collapse handle
	if ($("#btnCollapse").attr("aria-expanded")) {
		$("#btnCollapse").attr("aria-expanded","false").addClass("collapsed");
		$("#navbarSupportedContent").attr("aria-expanded","false").removeClass("show")
	}
}

function hearts_paint(x) {
	var heart;
//	var h = $("#nav").height()/2;
	for (var i = 1; i <=x ; i ++ ) {
		heart = $("<img>");
		heart
			.attr({
			"id" : "heart"	+ i ,
			'src' : "img/heart1.png"
				})
			.css('height',"5vh");
	$("#hearts").append(heart);	
	}
}
//*********************************************
// painting board game and setting click event 
function board_paint() {
	var x,y,div;
	//using clientWidth and clientHeight for IE8 and earlier
	const OVERALL_HEIGHT = window.innerHeight || 
		  document.documentElement.clientHeight ||
		  document.body.clientHeight;
	const NAV_HEIGHT = $("#nav").height();
	var gamcellHeight =(OVERALL_HEIGHT-NAV_HEIGHT)/MAX_ROWS;
	gamcellHeight = 100 * (gamcellHeight-2) / OVERALL_HEIGHT;
	// loop:
	for (y = 1; y <= MAX_ROWS; y++) {
		for (x = 1; x <= MAX_COLS; x++) {
			div = $("<div>");
			div.addClass('gameCell bg-primary col-4 spot');
			div.css({
				'height': gamcellHeight+'vh',
				'display': 'flex',
				'align-items': 'center',
				'justify-content': 'center'
			});
			div.attr('id',y+'-'+x);
			div.attr('value',0);
			$("#gameBoard").append(div);
		}
		$("#1-1").addClass('border border-top-0 border-left-0');
		$("#1-2").addClass('border border-top-0');
		$("#1-3").addClass('border border-top-0 border-right-0');
		$("#2-1").addClass('border border-left-0');
		$("#2-2").addClass('border');
		$("#2-3").addClass('border border-right-0');
		$("#3-1").addClass('border border-bottom-0 border-left-0');
		$("#3-2").addClass('border border-bottom-0');
		$("#3-3").addClass('border border-bottom-0 border-right-0');
	}
}

function printSymbol(_this) {
	
	var symbol = (player > 0) ? X : O ;
	var val,img,h,w;
	switch (player) {
		case 0:
			val = 'F';
			break;
		case 1:
			val = 'H';
			break;
		case -1:
			val = 'A';
			break;
		case 2:
			val = 'H tmp';
			$(_this).addClass('AI-Hguess');
			break;
		case -2:
			val = "A tmp";
			$(_this).addClass('AIguess');
			break;
		default:
			console.log("unavailable player"+player);
	}
	$(_this).attr('value',val).removeClass('spot');
	// player A/H tmp are the middle process of AI calculating it's best move.
	// therefore the img is not showed on the board.
	if (Math.abs(player) == 1 || player==0) {
		img = $("<img>");
		img.attr("src",symbol);
		h = $(_this).height();
		w = $(_this).width();
		if (h<w) {
			img.css("height",h+"px");
		} else {
			img.css("width",w+"px");	
		}	
		$(_this).append(img);	
	}
}

// clear the bord from AI guses
function clearAIgueses(gameCell) {
	$(gameCell).attr('value',0);
	$(gameCell).addClass('spot').removeClass('AIguess');
}

// clear the bord from AI guses
function clearAI_Hgueses(gameCell) {
	$(gameCell).attr('value',0);
	$(gameCell).addClass('spot').removeClass('AI-Hguess');
}

function restart() {
	console.log("restart");
	gameTerminal = "Didn't Start";
	player = 1;
	levelUpdate = false;
	winner.bwin = false;
	moveCount = 0;
    $('#GameModal').hide();
	$("#HeartAnimation").css("z-index","-5").empty();
    $('#gameBoard').empty();
	if ($("#canvas").length != 0) {
		$("#canvas").remove();
	}
    board_paint() ;
	showLevel();
}
function showLevel() {
	$("#level").html(" רמה - " + level + "   ");
}
function showGameModal () {
	console.log("showGameModal");
	var str;
	switch(gameTerminal) {
		case 'Human win':
			str = 'כל הכבוד !!  ניצחת !';
			break;
		case 'AI win':
			str = 'אני ניצחתי.';
			break;
		case 'The Game is Draw':
			str = 'תקו.';
			break;			
		default:
			console.log ('showGameModal Called when the state of the game was: ' + gameTerminal );
		   }
	if (levelUpdate) {
		if (levelMsg > 0) {
			str = 'כל הכבוד, עלית רמה !!!';
		} else {
			str = 'ירדת רמה, עכשיו יהיה קל יותר';	
		}
	}
    $("#msg").html(str);
	if (friend == 0) {
		moveProgressAndHearts();
	}
	circleDivInit();
    $('#GameModal')
		.removeClass("hidden")
		.fadeIn(3000,function() {
		heartAnimation();
	});
	$("#circle_h1").removeClass("hidden")
}
function moveProgressAndHearts () {
	//move hearts
	$("#hearts").appendTo($("#HeartCopy"));
	$("#hearts img").each(function(){
		$(this).css("height","10vh");
		});
	// copy progress bar
$("#progressContainer").appendTo($("#ProgressCopy"))
	$("#sucessProgress").css({"height": "3vh",
							  "line-height" : "3vh",
							 "font-size":"1rem"});
	if (levelUpdate) {
		$("#ProgressCopy").hide();
		levelUpdate = false;
	} else {
		$("#ProgressCopy").show();
	}
}
function heartAnimation() {
	if (heartExplode) {
		$("#newGame").off("click");
		var position = $('#hearts img:last-child').position();
		var top = position.top;
		var left = position.left;
			$( "#hearts img:last-child" )
				.css({"position":"absolute"})
				.animate({ 
					"top": top+10, 
					"left": left,
					"width": "+=100px",
					"height": "+=100px"},
						 2000,function() {
					$("#hearts img:last-child").toggle( "explode", {pieces: 50 },2000,function() {
					$("#hearts img:last-child").remove();
					heartExplode = false;
					$("#newGame").on("click",newGame);
					})});
	}
}

function moveBack() {
	//move hearts
	$("#hearts").appendTo($("#heartTd"));
	$("#hearts img").each(function(){
		$(this).css("height","5vh");
		})
	// copy progress bar
	$("#progressContainer").appendTo($("#progressTd"))
	$("#sucessProgress").css({"height": "2vh",
							  "line-height" : "2vh",
							 "font-size":"1rem"});
	$("#HeartCopy").css("z-index","-5").empty();
}
function circleDivInit() {
	var w =	$("#GameModal").css('width');
	var h = $("#GameModal").css('height');
	var radius = parseInt(w) > parseInt(h) ? h : w ;
	$("#circleDiv").css({'width': radius ,
						  'height': radius});
//	$("#circle_h1").css({'position': 'absolute',
//						 'top': radius/4,
//						 'left': w/2,
//						 'transform': 'translate(-50%,0)'});
}