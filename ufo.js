//Инопланетянка - инопланетянин + тарелка
function UFO(size, pos, r, vel, acc) {
    if(size) {
      this.size = size;
    } else {
      this.size = 1;
    }
  
    if(this.size = 0) {
      this.damage = 35;
    } else if(this.size = 1) {
      this.damage = 20;
    }
    this.type = "UFO";
    if(r) {
        this.r = r;
    } else {
      this.r = random(13, 17) * (size + 1); //20-25 pixels
    };
    if(pos) {
      this.pos = pos.copy();
    } else {
      if(random() < 0.5) {
        x = width + this.r;
      } else {
        x = 0 - this.r;
      }
      y = random(0, height);
      this.pos = createVector(x, y);
    };
    if(vel) {
        this.vel = vel.copy();
    } else {
      this.vel = p5.Vector.random2D();
    };
    if(acc) {
        this.acc = acc.copy();
    } else {
      this.acc = createVector(0, 0);
    };
    
    this.mass = PI * this.r * this.r;
    
    this.shooting = false;
    this.shootTime = 0;
    this.waitTime = 0;
    this.health = 30;

    this.update = function() {
        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.acc.mult(0.01);

        if(this.vel.mag() >= 4) {
          this.acc.sub(this.vel.copy().mult(0.8));
        }
    }

    this.render = function() {
        push();
        stroke(255);
        translate(this.pos.x, this.pos.y);
        fill(map(this.health, 0, 30, 255, 0), 0, 0);
        beginShape();
        vertex(-this.r, 0);
        vertex(-this.r * 0.5, -this.r * 0.5);
        vertex(-this.r * 0.25, -this.r);
        vertex(this.r * 0.25, -this.r);
        vertex(this.r * 0.5, - this.r * 0.5);
        vertex(this.r, 0);
        vertex(this.r * 0.5, this.r * 0.5);
        vertex(-this.r * 0.5, this.r * 0.5);
        endShape(CLOSE);
        pop();

        if(SHOW_BOUNDING) {
            push();
            stroke(0, 255, 0);
            noFill();
            ellipse(this.pos.x, this.pos.y, this.r * 2);
            pop();

            drawArrow(this.pos, this.vel.copy().mult(this.r), 'red');

            push();
            stroke(0, 225, 0);
            fill(255);
            text("size: " + this.size, this.pos.x + this.r, this.pos.y + this.r);
            text("r: " + this.r.toFixed(2), this.pos.x + this.r, this.pos.y + this.r + 10);
            pop();
        }
        console.log("UFO RENDER");
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

    this.shoot = function() {
      this.shootTime--;
      if(this.shootTime <= 0) {
        posi = ship.pos.copy();
        posi.sub(this.pos);
        lasers.push(new Laser(this.pos, posi.heading(), "fromUFO"));
        this.shootTime = UFO_SHOOT_DELAY * FPS;
        console.log("SHOOTING");
      }
    }

    this.navigate = function() {
      if(dist(this.pos.x, this.pos.y, ship.pos.x, ship.pos.y) <= 300) {
        this.shoot();
      } else {
        this.waitTime--;
        if(this.waitTime <= 0) {
          this.acc.add(createVector(ship.pos.x - this.pos.x, ship.pos.y - this.pos.y).normalize().mult(this.vel.mag() * 2));
          // this.acc.add(p5.Vector.random2D());
          this.waitTime = WAIT_FOR_ACTION_TIME * FPS;
        }
      }
    }
}