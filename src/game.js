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



// Add actors to the game
defaultLevel.addChild(scoreLabel);
defaultLevel.addChild(timeLabel);
defaultLevel.addChild(gameOverLabel);

showStartLabel();
generateGoal();
game.addScene("defaultLevel", defaultLevel);
game.goToScene('defaultLevel');

// Start the game
game.start();
