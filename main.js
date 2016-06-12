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
var bricksLeft = 0;

function brickReset() {
	bricksLeft = 0;
	var i;

	// set a few rows to false to create the gutter up top
	for(i=0; i< 3*brickColums; i++) {
		brickGrid[i] = false;
	}

	// iterate over size of matrix, w*h, use predefined i variable to start after gutter created
	for(; i<brickColums * brickRows; i++) {
		brickGrid[i] = true;
		bricksLeft++;
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
	ballReset();
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

function ballMove() {
	ballX+= ballSpeedX;
	ballY+= ballSpeedY;
	
	if (ballX < 0 && ballSpeedX < 0.0) { // left
		ballSpeedX *= -1;
	}
	if (ballX > canvas.width && ballSpeedX > 0.0) { // right
		ballSpeedX *= -1;
	}	
	if (ballY < 0) { // top
		ballSpeedY *= -1;
	}
	if (ballY > canvas.height) { // bottom
		ballReset();

		// maybe add more than 1 life later
		brickReset();
	}
}

function isBrickAtColRow(col, row) {
	if(col >= 0 && col < brickColums &&
		row >= 0 && row < brickRows) {
		 var brickIndexUnderCoord = rowColToArrayIndex(col, row);
		 return brickGrid[brickIndexUnderCoord];
	} else {
		return false;
	}
}

function ballBrickHandling() {
	var ballBrickCol = Math.floor(ballX / brickWidth);
	var ballBrickRow = Math.floor(ballY / brickHeight);
	var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);

	// remove a brick if hit, conditional allows us to check we're within bounds of game
	// technically since we're using ball center, the ball can extend past the current index hit causing
	// side-wall bricks to remove the following indexed brick on the other side of the game board, since
	// it doesn't recognize bricks wrap into more rows.  Just an arr of indexes to the game.
	if(ballBrickCol >= 0 && ballBrickCol < brickColums &&
		ballBrickRow >= 0 && ballBrickRow < brickRows) {

		// only need to change ball direction of remove brick if brick is there, don't change for
		// bricks that already disappeared
		if(isBrickAtColRow( ballBrickCol,ballBrickRow )) {
			brickGrid[brickIndexUnderBall] = false;
			bricksLeft--;

			/////////////////////////////////////////

			// HERE WE CHANGE BALL DIRECTION
			// from the moment before the brick is hit compared to when the brick is hit, if
			// the row changes (i.e. row 2 to 3) we want to reflect the ball vertically because we know
			// we hit either the top of bottom.  If the column changes, we know we hit the left or
			// right side and want to reflect the ball horizontally.  If we manage to hit a corner, we
			// need to change both x and y (since both row and col change), so we fire both changes below.

			/////////////////////////////////////////

			var prevBallX = ballX - ballSpeedX;
			var prevBallY = ballY - ballSpeedY;
			var prevBrickCol = Math.floor(prevBallX / brickWidth);
			var prevBrickRow = Math.floor(prevBallY / brickHeight);

			var bothTestsFailed = true;

			// if there's not a brick adjacent to the one hit then bounce horizontally
			// otherwise there's a brick there so we can't hit that side.
			if(prevBrickCol != ballBrickCol) {
				if(isBrickAtColRow(prevBrickCol, ballBrickRow) == false) {
					ballSpeedX *= -1;
					bothTestsFailed = false;
				}
			}
			if(prevBrickRow != ballBrickRow) {
				if(isBrickAtColRow(ballBrickCol, prevBrickRow) == false) {
					ballSpeedY *= -1;
					bothTestsFailed = false;
				}
			}

			// prevents ball from squeezing through gap between bricks if corner exposed,
			// now bounces off corner properly
			// |__|__|
			//   /|  |
			//
			if(bothTestsFailed) {
				ballSpeedX *= -1;
				ballSpeedY *= -1;
			}

		}
	}
} 

function ballPaddleHandling() {
	var paddleTopEdgeY = canvas.height - paddleDistFromEdge - paddleThickness;
	var paddleBottomEdgeY = paddleTopEdgeY + paddleThickness + paddleThickness;
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

		// if when ball hits paddle no bricks left, reset the game
		if (bricksLeft === 0) {
			brickReset();
		}
	}
}

function moveAll() {
	ballMove();
	ballBrickHandling();
	ballPaddleHandling();
}

function drawAll() {
	colorRect(0, 0, canvas.width, canvas.height, 'black');
	colorCircle(ballX, ballY, 10, 'white');
	colorRect(paddleX, canvas.height - paddleDistFromEdge, paddleWidth, paddleThickness);

	drawBricks();
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











