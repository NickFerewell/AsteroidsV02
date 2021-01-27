var lasers = [];
var score = 0;
var CollidingPairs = [];
var SelectedBall = null;
isMouseLeft = false;
isMouseRight = false;
var offset;
var startTime, endTime;
var maxDiff = 0;
var timeDiff;
var level = 0;
var rightArrPressed = false;
var leftArrPressed = false;
// var shooting = false;
var GameIsOver = false;

const MAX_LIVES = 3;
MAX_HEALTH = 50
SHOW_BOUNDING = false; //show or hide collision bounding
const FPS = 60;
const SHOW_CENTER_CIRCLE = true;
SHOW_CURSOR = SHOW_BOUNDING;
CRITICAL_SPEED = 1;
var SHIP_INVISIBLE_TIME = 3; //time of invisibility in seconds
const SHIP_EXPLODE_TIME = 1; //1
const SHIP_BLINK_TIME = 0.2;
ASTEROIDS_NUM = 3;
// shootTime = 0;
const SHOOT_DELAY = 0.2; //0.2
const EXPLOSION_RADIUS = 3;
const TEXT_FADE_TIME = 2.5;
const TEXT_SIZE = 40;
const WAIT_FOR_ACTION_TIME = 3; 7
const UFO_SHOOT_DELAY = 0.5;

var levels, lives, asteroids, ship, ufo, Text, textAlpha;
asteroids = [];



function setup() {
  createCanvas(windowWidth, windowHeight);
  //set up the game parameters
  // ship = new Ship();
  // asteroids.push(ship);
  
  // ufo = new UFO(createVector(100, 100), 20, p5.Vector.random2D(), createVector(0, 0));
  // asteroids.push(ufo);
  // console.log(ufo);
  
  newGame();

  
  
  
  
  pixelDensity(1);
  frameRate(FPS);
  if(SHOW_CURSOR) {

  } else {
      noCursor();
  }
}

console.log(asteroids);

