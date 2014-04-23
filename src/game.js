var game = new ex.Engine(Config.gameWidth, Config.gameHeight);
game.backgroundColor = ex.Color.Black;

function calcChargeBarYOffset(barArray){
  var offset = ground.y + Config.jumperHeight;
  if (barArray.length > 0){
    offset = barArray[barArray.length - 1].y + 20;
  }

  return offset;
}

function generateGoal() {
  var goal = new Goal(randInt(0, game.width - Config.jumperWidth), randInt(20, ground.y - ground.height - 20), Config.jumperWidth, Config.jumperHeight, ex.Color.Green);
  game.addChild(goal);
}

game.addEventListener('update', function(evt){
  if (spacePushed && jumper.isOnGround()) {
    var d = new Date();
    var timeJumping = d.getTime() - jumpTimerStart;

    var numChargeBars = timeJumping / 500;
    if (numChargeBars > chargeBars.length){
      var yOffset = calcChargeBarYOffset(chargeBars);
      var bar = new ex.Actor(jumper.x - jumper.width / 2, yOffset, 40, 10, ex.Color.Green);
      chargeBars.push(bar);
      game.addChild(bar);
    }
  }

  if(jumpAmount > 0) {
    jumper.rise(30);
    jumpAmount -= 30;
  }
  else if (!jumper.isOnGround()){
    jumper.fall(3)
  }
});

var scoreLabel = new ex.Label("Score: " + score, 5, 20);
scoreLabel.font = '20px sans-serif';
scoreLabel.color = ex.Color.Red;
scoreLabel.addEventListener('update', function(evt){
  this.text = "Score: " + score;
});

// Add an jumper to the current scene
game.addChild(jumper);
game.addChild(ground);
game.addChild(scoreLabel);

generateGoal();

// Start the game
game.start();