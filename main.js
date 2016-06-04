var canvas, canvasContext;

var ballX = 75;
var ballSpeedX = 5;

var ballY = 75;
var ballSpeedY = 5;

var paddleWidth = 100;
var paddleThickness = 10;
var paddleDistFromEdge = 60;
var paddleX = 400;

var mouseX = 0;
var mouseY = 0;

var brickWidth = 80;
var brickHeight = 20;
var brickColums = 10;
var brickRows = 14;
var brickGap = 2;

var brickGrid  = [];

function brickReset() {
	// iterate over size of whole matrix, w*h
	for (var i = 0; i < brickColums * brickRows; i++) {
		brickGrid.push(true);
	}
}

// where the magic happens
window.onload = function() {
	canvas = document.getElementById('game-canvas');
	canvasContext = canvas.getContext('2d');

	var fps = 30;
	setInterval(updateAll, 1000/fps);

	canvas.addEventListener('mousemove', updateMousePosition)

	brickReset();
}
// 

function updateMousePosition(e) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;

	// for sanity sake: take mouse X coord and subtract out how far canvas is from left side
	// and how far the user has scolled side to side.  Same for Y.
	mouseX = e.clientX - rect.left - root.scrollLeft;
	mouseY = e.clientY - rect.top - root.scrollTop;

	paddleX = mouseX - paddleWidth/2;
}

function ballReset() {
	ballSpeedX = 5;
	ballX = canvas.width/2
	ballY = canvas.height/2
}

function updateAll() {
	moveAll();
	drawAll();
}

function moveAll() {
	ballX+= ballSpeedX;
	ballY+= ballSpeedY;
	
	if (ballX < 0) { // left
		ballSpeedX *= -1;
	}
	if (ballX > canvas.width) { // right
		ballSpeedX *= -1;
	}	
	if (ballY < 0) { // top
		ballSpeedY *= -1;
	}
	if (ballY > canvas.height) { // bottom
		ballReset();
	}

	var paddleTopEdgeY = canvas.height - paddleDistFromEdge;
	var paddleBottomEdgeY = paddleTopEdgeY + paddleThickness;
	var paddleLeftEdgeX = paddleX;
	var paddleRightEdgeX = paddleLeftEdgeX + paddleWidth;

	if (ballY > paddleTopEdgeY && // below the top of paddle
	 	ballY < paddleBottomEdgeY && // above bottom of paddle
	 	ballX > paddleLeftEdgeX && // right of left-most edge of paddle
	 	ballX < paddleRightEdgeX) { // left of right-most edge of paddle

		ballSpeedY *= -1;

		var centerOfPaddleX = paddleX + paddleWidth/2;
		var ballDistFromPaddleCenterX = ballX - centerOfPaddleX;

		// will only happen if collission detected by this if statement
		// 0.35 helps scale down the speed a bit
		ballSpeedX = ballDistFromPaddleCenterX * 0.35;
	}
}

function drawAll() {
	colorRect(0, 0, canvas.width, canvas.height, 'black');
	colorCircle(ballX, ballY, 10, 'white');
	colorRect(paddleX, canvas.height - paddleDistFromEdge, paddleWidth, paddleThickness);

	drawBricks();

	// helps our colorText now show what columns and row we're in
	var mouseBrickCol = Math.floor(mouseX / brickWidth);
	var mouseBrickRow = Math.floor(mouseY / brickHeight);
	var brickIndexUndeerMouse = rowColToArrayIndex(mouseBrickCol, mouseBrickRow);
	// will use this as measuring stick to see where bricks are
	colorText(mouseBrickRow + ',' + mouseBrickCol + ': ' + brickIndexUndeerMouse, mouseX, mouseY, 'yellow');

	if (brickIndexUndeerMouse >= 0 && brickIndexUndeerMouse < brickColums * brickRows) {
		brickGrid[brickIndexUndeerMouse] = false;
	}
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(topLeftX,topLeftY,boxWidth,boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}

function colorText(showWords, textX, textY, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillText(showWords, textX, textY);
}

function rowColToArrayIndex(col, row) {
	return col + brickColums * row;
}

function drawBricks() {

	for (var eachRow = 0; eachRow < brickRows; eachRow++) {
		for (var eachColumn = 0; eachColumn < brickColums; eachColumn++) {

			// for each row we go down, add an entire row (or set of columns) to our index.  For each over, add 1 column.
			var arrayIndex = rowColToArrayIndex(eachColumn, eachRow);

			if (brickGrid[arrayIndex]) {
				colorRect(brickWidth * eachColumn, brickHeight * eachRow, brickWidth - brickGap, brickHeight - brickGap, 'blue');
			}
		}
	}
}











