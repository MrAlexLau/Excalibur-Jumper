var Goal = ex.Actor.extend({
  init : function() {
    var sprite = new ex.Sprite(coinGold, 0, 0, 36, 36);
    sprite.scaleX = 0.5555;
    sprite.scaleY = 0.5555;
    this.addDrawing("coin", sprite);
    this.setDrawing("coin");
  }
});

var ground = { y: Config.gameHeight - Config.groundHeight }

var Jumper = ex.Actor.extend({
  init : function() {
    this.setDrawing("standing");

    // bind events
    this.addEventListener('collision', function(evt) {
      if(evt.other instanceof Goal && !evt.other._isKilled){
        score += 1;
        evt.other.kill();
        coinSound.play();
        generateGoal();
        game.addTime();
      }

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
      var that = this;
      if (game.isOver()){
        that.kill();
      }

      that.checkBounds();

      if (that.isOnGround()) {
        if (spacePushed) {
          that.setDrawing("crouch");

          var d = new Date();
          var timeJumping = d.getTime() - jumpTimerStart;

          var numChargeBars = timeJumping / 500;
          if (numChargeBars > chargeBars.length){
            var yOffset = that.calcChargeBarYOffset(chargeBars);
            var bar = new ex.Actor(that.x - that.width / 4, yOffset, Config.jumperWidth * 1.5, 10, ex.Color.White);
            chargeBars.push(bar);
            game.addChild(bar);
          }
        }
        else if (!spacePushed) {
          that.setDrawing("standing");
        }
      }

      if(that.jumpAmount > 0) {
        if (that.isOnGround()){
          jumpSound.play();
        }

        that.setDrawing("flying");
        that.rise(30);
        that.jumpAmount -= 30;
      }
      else if (!that.isOnGround()){
        that.fall(3)
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

  checkBounds : function() {
    if (this.isOnGround()) {
      this.dx = 0;
      this.dy = 0;
    }

    // check right bound
    if (this.x + Config.jumperWidth >= Config.gameWidth) {
      this.x = Config.gameWidth - Config.jumperWidth;
    }

    // check left bound
    if (this.x < 0){
      this.x = 0;
    }

    // check for the jumper going under the ground
    if (this.y > Config.gameHeight - Config.groundHeight) {
      this.y = Config.gameHeight - Config.groundHeight;
    }
  },

  isOnGround : function() {
    return (this.y + Config.jumperHeight >= ground.y);
  },

  rise : function(amount) {
    this.y -= amount;
  },

  moveLeft: function() {
    if (!this.isOnGround() && this.x > 0) {
      this.dx = -1 * Config.dx;
    }
    else {
      this.dx = 0;
    }
  },

  moveRight: function() {
    if (!this.isOnGround() && this.x + Config.jumperWidth < Config.gameWidth) {
      this.dx = Config.dx;
    }
    else{
      this.dx = 0;
    }
  },

  startCharge : function() {
    var d = new Date();
    jumpTimerStart = d.getTime();
    spacePushed = true;
  },

  endCharge : function() {
    var that = this;

    if (that.isOnGround() && jumpTimerStart !== null){
      var d = new Date();
      var timeJumping = d.getTime() - jumpTimerStart;

      spacePushed = false;
      that.jumpAmount = timeJumping / 7;
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

var jumper;
