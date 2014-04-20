var Goal = ex.Actor.extend({});

var Ground = new ex.Actor(0, Config.gameHeight- 100, Config.gameWidth, 5, ex.Color.Yellow);
Ground.preventCollisions = true;

var Jumper = new ex.Actor(Config.gameWidth / 2 - Config.jumperWidth / 2, Ground.y, Config.jumperWidth, Config.jumperHeight, ex.Color.Red);

Jumper.rise = function(amount){
  Jumper.y -= amount;
}

Jumper.fall = function(amount){
  Jumper.y += amount;
}

Jumper.isOnGround = function(){
  return (Jumper.y + 20 === Ground.y);
}

Jumper.addEventListener('collision', function(evt){
  if(evt.other instanceof Goal){
    score += 1;
    evt.other.kill();
    generateGoal();
  }
});

Jumper.addEventListener('left', function(){
  moveLeft();
});

Jumper.addEventListener('right', function(){
  moveRight();
});


Jumper.addEventListener('keydown', function(evt){
  if (evt.key == ex.InputKey.Space){
    startCharge();
  }
});


function startCharge(){
  var d = new Date();
  jumpTimerStart = d.getTime();
  spacePushed = true;
}

function endCharge(){
  if (Jumper.isOnGround() && jumpTimerStart !== null){
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
  if (!Jumper.isOnGround() && Jumper.x + 5 < game.width - 15) {
    Jumper.x += 5;
  }
}

function moveLeft(){
  if (!Jumper.isOnGround() && Jumper.x - 5 > -5) {
    Jumper.x -= 5;
  }
}

Jumper.addEventListener('keyup', function(evt){
  if (evt.key == ex.InputKey.Space) {
    endCharge();
  }
});


var ScoreLabel = new ex.Label("Score: " + score, 5, 20);
ScoreLabel.font = '20px sans-serif';
ScoreLabel.color = ex.Color.Red;


ScoreLabel.addEventListener('update', function(evt){
  this.text = "Score: " + score;
});