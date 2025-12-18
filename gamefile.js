let gameState = "start";
let score = 0;

let player;
let platforms = []; //array som håller alla platformar/
let numPlatforms = 10; 


function setup() {
  createCanvas(400, 600);
}

function draw() {
  background(240);

  if (gameState === "start") {
    textAlign(CENTER);
    textSize(24);
    text("START", width / 2, height / 2);
  }
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = 100;
    this.r = 10;
    this.ySpeed = 0;
    this.gravity = 0.4;
  }
}
  update() {
    this.ySpeed += this.gravity;
    this.y += this.ySpeed;
  }

  show() {
    ellipse(this.x, this.y, this.r * 2);
  }


class Platform {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 60;
    this.h = 5;
  }
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


function drawGameOverScreen () {



    
}

function runGame {



/*koden här/*

}

function drawGameOverScreen {}