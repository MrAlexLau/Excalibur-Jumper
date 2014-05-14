var Goal = ex.Actor.extend({
  init : function() {
    var sprite = new ex.Sprite(coinGold, 0, 0, 36, 36);
    sprite.scaleX = 0.5555;
    sprite.scaleY = 0.5555;
    this.addDrawing("coin", sprite);
    this.setDrawing("coin");
  }
});

var ground = new ex.Actor(0, Config.gameHeight - Config.groundHeight, Config.gameWidth, 5, ex.Color.Transparent);
ground.preventCollisions = true;
ground.opacity = 0;

var Jumper = ex.Actor.extend({
  init : function() {
    // events
    this.addEventListener('collision', function(evt) {
      if(evt.other instanceof Goal && !evt.other._isKilled){
        score += 1;
        evt.other.kill();
        coinSound.play();
        generateGoal();
      }

      this.loadImages();
    });

    this.addEventListener('left', function() {
      this.moveLeft();
    });

    this.addEventListener('right', function() {
      this.moveRight();
    });

    this.addEventListener('keydown', function(evt) {
      if (evt.key === ex.InputKey.Space){
        this.startCharge();
      }
    });

    this.addEventListener('keyup', function(evt) {
      if (evt.key == ex.InputKey.Space) {
        this.endCharge();
      }
    });

    this.addEventListener('update', function(evt) {
      if (spacePushed && this.isOnGround()) {
        this.setDrawing("crouch");

        var d = new Date();
        var timeJumping = d.getTime() - jumpTimerStart;

        var numChargeBars = timeJumping / 500;
        if (numChargeBars > chargeBars.length){
          var yOffset = this.calcChargeBarYOffset(chargeBars);
          var bar = new ex.Actor(this.x - this.width / 4, yOffset, Config.jumperWidth * 1.5, 10, ex.Color.White);
          chargeBars.push(bar);
          game.addChild(bar);
        }
      }
      else if (!spacePushed && this.isOnGround()) {
        this.setDrawing("standing");
      }

      if(jumpAmount > 0) {
        if (this.isOnGround()){
          jumpSound.play();
        }

        this.setDrawing("flying");
        this.rise(30);
        jumpAmount -= 30;
      }
      else if (!this.isOnGround()){
        this.fall(3)
      }
    });
  },

  loadImages : function() {
      var sprite = new ex.Sprite(jumperStanding, 0, 0, 75, 95);
      sprite.scaleX = 0.4666;
      sprite.scaleY = 0.5263;
      this.addDrawing("standing", sprite);

      var sprite = new ex.Sprite(jumperFlying, 0, 0, 75, 95);
      sprite.scaleX = 0.4666;
      sprite.scaleY = 0.5263;
      this.addDrawing("flying", sprite);

      var crouch = new ex.Sprite(jumperCrouching, 0, 0, 75, 95);
      crouch.scaleX = 0.4666;
      crouch.scaleY = 0.5263;
      this.addDrawing("crouch", crouch);

      this.setDrawing("standing");
  },

  fall : function(amount) {
    this.y += amount;
  },

  isOnGround : function() {
    return (this.y + Config.jumperHeight === ground.y);
  },

  rise : function(amount) {
    this.y -= amount;
  },

  moveLeft: function() {
    if (!this.isOnGround() && this.x > 0) {
      this.x -= Config.moveAmount;
    }
  },

  moveRight: function() {
    if (!this.isOnGround() && this.x + Config.jumperWidth < Config.gameWidth) {
      this.x += Config.moveAmount;
    }
  },

  startCharge : function() {
    var d = new Date();
    jumpTimerStart = d.getTime();
    spacePushed = true;
  },

  endCharge : function() {
    if (this.isOnGround() && jumpTimerStart !== null){
      var d = new Date();
      var timeJumping = d.getTime() - jumpTimerStart;

      spacePushed = false;
      jumpAmount = timeJumping / 7;
      jumpTimerStart = null;

      chargeBars.forEach(function(bar){
        bar.kill();
      });
      chargeBars = [];
    }
  },

  calcChargeBarYOffset : function(barArray) {
    var offset = ground.y + 10;
    if (barArray.length > 0){
      offset = barArray[barArray.length - 1].y + 20;
    }

    return offset;
  }
});

var jumper = new Jumper(Config.gameWidth / 2 - Config.jumperWidth / 2, ground.y - Config.jumperHeight - 10, Config.jumperWidth, Config.jumperHeight, ex.Color.Red);
jumper.init();
