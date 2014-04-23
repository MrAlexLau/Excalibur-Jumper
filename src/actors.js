var Goal = ex.Actor.extend({});

var ground = new ex.Actor(0, Config.gameHeight- 100, Config.gameWidth, 5, ex.Color.Yellow);
ground.preventCollisions = true;

var Jumper = ex.Actor.extend({
  init : function() {
    // events
    this.addEventListener('collision', function(evt){
      if(evt.other instanceof Goal){
        score += 1;
        evt.other.kill();
        generateGoal();
      }
    });

    this.addEventListener('left', function(){
      moveLeft();
    });

    this.addEventListener('right', function(){
      moveRight();
    });

    this.addEventListener('keydown', function(evt){
      if (evt.key == ex.InputKey.Space){
        startCharge();
      }
    });
  },

  fall : function(amount){
    jumper.y += amount;
  },

  isOnGround : function(){
    return (jumper.y + 20 === ground.y);
  },

  rise : function(amount){
    jumper.y -= amount;
  }
});

var jumper = new Jumper(Config.gameWidth / 2 - Config.jumperWidth / 2, ground.y, Config.jumperWidth, Config.jumperHeight, ex.Color.Red);
jumper.init();


function startCharge(){
  var d = new Date();
  jumpTimerStart = d.getTime();
  spacePushed = true;
}

function endCharge(){
  if (jumper.isOnGround() && jumpTimerStart !== null){
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
}

function moveRight(){
  if (!jumper.isOnGround() && jumper.x + 5 < game.width - 15) {
    jumper.x += 5;
  }
}

function moveLeft(){
  if (!jumper.isOnGround() && jumper.x - 5 > -5) {
    jumper.x -= 5;
  }
}

jumper.addEventListener('keyup', function(evt){
  if (evt.key == ex.InputKey.Space) {
    endCharge();
  }
});