function draw() {
  startTime = performance.now();
  background(0);


  for (var i = lasers.length - 1; i >= 0; i--) {
    lasers[i].render();
    lasers[i].update();
    if (lasers[i].offscreen()){
      lasers.splice(i, 1);
    } else {
      for (var j = asteroids.length - 1; j >= 0; j--) {
        if(lasers[i].hits(asteroids[j])){
          if(asteroids[j].type == "Asteroid"){
            if(asteroids[j].r > 10){ 
            var newAsteroids = asteroids[j].breakup();
            asteroids = asteroids.concat(newAsteroids);
          }else{
            //increase the score
            score++;
          }
          asteroids.splice(j, 1);
          lasers.splice(i, 1);
          score++;
          } else if(asteroids[j].type == "UFO" && lasers[i].source != "fromUFO") {
            asteroids[j].health -= 10;
            if(asteroids[j].health <= 0) {
              asteroids.splice(j, 1);
            }
            lasers.splice(i, 1);
          } else if(asteroids[j].type == "Ship" && lasers[i].source != "fromShip") {
            if(!ship.invisible) {
              ship.health -= 35;
            }
            lasers.splice(i, 1);
          }
          
          break;
        }
      
      }
    }
  }

  for(var i = 0; i < asteroids.length; i++) {
    asteroids[i].render();
    asteroids[i].update();
    asteroids[i].edges();
    if(asteroids[i].type == "Ship") {
      asteroids[i].turn();
    } else if(asteroids[i].type == "UFO") {
      asteroids[i].navigate();
    }
  }
  // ufo.render();

  for (var i = 0; i < asteroids.length; i++) {
    if(asteroids[i] != ship){
      if (DoCirclesOverlap(ship.pos.x, ship.pos.y, ship.r + 1, asteroids[i].pos.x, asteroids[i].pos.y, asteroids[i].r)){
        if(ship.vel.copy().sub(asteroids[i].vel).mag() >= CRITICAL_SPEED && !ship.invisible){
          ship.health -= (ship.vel.copy().sub(asteroids[i].vel).mag() - CRITICAL_SPEED) * 5;
        }
      console.log("Ooops!")
      }
    }
  }
  if(ship.health <= 0){
    // ship.explode();
    // if(ship.timeToRevive <= 0){
    //   ship.resetShip();
    //   lives--;
    // console.log(asteroids);
    // console.log("NEW SHIP");
    // }
    
    ship.explode();
    console.log(asteroids);
    
    console.log(ship.timeToRevive);
    
    // asteroids.push(ship);
  }else {
    // ship.isDismiss = true;
    // ship.isExploding = true;
  }
     //Старое столкновение
  // for (var i = 0; i < asteroids.length; i++) {
  //   for( var j = 0; j < asteroids.length; j++){
  //     if(asteroids[i].hits(asteroids[j])){
  //       if(i != j){
  //         // rand = random();
  //         // if(rand <0.25){
  //           asteroids[i].vel = p5.Vector.random2D();
  //           let v = asteroids[i].vel.copy();
  //           asteroids[j].vel = v.mult(-1);
  //           // } while(пересечение векторов скоростей);
  //           console.log("collision");
          
        
        
  //       }
  //     }
  //   }
    
  // }

  //static collisions
  for (var i = 0; i < asteroids.length; i++) {
    for( var j = 0; j < asteroids.length; j++){
      if(i != j){
        if(DoCirclesOverlap(asteroids[i].pos.x, asteroids[i].pos.y, asteroids[i].r, asteroids[j].pos.x, asteroids[j].pos.y, asteroids[j].r)){
          if(((asteroids[i].type != "Ship") && (asteroids[j].type != "Ship") && ship.isExploding)){
              //Collision has occured
            if(CollidingPairs.lengt > 0){
              for(k = 0; k < CollidingPairs.length; k++) {
                if(CollidingPairs[k] != [asteroids[i], asteroids[j]]){
                newPair = [asteroids[i], asteroids[j]];
                // console.log(asteroids[i]);
                CollidingPairs.push(newPair);
                console.log("Пары: " + CollidingPairs);
                console.log("Астероиды: " + asteroids);
                }
              };
            } else {
              newPair = [asteroids[i], asteroids[j]];
              CollidingPairs.push(newPair);
            }
          
            
            console.log(CollidingPairs);
            //Distance between ball centers
            var distance = Math.sqrt((asteroids[i].pos.x - asteroids[j].pos.x) * (asteroids[i].pos.x - asteroids[j].pos.x) + (asteroids[i].pos.y - asteroids[j].pos.y)*(asteroids[i].pos.y - asteroids[j].pos.y));
            var overlap = 0.5 * (distance - asteroids[i].r - asteroids[j].r);

            //Displace current ball
            asteroids[i].pos.x -= overlap * (asteroids[i].pos.x - asteroids[j].pos.x) / distance;
            asteroids[i].pos.y -= overlap * (asteroids[i].pos.y - asteroids[j].pos.y) / distance;
            
            //Displace target ball
            asteroids[j].pos.x += overlap * (asteroids[i].pos.x - asteroids[j].pos.x) / distance;
            asteroids[j].pos.y += overlap * (asteroids[i].pos.y - asteroids[j].pos.y) / distance;
            console.log("collision");
          } else if(!ship.isExploding){
              //Collision has occured
              if(CollidingPairs.lengt > 0){
                for(k = 0; k < CollidingPairs.length; k++) {
                  if(CollidingPairs[k] != [asteroids[i], asteroids[j]]){
                  newPair = [asteroids[i], asteroids[j]];
                  // console.log(asteroids[i]);
                  CollidingPairs.push(newPair);
                  console.log("Пары: " + CollidingPairs);
                  console.log("Астероиды: " + asteroids);
                  }
                };
              } else {
                newPair = [asteroids[i], asteroids[j]];
                CollidingPairs.push(newPair);
              }
            
              
              console.log(CollidingPairs);
              //Distance between ball centers
              var distance = Math.sqrt((asteroids[i].pos.x - asteroids[j].pos.x) * (asteroids[i].pos.x - asteroids[j].pos.x) + (asteroids[i].pos.y - asteroids[j].pos.y)*(asteroids[i].pos.y - asteroids[j].pos.y));
              var overlap = 0.5 * (distance - asteroids[i].r - asteroids[j].r);
  
              //Displace current ball
              asteroids[i].pos.x -= overlap * (asteroids[i].pos.x - asteroids[j].pos.x) / distance;
              asteroids[i].pos.y -= overlap * (asteroids[i].pos.y - asteroids[j].pos.y) / distance;
              
              //Displace target ball
              asteroids[j].pos.x += overlap * (asteroids[i].pos.x - asteroids[j].pos.x) / distance;
              asteroids[j].pos.y += overlap * (asteroids[i].pos.y - asteroids[j].pos.y) / distance;
              console.log("collision");
          }
        }
      }
    }
  }
if(CollidingPairs.length > 0){
  for(i = CollidingPairs.length - 1; i >= 0; i--){
    b1 = CollidingPairs[i][0];
    b2 = CollidingPairs[i][1];

    //distance between balls
    distance = sqrt((b1.pos.x - b2.pos.x) * (b1.pos.x - b2.pos.x) + (b1.pos.y - b2.pos.y) * (b1.pos.y - b2.pos.y));

    //normal
    nx = (b2.pos.x - b1.pos.x) / distance;
    ny = (b2.pos.y - b1.pos.y) / distance;

    //tangent
    tx = -ny;
    ty = nx;

    //dot product tangent
    dpTan1 = b1.vel.x * tx + b1.vel.y * ty;
    dpTan2 = b2.vel.x * tx + b2.vel.y * ty;

    //dot product normal
    dpNorm1 = b1.vel.x * nx + b1.vel.y * ny;
    dpNorm2 = b2.vel.x * nx + b2.vel.y * ny;

    //conservation of momentum in 1D
    m1 = (dpNorm1 * (b1.mass - b2.mass) + 2 * b2.mass * dpNorm2) / (b1.mass + b2.mass);
    m2 = (dpNorm2 * (b2.mass - b1.mass) + 2 * b1.mass * dpNorm1) / (b1.mass + b2.mass);

    CollidingPairs[i][0].vel = createVector(tx * dpTan1 + nx * m1, ty * dpTan1 + ny * m1);
    CollidingPairs[i][1].vel = createVector(tx * dpTan2 + nx * m2, ty * dpTan2 + ny * m2);
  }
}
  
  for(i = CollidingPairs.length - 1; i >= 0; i--){
    // console.log(CollidingPairs);
    if(SHOW_BOUNDING){
      push()
      stroke(255, 127)
      strokeWeight(4);
      fill(50);
      line(CollidingPairs[i][0].pos.x, CollidingPairs[i][0].pos.y, CollidingPairs[i][1].pos.x, CollidingPairs[i][1].pos.y);
      pop();
    }
    if(!DoCirclesOverlap(CollidingPairs[i][0], CollidingPairs[i][1])){
      CollidingPairs.splice(i, 1);
    }
    // CollidingPairs.splice(i,1);
    // console.log("pairs exist");
    // console.log(CollidingPairs);
    
  }


  


  // console.log(lasers.length);

  // if(ship.isDismiss == false){
    // ship.render();
    // if(ship != undefined) {
    //   ship.turn();
    // }
    
    // ship.update();
    // ship.edges();
  // }
 
  if(textAlpha >= 0) {
    push()
    fill(255, textAlpha * 255);
    textSize(TEXT_SIZE);
    textAlign(CENTER, CENTER);
    stroke(0);
    strokeWeight(2);
    text(Text, width / 2, height * 0.75);
    pop();
    textAlpha -= 1 / TEXT_FADE_TIME / FPS;
  }
  
  if(asteroids.length == 0 + 1){
    if(level <= 20){
      level++;
    newLevel();
    } else {
      gameover(); 
      push();
      fill(255);
      textSize(windowWidth * 0.02);
      stroke(0);
      strokeWeight(2);
      textAlign(CENTER, CENTER);
      text("You are machine, robot and so so lucky and skill!\n"  +  "I love you, because your score is " + score + ". And this is INCREDIBLE!", width / 2, height / 2 + 120);
      pop();
    }
  }
  if(lives <= 0){
    gameover();
  }
  
  //level counter
  push();
  textSize(windowHeight * 0.03);
  fill(255);
  text("Lvl: " + (level + 1), width - width * 0.06, 40);
  pop();


  push();
  textSize(35);
  fill(255);
  textAlign(CENTER, CENTER);
  text(score, 40, 30); //Score counter
  pop();

  //lives counter
  push();
  var lifeColour;
  translate((MAX_LIVES * 0.5 * ship.r) + (lives * -ship.r * 0.5) + 0.5*ship.r + 10, 60);
  for (i = 0; i < lives; i++) {
    lifeColour = ship.isExploding && i == lives -1 ? "red" : "black";
    push();
    translate(ship.r * i, 0);
    fill(lifeColour);
    // console.log(lifeColour);
    stroke(255);
    strokeWeight(2);
    scale(0.4);
    triangle(-ship.r, ship.r, ship.r, ship.r, 0, -ship.r);
    pop();
  }
  pop()

      //second version
  // push();
  // var lifeColour;
  // translate(10, 60);
  // scale(0.6);
  // translate((MAX_LIVES * ship.r) + (lives * -ship.r) + ship.r, 0);
  // for (i = 0; i < lives; i++) {
  //   lifeColour = ship.isExploding && i == lives -1 ? "red" : "black";
  //   push();
  //   translate(ship.r * 2 * i, 0);
  //   fill(lifeColour);
  //   // console.log(lifeColour);
  //   stroke(255);
  //   strokeWeight(2);
  //   triangle(-ship.r, ship.r, ship.r, ship.r, 0, -ship.r);
  //   pop();
  // }
  // pop()
  // shootTime--;
  // if(shooting) {
    
  //   if(shootTime <= 0) {
  //     lasers.push(new Laser(ship.pos, ship.heading));
  //     shootTime = SHOOT_DELAY * FPS;
  //   }
  // }

  if(isMouseLeft){
    if(SelectedBall != null){
      SelectedBall.pos = createVector(mouseX, mouseY);
      SelectedBall.pos.add(offset);
    }
  }

  if(isMouseRight == true){
    if(SelectedBall != null){
      push();
      // stroke(200, 100, 0);
      // translate(SelectedBall.pos.x, SelectedBall.pos.y);
      drawArrow(createVector(mouseX, mouseY), createVector(SelectedBall.pos.x - mouseX, SelectedBall.pos.y - mouseY), "blue");
      pop();
    }
  }

  endTime = performance.now();
  var timeDiff = endTime - startTime; //in ms 
  timeDiff /= 1000; 

  if(SHOW_BOUNDING){
    push();
    textSize(35);
    fill(255);
    textAlign(LEFT);
    text(timeDiff, windowWidth - 400, 40); //Elapsed time counter
    pop();
  
    push()
    textAlign(RIGHT);
    textSize(35);
    fill(255);
    text(maxDiff, windowWidth, 80);
    pop();
  }
  
  
  if(timeDiff > maxDiff){
    maxDiff = timeDiff;
  }
};

