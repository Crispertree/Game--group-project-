/*  
  DOODLE JUMP GAME  
  ------------------------------------
  Features:
  - Player (ball) auto-jumps upward
  - Platforms (normal, moving, breaking)
  - Scrolling upward simulation
  - Start, Play, End screens
  - OOP structure using classes
  - Arrays + loops
*/
let gameState = "start";
let score = 0;

let player;
let platforms = []; /*array som håller alla platformar*/
let numPlatforms = 10;



class player {

update (){ /*logik för rörelse*/}
draw (){/*rita player*/}
}


class platform {

}

function setup() {
  createCanvas(400, 600);
}

function draw() {
  background();

  if (gameState === "start") drawStartScreen();
  else if (gameState === "playing") runGame();
  else if (gameState === "gameover") drawGameOverScreen();

}

function drawGameOverScreen {



    
}

function runGame {}

function drawGameOverScreen {}