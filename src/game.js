var game = new JumperGame(Config.gameWidth, Config.gameHeight);
game.init();

game.backgroundColor = ex.Color.Black;

var coinSound = new ex.Sound('res/coin.wav');
var jumpSound = new ex.Sound('res/jump.wav');

var jumperStanding = new ex.Texture('res/standing1.png');  // courtesy of http://www.kenney.nl/assets
var jumperCrouching = new ex.Texture('res/crouching.png');  // courtesy of http://www.kenney.nl/assets
var jumperFlying = new ex.Texture('res/flying.png');  // courtesy of http://www.kenney.nl/assets
var coinGold = new ex.Texture('res/coinGold.png');  // courtesy of http://www.kenney.nl/assets
var defaultLevel = new BaseLevel('res/background.json');  // courtesy of http://www.kenney.nl/assets
var loader = new ex.Loader([coinSound, jumpSound, jumperCrouching, jumperStanding, jumperFlying, coinGold, defaultLevel]);

defaultLevel.load();

game.load(loader).then(function(){
  jumper.loadImages();
  coinSound.setVolume(Config.soundVolume);
  jumpSound.setVolume(Config.soundVolume);
});


generateGoal = function() {
  var goal = new Goal(randInt(0, game.width - Config.goalWidth), randInt(20, ground.y - Config.groundHeight - (Config.goalHeight + 10)), Config.goalWidth, Config.goalHeight, ex.Color.Green);
  goal.init();
  defaultLevel.addChild(goal);
}

var scoreLabel = new ex.Label("Score: " + score, 5, 20);
scoreLabel.font = '15px sans-serif';
scoreLabel.color = ex.Color.Black;
scoreLabel.invisible = true;
scoreLabel.addEventListener('update', function(evt){
  this.text = "Score: " + score;

  if (game.gameStarted) {
    scoreLabel.invisible = false;
  }
});

var timeLabel = new ex.Label("Score: " + score, Config.gameWidth - 70, 20);
timeLabel.font = '15px sans-serif';
timeLabel.color = ex.Color.Black;
timeLabel.invisible = true;
timeLabel.addEventListener('update', function(evt){
  this.text = "Time: " + game.getTimeLeft();

  if (game.gameStarted) {
    timeLabel.invisible = false;
  }

  if (game.isOver()) {
    timeLabel.invisible = true;
  }
});

var startLabel = new ex.Label(Config.pressToStart, Config.startLabelX, Config.gameHeight / 2);
startLabel.font = '20px sans-serif';
startLabel.color = ex.Color.Black;
startLabel.addEventListener('update', function(evt){
  if (game.gameStarted) {
    startLabel.invisible = true;
  }
});

var gameOverLabel = new ex.Label('Game Over', Config.gameWidth / 2, Config.gameHeight / 2);
gameOverLabel.x -= 51 // adjust for label width (102px total)
gameOverLabel.font = '20px sans-serif';
gameOverLabel.color = ex.Color.Black;
gameOverLabel.invisible = true;
gameOverLabel.addEventListener('update', function(evt){
  if (game.isOver()) {
    gameOverLabel.invisible = false;
  }
});

// Add actors to the game
defaultLevel.addChild(jumper);
defaultLevel.addChild(scoreLabel);
defaultLevel.addChild(timeLabel);
defaultLevel.addChild(startLabel);
defaultLevel.addChild(gameOverLabel);

generateGoal();
game.addScene("defaultLevel", defaultLevel);
game.goToScene('defaultLevel');

// Start the game
game.start();