function DoCirclesOverlap(x1, y1, r1, x2, y2, r2){
  return Math.abs((x1 - x2)*(x1-x2) + (y1 - y2)*(y1-y2)) <= (r1+r2)*(r1+r2);
};

function newGame() {
  GameIsOver = false;
  level = 0;
  lives = MAX_LIVES;
  score = 0;
  // ship.resetShip();
  // ship.pos = createVector(width / 2, height / 2);
  // asteroids.push(ship); 
  asteroids.length = 0;

  ship = new Ship();
  asteroids.push(ship);

  // ufo = new UFO(createVector(100, 100), 20, p5.Vector.random2D(), createVector(0, 0));
  // asteroids.push(ufo);
  // console.log(ufo);
  
  // for(i = asteroids.length; i >= 0; i--) {
  //   console.log(asteroids[i]);
  //   if(asteroids[i].id != "ship") {
  //     asteroids.splice(i, 1);
  //   };
  // };
  newLevel();
  
};

function newLevel() {
  Text = "Level " + (level + 1);
  textAlpha = 1;
  createAsteroidBelt();
};

function createAsteroidBelt() {
  for(var i = 0; i < ASTEROIDS_NUM + level; i++){
    do{
      roid = new Asteroid();
      roid.pos = createVector(random(width), random(height));
    } while(dist(ship.pos.x, ship.pos.y, roid.pos.x, roid.pos.y) < roid.r * 2 + ship.r);
    asteroids.push(roid);
  }
  if((level + 1) % 2 == 0) {
    asteroids.push(new UFO(1));
  }
   if((level + 1) % 3 == 0) {
    asteroids.push(new UFO(0));
  }
}

