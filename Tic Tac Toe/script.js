var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
]

const cells = document.querySelectorAll('.cell');

//call startGame to functionally start game at the beginning game and anytime the Replay button is pressed
startGame();

//Define startGame. You are reaffirming that the display is none to ensure that the blank display is reset after hitting the Replay button.

function startGame ()	{
	document.querySelector(".endgame").style.display = "none"
	origBoard = Array.from(Array(9).keys());
//whenever the game is restarted, we want to remove the figures from the board. We will use a forloop
//the loop will go through each cell.
	for(var i = 0; i < cells.length; i++) {
//1. Each cell is set to nothing at the start or restart of the game
		cells[i].innerText = '';
//2. Restarting the game requires that each cell have its color removed. (Winning spaces become colored.)
		cells[i].style.removeProperty('background-color');
//3. Anytime a cell is clicked, the turnClick function will be called.
		cells[i].addEventListener('click', turnClick, false);
	}

}

//Defining the turnClick function and calling the turn function within the turnClick function!
	function turnClick(square) {
//Preventing you from clicking on a place that has already been clicked (within your own turn).
		if (typeof origBoard[square.target.id] == 'number') {
			turn(square.target.id, huPlayer)
			if (!checkTie()) turn(bestSpot(), aiPlayer);
		}

	}
//Defining the turn function:
function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
//After every turn has been taken, we will check to see if the game has been won.
	let gameWon = checkWin(origBoard, player)
//If the game is won, then the game ends.
	if (gameWon) gameOver(gameWon)
}
//Defining the checkWin function. Argument board is a changed version of the origBoard const.
function checkWin(board, player) {
//Finding all of the positions(cells) on the board that have already been taken as turns. We are using the reduce method to go through every element of the board array to give back 
//a is the "Accumulator," which gives back the value at the end
//e is the board Element that we are going through
//i is the the index of the board Array (cell position).
//Essentially, we are adding the index to the accumulator array, or keeping track of all of the cell positions that the human player (huPlayer) has played/chosen during the game.
	let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
//Default option: if no one chooses a winning Combo, then gameWon is null.
	let gameWon = null;
//for of loop: looping through every possible win combo.  
	for (let [index, win] of winCombos.entries()) {
//We will go through every element of the winCombo and check if "plays" (that Accumulator array that tracks the player's played board cells) is greater than -1 ("Has the player chosen all of the cells of a winning combo?")
		if (win.every(elem => plays.indexOf(elem) > -1)) {
//If the player has played a winning Combo, identify the winning Combo used and which player implemented it!
			gameWon = {index: index, player: player};
//Break from the function******
			break;
		}
	}
	return gameWon;
}


//Defining the gameOver function
function gameOver(gameWon) {
//highlight all squares of the winning combo.
	for (let index of winCombos[gameWon.index]) {
//Background color for winner will vary whether the winning was the human player or the AI-player:
		document.getElementById(index).style.backgroundColor = gameWon.player == huPlayer ? "blue" : "red";	
	
declareWinner(gameWon.player == huPlayer ? "You win!!!" : "You lose!!");
	}


//User cannot click any more squares because the game is over!
//This involves the removal of the turnClick Event listener.
	for (var i = 0; i < cells.length; i++)
		cells[i].removeEventListener('click', turnClick, false)
}



//Define declareWinner
function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}



function bestSpot() {
	return emptySquares()[0];
}


function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!!")
		return true;
	}
	return false;
}