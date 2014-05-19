
var scoreLabel = new ex.Label("", 5, 20);
scoreLabel.font = '15px sans-serif';
scoreLabel.color = ex.Color.Black;
scoreLabel.invisible = true;
scoreLabel.addEventListener('update', function(evt) {
  this.text = "Score: " + score;

  if (game.gameStarted) {
    scoreLabel.invisible = false;
  }
});

var timeLabel = new ex.Label("", Config.gameWidth - 70, 20);
timeLabel.font = '15px sans-serif';
timeLabel.color = ex.Color.Black;
timeLabel.invisible = true;
timeLabel.addEventListener('update', function(evt) {
  this.text = "Time: " + game.getTimeLeft();

  if (game.gameStarted) {
    timeLabel.invisible = false;
  }

  if (game.isOver()) {
    timeLabel.invisible = true;
  }
});

var startLabel;
var showStartLabel = function() {
  startLabel = new ex.Label(Config.pressToStart, Config.startLabelX, Config.gameHeight / 2);
  startLabel.font = '20px sans-serif';
  startLabel.color = ex.Color.Black;
  startLabel.blink(1, 9999999, 500);
  defaultLevel.addChild(startLabel);
}

var gameOverLabel = new ex.Label('Game Over', Config.gameWidth / 2, Config.gameHeight / 2 - 50);
gameOverLabel.x -= 51 // adjust for label width (102px total)
gameOverLabel.font = '20px sans-serif';
gameOverLabel.color = ex.Color.Black;
gameOverLabel.invisible = true;
gameOverLabel.addEventListener('update', function(evt) {
  if (game.isOver()) {
    gameOverLabel.invisible = false;
    if (startLabel._isKilled) {
      showStartLabel();
    }
  }
});