var canvas, canvasContext;

var ballX = 75;
var ballSpeedX = 5;

var ballY = 75;
var ballSpeedY = 5;

var paddleWidth = 100;
var paddleThickness = 10;
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
	// and how far the user has scolled side to side.  Same for Y coord.
	var mouseX = e.clientX - rect.left - root.scrollLeft;
	// var mouseY = e.clientY - rect.top - root.scrollTop;

	paddleX = mouseX - paddleWidth/2;
}

function updateAll() {
	moveAll();
	drawAll();
}

function moveAll() {
	ballX+= ballSpeedX;
	ballY+= ballSpeedY;
	
	if (ballX < 0) {
		ballSpeedX *= -1;
	}
	if (ballX > canvas.width) {
		ballSpeedX *= -1;
	}	
	if (ballY < 0) {
		ballSpeedY *= -1;
	}
	if (ballY > canvas.height) {
		ballSpeedY *= -1;
	}
}

function drawAll() {
	colorRect(0, 0, canvas.width, canvas.height, 'black');
	colorCircle(ballX, ballY, 10, 'white');
	colorRect(paddleX, canvas.height - paddleThickness, paddleWidth, paddleThickness);
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













