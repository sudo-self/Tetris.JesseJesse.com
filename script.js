let sceneCamera = document.querySelector("section[data-camera]");
let scene = document.querySelector(".scene");


function elem(id){
	return document.getElementById(id);
}


var aCredit = document.getElementById("a-credit");
var aMusic = document.getElementById("a-music1");
var aLine = document.getElementById("a-line");
var aRound = document.getElementById("a-round");
var aGameOver = document.getElementById("a-gameover");

function toggleSound() {
  elem('sound').classList.toggle('off');
  if(elem('sound').classList.contains('off'))
	aLine.volume=aRound.volume=aGameOver.volume=aCredit.volume=0;
  else
    aLine.volume=aRound.volume=aGameOver.volume=aCredit.volume=1;
}

function togglePlay() {
  elem('music').classList.toggle('off');
  return aMusic.paused ? aMusic.play() : aMusic.pause();
}

function toggleView() {
  elem('content').classList.toggle('game-mode');
  elem('modes').classList.toggle('game');
	elem('center-scene').click();
}

function toggleGlass() {
  elem('glass').classList.toggle('hide');
  elem('front-glass').classList.toggle('hide');
}

function toggleJoystick() {
  elem('block-joystick').classList.toggle('blocking');
  elem('controller').classList.toggle('layers');
}

function centerScene() {
	scene.style.left = 0;
	scene.style.top = 0;
	sceneCamera.style = "--scale:85";
}

function newCredit() {
  aCredit.play();
  setTimeout(function() {window.parent.location.href="https://codepen.io/josetxu/full/bGKqxyR";}, 250);
}

document.getElementById('reload').addEventListener('click',function(e){
  e.preventDefault();
  newCredit();
});





countI = countO = countT = countS = countZ = countJ = countL = 0;
function showStats(a,b) {
	elem(a).style.height = window[b]+'px';
}

numLines = 0;
function showLines() {
	elem('lines').innerText= numLines;
	elem('rainbow').style.height= numLines+'px';
	
	for(var i=1; i<11; i++){
		if(numLines>i*10-1) { speed = 22 - i*2; elem('round').innerText=i+1; };
		if(numLines % 10 === 0) { 
			elem('round').classList.remove('showing'); 
			setTimeout(function() {elem('round').classList.add('showing');}, 500);
			aRound.play();	
			//change song
			if(!elem('music').classList.contains('off')){
				var rnd = elem('round').innerText;
				aMusic.pause();
				//elem('a-music').src="";
				if(rnd == 1 || rnd == 4 || rnd == 7){
					aMusic = document.getElementById("a-music1");
				} else if(rnd == 2 || rnd == 5 || rnd == 8){
					aMusic = document.getElementById("a-music2");
				} else {
					aMusic = document.getElementById("a-music3");	
				}
				setTimeout(function() { aMusic.play(); }, 3000);
				
			}
		}
	}
}

score = 0; 
function showScore() {
	elem('score').innerText= score;
}


speed = 22;




function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// generate a new tetromino sequence
// @see https://tetris.fandom.com/wiki/Random_Generator
function generateSequence() {
  const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

  while (sequence.length) {
    const rand = getRandomInt(0, sequence.length - 1);
    const name = sequence.splice(rand, 3)[0]; /*1*/
    tetrominoSequence.push(name);
  }
}

// get the next tetromino in the sequence
function getNextTetromino() {
  if (tetrominoSequence.length === 0) {
    generateSequence();
  }

  const name = tetrominoSequence.pop();
  const matrix = tetrominos[name];

  // I and O start centered, all others start in left-middle
  const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

  // I starts on row 21 (-1), all others start on row 22 (-2)
  const row = name === 'I' ? -1 : -2;

  return {
    name: name,      // name of the piece (L, O, etc.)
    matrix: matrix,  // the current rotation matrix
    row: row,        // current row (starts offscreen)
    col: col         // current col
  };
}

// rotate an NxN matrix 90deg
// @see https://codereview.stackexchange.com/a/186834
function rotate(matrix) {
  const N = matrix.length - 1;
  const result = matrix.map((row, i) =>
    row.map((val, j) => matrix[N - j][i])
  );

  return result;
}

// check to see if the new matrix/row/col is valid
function isValidMove(matrix, cellRow, cellCol) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] && (
          // outside the game bounds
          cellCol + col < 0 ||
          cellCol + col >= playfield[0].length ||
          cellRow + row >= playfield.length ||
          // collides with another piece
          playfield[cellRow + row][cellCol + col])
        ) {
        return false;
      }
    }
  }

  return true;
}

// place the tetromino on the playfield
function placeTetromino() {
  for (let row = 0; row < tetromino.matrix.length; row++) {
    for (let col = 0; col < tetromino.matrix[row].length; col++) {
      if (tetromino.matrix[row][col]) {

        // game over if piece has any part offscreen
        if (tetromino.row + row < 0) {
          return showGameOver();
        }
		score++;
		showScore();
        playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
		//console.log(tetromino.name);
		
		switch(tetromino.name) {
			case 'I': countI++; break;
			case 'O': countO++; break;
			case 'T': countT++; break;
			case 'S': countS++; break;
			case 'Z': countZ++; break;
			case 'J': countJ++; break;
			case 'L': countL++; break;
			default: ;
		}
		piece = 'stats'+tetromino.name
		counter = 'count'+tetromino.name;
		showStats('stats'+tetromino.name,'count'+tetromino.name);
      }
    }
  }

  // check for line clears starting from the bottom and working our way up
  for (let row = playfield.length - 1; row >= 0; ) {
    if (playfield[row].every(cell => !!cell)) {

      // drop every row above this one
      for (let r = row; r >= 0; r--) {
        for (let c = 0; c < playfield[r].length; c++) {
          playfield[r][c] = playfield[r-1][c];
        }
		score++;
		showScore();
      }
	  numLines++;
	  showLines();
	  aLine.play();
    }
    else {
      row--;
    }
  }

  //tetromino = getNextTetromino();
  
  /*next*/
  tetromino = tetrominoNext;
  tetrominoNext = getNextTetromino();
  console.log(tetrominoNext.name);
  elem('nextpiece').className="next"+tetrominoNext.name;
  /*next*/
	
}