function gameover(){
  GameIsOver = true;

  push();
  textSize(windowWidth * 0.1);
  fill(255);
  stroke(0);
  strokeWeight(4);
  textAlign(CENTER, CENTER);
  text("GAME OVER",0 , height/2, width);
  pop();
  
  
  push();
  fill(255);
  textSize(windowWidth * 0.02);
  stroke(0);
  strokeWeight(2);
  textAlign(CENTER, CENTER);
  text("Press SPACE to begin new game", width / 2, height / 2 - 100);
  pop();
};


function keyReleased() {
  if (keyCode == RIGHT_ARROW) {
    rightArrPressed = false;
    ship.setRotation(0);
  } else if (keyCode == LEFT_ARROW) {
    leftArrPressed = false;
    ship.setRotation(0);
  }else if (keyCode == UP_ARROW) {
    ship.boosting(false);
  } else if(key == " ") {
    ship.shooting = false;
  }
  
  if(rightArrPressed){
    ship.setRotation(0.1);
  }
  if(leftArrPressed){
    ship.setRotation(-0.1);
  }
  return false;
  
};

function keyPressed() {
  if(key == " "){
    if(ship.isExploding == false){
      ship.shooting = true;
      // lasers.push(new Laser(ship.pos, ship.heading));
    }
    if(GameIsOver) {
      newGame();
      // ship.resetShip;
    }
  } else if (keyCode == RIGHT_ARROW) {
    rightArrPressed = true;
    ship.setRotation(0.1);
  } else if (keyCode == LEFT_ARROW) {
    leftArrPressed = true;
    ship.setRotation(-0.1);
  } else if (keyCode == UP_ARROW) {
    ship.boosting(true);
  } else if (keyCode ==76){ //asteroid cheat 'L'
  for(i = asteroids.length; i >= 0; i--) {
    if(asteroids[i] != ship) {
      asteroids.splice(i, 1);
    };
  };
  } else if (keyCode ==114){ //turn bounding 'F3'
    SHOW_BOUNDING = !SHOW_BOUNDING;
    SHOW_CURSOR = !SHOW_CURSOR;
    // console.log(SHOW_BOUNDING);
    // console.log(SHOW_CURSOR);
  }
  if(SHOW_CURSOR == true){
    cursor(ARROW);
  } else {
    noCursor();
  }
  return false;
};

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
};

