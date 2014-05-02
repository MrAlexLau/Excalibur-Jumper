var Goal = ex.Actor.extend({});

var ground = new ex.Actor(0, Config.gameHeight- 100, Config.gameWidth, 5, ex.Color.Yellow);
ground.preventCollisions = true;

var Jumper = ex.Actor.extend({
  init : function() {
    // events
    this.addEventListener('collision', function(evt) {
      if(evt.other instanceof Goal){
        score += 1;
        evt.other.kill();
        generateGoal();
      }

      var sprite = new ex.Sprite(jumperSprite, 0, 0, 70, 99);
      sprite.scaleX = 0.5;
      sprite.scaleY = 0.5;
      this.addDrawing("init", sprite);

      var crouch = new ex.Sprite(jumperSprite, 365, 97, 70, 80);
      crouch.scaleX = 0.5;
      crouch.scaleY = 0.5;
      this.addDrawing("crouch", crouch);

      this.setDrawing("init");
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
        var d = new Date();
        var timeJumping = d.getTime() - jumpTimerStart;

        var numChargeBars = timeJumping / 500;
        if (numChargeBars > chargeBars.length){
          var yOffset = this.calcChargeBarYOffset(chargeBars);
          var bar = new ex.Actor(this.x - this.width / 4, yOffset, Config.jumperWidth * 1.5, 10, ex.Color.Green);
          chargeBars.push(bar);
          game.addChild(bar);
        }
      }

      if(jumpAmount > 0) {
        this.rise(30);
        jumpAmount -= 30;
      }
      else if (!this.isOnGround()){
        this.fall(3)
      }

    });
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
      this.x -= 5;
    }
  },

  moveRight: function() {
    if (!this.isOnGround() && this.x + Config.jumperWidth < Config.gameWidth) {
      this.x += 5;
    }
  },

  startCharge : function() {
    this.setDrawing("crouch");

    var d = new Date();
    jumpTimerStart = d.getTime();
    spacePushed = true;
  },

  endCharge : function() {
    this.setDrawing("init");

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

var jumper = new Jumper(Config.gameWidth / 2 - Config.jumperWidth / 2, ground.y, Config.jumperWidth, Config.jumperHeight, ex.Color.Red);
jumper.init();