// show the game over screen
function showGameOver() {
  cancelAnimationFrame(rAF);
  gameOver = true;
  elem('gameover').style.display='block'; 
  elem('insertcoin').classList.add('blink'); 
  aMusic.volume = 0;
  if(!elem('sound').classList.contains('off')){ aGameOver.play(); }
}

const canvas = elem('game');
const context = canvas.getContext('2d');
const grid = 22;
const tetrominoSequence = [];

// keep track of what is in every cell of the game using a 2d array
// tetris playfield is 10x20, with a few rows offscreen
const playfield = [];

// populate the empty state
for (let row = -2; row < 20; row++) {
  playfield[row] = [];

  for (let col = 0; col < 10; col++) {
    playfield[row][col] = 0;
  }
}

// how to draw each tetromino
// @see https://tetris.fandom.com/wiki/SRS
const tetrominos = {
  'I': [
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]
  ],
  'J': [
    [1,0,0],
    [1,1,1],
    [0,0,0],
  ],
  'L': [
    [0,0,1],
    [1,1,1],
    [0,0,0],
  ],
  'O': [
    [1,1],
    [1,1],
  ],
  'S': [
    [0,1,1],
    [1,1,0],
    [0,0,0],
  ],
  'Z': [
    [1,1,0],
    [0,1,1],
    [0,0,0],
  ],
  'T': [
    [0,1,0],
    [1,1,1],
    [0,0,0],
  ]
};

// color of each tetromino
const colors = {
  'I': 'red',
  'O': 'blue',
  'T': 'green',
  'S': 'cyan',
  'Z': 'orange',
  'J': 'yellow',
  'L': 'purple'
};

let count = 0;
//let tetromino = getNextTetromino();

/*next*/
let tetrominoNext = getNextTetromino();
let tetromino     = getNextTetromino();
/*next*/

let rAF = null;  // keep track of the animation frame so we can cancel it
let gameOver = false;

// game loop
function loop() {
  rAF = requestAnimationFrame(loop);
  context.clearRect(0,0,canvas.width,canvas.height);

  // draw the playfield
  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 10; col++) {
      if (playfield[row][col]) {
        const name = playfield[row][col];
        context.fillStyle = colors[name];

        // drawing 1 px smaller than the grid creates a grid effect
        context.fillRect(col * grid, row * grid, grid-1, grid-1);
      }
    }
  }

  // draw the active tetromino
  if (tetromino) {

    // tetromino falls every 35 frames
    if (++count > speed) { //speed 25
      tetromino.row++;
      count = 0;

      // place piece if it runs into anything
      if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
        tetromino.row--;
        placeTetromino();
      }
    }

    context.fillStyle = colors[tetromino.name];

    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {

          // drawing 1 px smaller than the grid creates a grid effect
          context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid-1, grid-1);
        }
      }
    }
  }
}





// listen to keyboard events to move the active tetromino
document.addEventListener('keydown', function(e) {
  //if (gameOver) return;

  //  left and right arrow keys  (move)
  if (e.which === 37 || e.which === 39) {
	// move joystick
	if(!elem('block-joystick').classList.contains('blocking')) {
		if (e.which === 37)	elem('joystick').className='m-left'; else elem('joystick').className='m-right';
	}
    
	if (gameOver) return;
	
    const col = e.which === 37
      ? tetromino.col - 1
      : tetromino.col + 1;

    if (isValidMove(tetromino.matrix, tetromino.row, col)) {
      tetromino.col = col;
    }
  }

  // up arrow key (rotate)
  if (e.which === 38 || e.which === 32) {
	//move button
	if(!elem('block-joystick').classList.contains('blocking')) {
		elem('btn').className='pressed';
	}
	
	if (gameOver) return;
  
    const matrix = rotate(tetromino.matrix);
    if (isValidMove(matrix, tetromino.row, tetromino.col)) {
      tetromino.matrix = matrix;
    }
  }

  // down arrow key (drop)
  if(e.which === 40) {
	//move joystick
	if(!elem('block-joystick').classList.contains('blocking')) {
		elem('joystick').className='m-down';
	}
  
	if (gameOver) return;
  
    const row = tetromino.row + 1;

    if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
      tetromino.row = row - 1;

      placeTetromino();
      return;
    }

    tetromino.row = row;
	
  }

  // Esc arrow key (center)
  if(e.which === 27) {
    scene.style.left = 0;
	scene.style.top = 0;
	sceneCamera.style = "--scale:80";
  }
  
});




document.addEventListener('keyup', function(e) {
	elem('joystick').className='';
	elem('btn').className='';
});



// start the game
rAF = requestAnimationFrame(loop);













/*** CAMERA SYSTEM ***/

window.addEventListener("load", () => {
	new Camera()
		.setOptimalPerspective()
		.with({
			debug: true,
			zoom: {
				range: [60, 200]
			},			
			rotate: {
				speed: 1.2
			}
		})
		.init();
});

/*** SET FOCUS ***/
window.addEventListener("click", () => {
	window.focus();
});