function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
};

function IsPointInCircle(x1, y1, r1, px, py){
  return Math.abs((x1 - px)*(x1-px) + (y1 - py)*(y1-py)) < (r1*r1);
};

function mousePressed(){
  switch (mouseButton){
    case LEFT:
      isMouseLeft = true;
      break;
      case RIGHT:
      isMouseRight = true;
      break;
  };

  if(mouseButton === LEFT || mouseButton === RIGHT){
    for(i = 0; i < asteroids.length; i++){
      if(IsPointInCircle(asteroids[i].pos.x, asteroids[i].pos.y, asteroids[i].r, mouseX, mouseY)){
        SelectedBall = asteroids[i];
        offset = createVector(asteroids[i].pos.x - mouseX, asteroids[i].pos.y - mouseY);
      }
    }
  }
};

function mouseReleased(){
  console.log("Выделенный " + SelectedBall.r);
  switch(mouseButton){
    case RIGHT:
      isMouseRight = false;
      if(SelectedBall != null){
        SelectedBall.acc.add(createVector(-(mouseX - SelectedBall.pos.x), -(mouseY - SelectedBall.pos.y)).div(FPS*4));
        SelectedBall = null;
      }
      break;
    case LEFT:
      isMouseLeft = false;
      SelectedBall = null;
      break;
  }
};