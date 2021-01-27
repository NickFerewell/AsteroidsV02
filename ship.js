function Ship() {
  this.type = "Ship";
  this.pos = createVector(width / 2, height / 2);
  this.r = 15;
  this.mass = this.r * this.r * PI;
  this.heading = -PI / 2;
  this.rotation = 0;
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.isBoosting = false;
  // this.isDismiss = false;
  this.isExploding = false;
  this.isRender = true;
  this.health = 50;
  this.invisibility = Math.ceil(SHIP_INVISIBLE_TIME / SHIP_BLINK_TIME);
  this.invisible = false;
  this.timeToRevive = 0;
  this.blinkTime = SHIP_BLINK_TIME * FPS;
  this.shooting = false;
  this.shootTime = 0;
  
  this.boosting = function(b) {
    this.isBoosting = b;
  }


  this.update = function() {
    if(this.invisibility > 0) {
      this.blinkTime--;
      if(this.blinkTime == 0){
        this.invisibility--;
        this.blinkTime = SHIP_BLINK_TIME * FPS;
      }
      this.invisible = true;
      this.isRender = this.invisibility % 2 == 0;
    } else {
      this.invisible = false;
      this.isRender = true;
      // console.log("JFGHGMKHVS");
    }

    
    if (this.isBoosting) {
      this.boost();
    }
    // if(!this.isExploding){
      this.pos.add(this.vel);
    // }

    
    this.vel.add(this.acc);
    this.vel.mult(0.995);
    this.acc.mult(0.9);
    

    if(this.vel.x < 0.001 && this.vel.x > -0.001){
      this.vel.x = 0;
    }
    if(this.vel.y < 0.001 && this.vel.y > -0.001){
      this.vel.y = 0;
    }

    this.timeToRevive--;
    if(this.timeToRevive <= 0 && this.isExploding) {
      if(lives <= 0 && this.timeToRevive <= 0) {
        this.isRender = false;
      } ;
      lives--;
      if(lives > 0){
        console.log("RESET");
        // this.isExploding = false;
        console.log("RESET2");
        this.resetShip();
      }
      
      
    }

    this.shootTime--;
    console.log(this.shootTime);

    if(this.shooting) {
      this.shoot()
    } else {
      this.shootTime = 0;
    }
  }

  this.shoot = function() {
    if(!this.isExploding) {
      if(this.shootTime <= 0) {
        lasers.push(new Laser(ship.pos, ship.heading, "fromShip"));
        this.shootTime = SHOOT_DELAY * FPS;
      }
    }
    
  }
  
  this.boost = function() {
    if(!this.isExploding){
      var force = p5.Vector.fromAngle(this.heading);
      force.mult(0.15); //0.1
      this.vel.add(force);
    }
    
  }

this.hits = function(asteroid){
  if(asteroid != ship){
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y)
  if(d <= this.r + asteroid.r){
    // this.explode;
    return true;
    
  } else {
    return false;
  }
  }
  
}

  this.explode = function() {
    if(!this.isExploding) {
      this.timeToRevive = Math.ceil(SHIP_EXPLODE_TIME * FPS);
      this.isExploding = true;
    }
  }

  this.render = function() {
    if(this.isRender == true){
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);
    if(this.isExploding == false){
      push();
      fill(255- map(this.health, 0, MAX_HEALTH, 0, 255), 0, 0);
      stroke(255);
      strokeWeight(this.r / 20);
      triangle(-this.r, this.r, this.r, this.r, 0, -this.r);

      push()
      translate(-this.r, this.r);
      leftTail = createVector(-this.r * 0.5, this.r);
      leftTail.mult(0.4);
      line(0, 0, leftTail.x, leftTail.y);
      pop();

      push()
      translate(this.r, this.r);
      rightTail = createVector(this.r * 0.5, this.r);
      rightTail.mult(0.4);
      line(0, 0, rightTail.x, rightTail.y);
      pop();


      if(SHOW_CENTER_CIRCLE == true){
        ellipse(0, 0, this.r * 0.5);
        // console.log("RENDER");
      }
      if(this.isBoosting == true){
        push();
        // translate(this.pos.x, this.pos.y);
        // rotate(this.heading + PI / 2);
        // fill(50);
        
        if(random() < 0.5){  //можно было просто каждый кадр менять значение на обратное и всё
          fill(100, 50, 30);
          strokeWeight(1);
          stroke(200, 200, 0);
        } else {
          fill(0);
          noStroke();
        }
        
        
        triangle(-this.r * 0.5, this.r, this.r * 0.5, this.r, 0, this.r*2);
        pop();
        console.log(this.isBoosting);
      }
      pop()
    } else {
      push();
      noStroke();
      scale(1.5);
      if(this.timeToRevive / Math.ceil(SHIP_EXPLODE_TIME * FPS) * 100 < 7){
      fill(139, 0, 0);
      ellipse(0, 0 , this.r * EXPLOSION_RADIUS * 1.7);
      }
      if(this.timeToRevive / Math.ceil(SHIP_EXPLODE_TIME * FPS) * 100 < 35){
      fill(255, 0, 0);
      ellipse(0, 0 , this.r * EXPLOSION_RADIUS * 1.4);
      }
      if(this.timeToRevive / Math.ceil(SHIP_EXPLODE_TIME * FPS) * 100 < 60){
      fill(255, 165, 0);
      ellipse(0, 0 , this.r * EXPLOSION_RADIUS * 1.1);
      }
      if(this.timeToRevive / Math.ceil(SHIP_EXPLODE_TIME * FPS) * 100 < 85){
      fill(255, 255, 0);
      ellipse(0, 0 , this.r * EXPLOSION_RADIUS * 0.8);
      }
      if(this.timeToRevive / Math.ceil(SHIP_EXPLODE_TIME * FPS) * 100 < 99){
        fill(255, 255, 255);
      ellipse(0, 0 , this.r * EXPLOSION_RADIUS * 0.5);
      }
      pop();
    }
    pop();
  
  if(SHOW_BOUNDING){
    push();
    translate(this.pos.x, this.pos.y);
    stroke(0, 225, 0);
    noFill();
    ellipse(0, 0 , this.r * 2);
    pop();

    velo = this.vel.copy();
    drawArrow(this.pos, velo.mult(this.r), 'red');
    
    push();
    stroke(0, 225, 0);
    fill(255);
    text("v - " + this.vel.mag().toFixed(2), this.pos.x + this.r, this.pos.y + this.r);
    pop();
  }
  // pop()
  } 

  this.edges = function() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }


  this.setRotation = function(a) {
    this.rotation = a * 0.66;
  }

  this.turn = function() {
    if(!this.isExploding){
      this.heading += this.rotation;
    }
  }
}

this.resetShip = function() {
  console.log("RESET2");
  this.type = "Ship";
  this.pos = createVector(width / 2, height / 2);
  this.r = 15;
  this.mass = this.r * this.r * PI;
  this.heading = -PI / 2;
  this.rotation = 0;
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.isBoosting = false;
  // this.isDismiss = false;
  this.isExploding = false;
  this.isRender = true;
  this.health = 50;
  this.invisibility = Math.ceil(SHIP_INVISIBLE_TIME / SHIP_BLINK_TIME);
  this.invisible = false;
  this.timeToRevive = 0;
  this.blinkTime = SHIP_BLINK_TIME * FPS;
  this.shooting = false;
  this.shootTime = 0;
}
}