// Game states: "start", "playing", "gameover VARIABLER"

//GLOBALA VARIABLER
let gameState = "start";

let player;
let platforms = []; //array för platformar/ /
let numPlatforms = 10;

let platformGap = 60; // vertical spacing between platforms
let maxSideOffset = 120; // controls horizontal distance between platforms

// SETUP

function setup() {
  // den måste vara där
  createCanvas(400, 600);
  resetGame(); //anropar alla objekt, startar spelet
}

// PLATFORM CLASS

class Platform {
  constructor(x, y, type = "normal") {
    //mall för alla platformar//
    this.x = x;
    this.y = y;
    this.w = 90; //storlek
    this.h = 5;
    this.type = type;

    this.xSpeed = 3; //hastighet
    this.broken = false; // breaking platform
  }

  update() {
    if (this.type === "moving") {
      //logik för moving platforms
      this.x += this.xSpeed;
      if (this.x < 0 || this.x > width - this.w) {
        //när den når kanten byt riktning
        this.xSpeed *= -1;
      }
    }

    this.y += 1; //XXXXXX kameran rör sig uppåt en bildruta per pixel, eller platformarna rör sig nedåt nåt utav det//

    if (this.y > height) {
      //XXXXXXXX platform åker ur bild, respawna på toppen
      this.respawnAbove();
    }
  }

  respawnAbove() {
    this.y = -random(20, 80); //Placerar plattformen strax ovanför den synliga skärmen på en slumpmässig Y-position.//
    let anchor = platforms[int(random(platforms.length))];
    this.x = constrain(
      anchor.x + random(-maxSideOffset, maxSideOffset),
      0,
      width - this.w
    );
    this.type = random(["normal", "moving", "breaking"]);
    this.broken = false; //återställer broken platformar
  }

  show() {
    //platformar utseende//
    // if (this.broken) return;
    noStroke();
    if (this.type === "normal") fill(255, 150, 200);
    if (this.type === "moving") fill(153, 153, 255);
    if (this.type === "breaking") fill(255, 102, 102);
    rect(this.x, this.y, this.w, this.h, 10); //sista sifran rundade hörn//
  }
}

// PLAYER CLASS

class Player {
  constructor() {
    this.x = width / 2; //startposition, hamnar på mitten,//
    this.y = height - 50; //how high up it starts
    this.r = 10; //size of ball radie
    this.xSpeed = 0; //hastighet
    this.ySpeed = 0;
    this.gravity = 0.4; //gravity
    this.jumpForce = -10;
  }

  update() {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65))
      this.xSpeed = -3; //this is actually changing speed left
    else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68))
      this.xSpeed = 3; //right speed
    else this.xSpeed = 0;
    this.x += this.xSpeed; //denna raden applicerar raderna ovanför

    if (this.x < -this.r) this.x = width + this.r; //XXXXXX wrap around
    if (this.x > width + this.r) this.x = -this.r;

    this.ySpeed += this.gravity;
    this.y += this.ySpeed; //this.y ändras hela tiden pga bollen rör sig

    //kollision

    //*** */kollision
    for (let p of platforms) {
      //Loopar genom alla platformar
      if (
        this.ySpeed > 0 &&
        this.x > p.x &&
        this.x < p.x + p.w && //om bollen är på väg ner OCH till höger om platformens vänsterkant OCH till vä om platform hö kant OCH ovanför platformen OCH under platform botten
        this.y + this.r > p.y &&
        this.y + this.r < p.y + p.h
      ) {
        if (p.type === "breaking")
          p.broken = true; //om den är breaking, går sönder
        else if (!p.broken) this.ySpeed = this.jumpForce; // annars hoppar
      }
    }
    if (this.y > height + 50) gameState = "gameover";
  }
  //*

  show() {
    fill(50); /*color of ball,*/
    ellipse(this.x, this.y, this.r * 2);
  }
}

// RESET GAME

function resetGame() {
  player = new Player();
  platforms = [];

  // --- STARTING PLATFORM ---
  let startPlatformY = player.y + player.r + 5; //hur högt upp från platformen bollen är i början
  platforms.push(new Platform(player.x - 30, startPlatformY, "normal"));

  // --- Generate safe platform chain going upward ---
  let lastX = player.x - 50;
  let lastY = startPlatformY;

  for (let i = 0; i < numPlatforms; i++) {
    let newY = lastY - platformGap;
    let newX = constrain(
      lastX + random(-maxSideOffset, maxSideOffset),
      0,
      width - 60
    );

    let type = random(["normal", "moving", "breaking"]);
    let p = new Platform(newX, newY, type);
    platforms.push(p);

    // If breaking, add a guaranteed safe platform beside it
    if (type === "breaking") {
      let safeX = constrain(newX + (random() < 0.5 ? -70 : 70), 0, width - 60);
      platforms.push(new Platform(safeX, newY, "normal"));
    }

    lastX = newX;
    lastY = newY;
  }
}

// DRAW

function draw() {
  background(240);

  if (gameState === "start") drawStartScreen();
  else if (gameState === "playing") runGame();
  else if (gameState === "gameover") drawGameOverScreen();
}

function drawStartScreen() {
  textAlign(CENTER);
  textSize(34);
  textFont("Roboto"); //change font here
  text("JUMP!", width / 2, height / 2 - 45);
  textSize(20);
  text("Press SPACE to start", width / 2, height / 2 + 10);
}

function drawGameOverScreen() {
  textAlign(CENTER);
  textSize(34);
  textFont("Roboto");
  text("GAME OVER", width / 2, height / 2 - 45);
  textSize(20);
  text("Press SPACE to replay", width / 2, height / 2 + 10);
}

function runGame() {
  for (let p of platforms) {
    //uppdaterar och ritar platformarna
    p.update();
    if (!p.broken) p.show();
  }

  player.update();
  player.show();
}

function keyPressed() {
  if (gameState === "start" && key === " ") {
    gameState = "playing";
  }
  if (gameState === "gameover" && key === " ") {
    resetGame();
    gameState = "playing";
  }
}
