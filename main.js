var canvas, canvasContext;

var ballX = 75;

window.onload = function() {
	canvas = document.getElementById('game-canvas');
	canvasContext = canvas.getContext('2d');

	var fps = 30;
	setInterval(updateAll, 1000/fps);
}

function updateAll() {

	ballX++;

	canvasContext.fillStyle = 'black';
	canvasContext.fillRect(0,0,canvas.width,canvas.height);

	canvasContext.fillStyle = 'white';
	canvasContext.beginPath();
	canvasContext.arc(ballX,100,10,0,Math.PI*2,true);
	canvasContext.fill();
}