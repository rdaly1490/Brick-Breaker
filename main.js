var canvas, canvasContext;

var ballX = 75;
var ballSpeedX = 5;

var ballY = 75;
var ballSpeedY = 5;

var paddleWidth = 100;
var paddleThickness = 10;
var paddleDistFromEdge = 60;
var paddleX = 400;

window.onload = function() {
	canvas = document.getElementById('game-canvas');
	canvasContext = canvas.getContext('2d');

	var fps = 30;
	setInterval(updateAll, 1000/fps);

	canvas.addEventListener('mousemove', updateMousePosition)
}

function updateMousePosition(e) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;

	// for sanity sake: take mouse X coord and subtract out how far canvas is from left side
	// and how far the user has scolled side to side.
	var mouseX = e.clientX - rect.left - root.scrollLeft;

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













