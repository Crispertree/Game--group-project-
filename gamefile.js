// Game states: "start", "playing", "gameover VARIABLER"
let gameState = "start";

let player;
let platforms = []; //array för platformar/
let numPlatforms = 10;

let platformGap = 60; // vertical spacing between platforms
let maxSideOffset = 120; // controls horizontal distance between platforms

// ------------------------------------------------------
// PLATFORM CLASS
// ------------------------------------------------------
class Platform {
  constructor(x, y, type = "normal") {
    //ev ta bort text/
    this.x = x;
    this.y = y;
    this.w = 60; //storlek/
    this.h = 5;
    this.type = type;

    this.xSpeed = random([-10, 1]) * 1; //hastighet/
    this.broken = false;
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
      //logik för moving platforms/
      this.x += this.xSpeed;
      if (this.x < 0 || this.x > width - this.w) {
        this.xSpeed *= -1;
      }
    }

    this.y += 1; //kameran rör sig uppåt en bildruta per pixel/

    if (this.y > height) {
      //ta inte bort har att göra med antal platformar/
      this.respawnAbove();
    }
  }

  respawnAbove() {
    //oklart ta inte bort har att göra med antal platformar/
    this.y = -random(20, 80); //Placerar plattformen strax ovanför den synliga skärmen på en slumpmässig Y-position./

    // position near another platform to maintain reachable jumps
    let anchor = platforms[int(random(platforms.length))];

    this.x = constrain(
      anchor.x + random(-maxSideOffset, maxSideOffset),
      0,
      width - this.w
    );

    // platform type rules
    let t = random(["normal", "moving", "breaking"]);
    this.type = t;
    this.broken = false;

    if (t === "breaking") {
      // Add safe platform next to breaking platform
      let safeX = constrain(
        this.x +
          (random() < 0.5 ? -70 : 70) /*0,5 betyder antingen vä eller hö */,
        0,
        width - 60
      );
      platforms.push(new Platform(safeX, this.y, "normal")); //gör så ny grön platform hamnar bredvid röd när de kommer högre upp/
    }
  }

  show() {
    //platformar utseende/
    noStroke();

    if (this.type === "normal") fill(255, 150, 200);
    if (this.type === "moving") fill(0, 150, 255);
    if (this.type === "breaking") fill(255, 0, 0);
    rect(this.x, this.y, this.w, this.h, 10); //sista sifran rundade hörn/
  }
}

// ------------------------------------------------------
// PLAYER CLASS
// ------------------------------------------------------
class Player {
  constructor() {
    this.x = width / 2; //hamnar på mitten/
    this.y = height - 50; //how high up it starts
    this.r = 10; //size of ball radie

    this.xSpeed = 0;
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

    if (this.x < -this.r) this.x = width + this.r; //wrap around
    if (this.x > width + this.r) this.x = -this.r;

    this.ySpeed += this.gravity;
    this.y += this.ySpeed; //this.y ändras hela tiden pga bollen rör sig

    for (let p of platforms) {
      //hela detta en lång mening OM bollen träffar platformen
      let hit =
        this.x > p.x && //om bollen är till höger om platformens vänsterkant
        this.x < p.x + p.w && //till vä om platform hö kant
        this.y + this.r > p.y && //ovanför platformen
        this.y + this.r < p.y + p.h && //under platform botten
        this.ySpeed > 0; //OCH på väg ner

      if (hit) {
        if (p.type === "breaking") {
          p.broken = true;
        } else if (!p.broken) {
          this.ySpeed = this.jumpForce;
        }
      }
    }

    if (this.y > height + 50) {
      gameState = "gameover";
    }
  }

  show() {
    fill(50); //color of ball, add own object here/
    ellipse(this.x, this.y, this.r * 2);
  }
}

// ------------------------------------------------------
// SETUP
// ------------------------------------------------------
function setup() {
  // den måste vara där
  createCanvas(400, 600);
  resetGame(); //anropar alla objekt, startar spelet
}

// ------------------------------------------------------
// RESET GAME
// ------------------------------------------------------
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

// ------------------------------------------------------
// DRAW
// ------------------------------------------------------
function draw() {
  background(240);

  if (gameState === "start") drawStartScreen();
  else if (gameState === "playing") runGame();
  else if (gameState === "gameover") drawGameOverScreen();
}

// ------------------------------------------------------
function drawStartScreen() {
  textAlign(CENTER);
  textSize(24);
  textFont("Verdana"); //change font here
  text("DOODLE JUMP!", width / 2, height / 2 - 45);
  textSize(30);
  text("Press SPACE to start", width / 2, height / 2 + 10);
}

// ------------------------------------------------------
function drawGameOverScreen() {
  textAlign(CENTER);
  textSize(24);
  textFont("Verdana");
  text("GAME OVER", width / 2, height / 2 - 30);
  textSize(30);
  text("Press SPACE to replay", width / 2, height / 2 + 10);
}
// ------------------------------------------------------
function runGame() {
  for (let p of platforms) {
    p.update();
    if (!p.broken) p.show();
  }

  player.update();
  player.show();
}

// ------------------------------------------------------
function keyPressed() {
  if (gameState === "start" && key === " ") {
    gameState = "playing";
  }
  if (gameState === "gameover" && (key === " " || key === "SPACE")) {
    //maybe remove the space part
    resetGame();
    gameState = "playing";
  }
}

// All your other code is above!
window.setup = setup;

window.draw = draw;

window.addEventListener("click", function (event) {
    mousePressed();
});

window.addEventListener("keydown", function (event) {
    keyPressed();
});