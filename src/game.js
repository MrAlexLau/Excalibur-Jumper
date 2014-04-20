var game = new ex.Engine(Config.gameWidth, Config.gameHeight);
game.backgroundColor = ex.Color.Black;


function calcChargeBarYOffset(barArray){
  var offset = Ground.y + Config.jumperHeight;
  if (barArray.length > 0){
    offset = barArray[barArray.length - 1].y + 20;
  }

  return offset;
}

function generateGoal() {
  var goal = new Goal(randInt(0, game.width - Config.jumperWidth), randInt(20, Ground.y - Ground.height - 20), Config.jumperWidth, Config.jumperHeight, ex.Color.Green);
  game.addChild(goal);
}

game.addEventListener('update', function(evt){
  if (spacePushed && Jumper.isOnGround()) {
    var d = new Date();
    var timeJumping = d.getTime() - jumpTimerStart;

    var numChargeBars = timeJumping / 500;
    if (numChargeBars > chargeBars.length){
      var yOffset = calcChargeBarYOffset(chargeBars);
      var bar = new ex.Actor(Jumper.x - Jumper.width / 2, yOffset, 40, 10, ex.Color.Green);
      chargeBars.push(bar);
      game.addChild(bar);
    }
  }

  if(jumpAmount > 0) {
    Jumper.rise(30);
    jumpAmount -= 30;
  }
  else if (!Jumper.isOnGround()){
    Jumper.fall(3)
  }
});


// Add an jumper to the current scene
game.addChild(Jumper);
game.addChild(Ground);
game.addChild(ScoreLabel);

generateGoal();

// Start the game
game.start();