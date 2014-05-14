var game = new ex.Engine(Config.gameWidth, Config.gameHeight);

game.backgroundColor = ex.Color.Black;

var coinSound = new ex.Sound('res/coin.wav');
var jumpSound = new ex.Sound('res/jump.wav');

var jumperStanding = new ex.Texture('res/standing1.png');  // courtesy of http://www.kenney.nl/assets
var jumperCrouching = new ex.Texture('res/crouching.png');  // courtesy of http://www.kenney.nl/assets
var jumperFlying = new ex.Texture('res/flying.png');  // courtesy of http://www.kenney.nl/assets
var coinGold = new ex.Texture('res/coinGold.png');  // courtesy of http://www.kenney.nl/assets
var level0 = new BaseLevel('res/background.json');  // courtesy of http://www.kenney.nl/assets
var loader = new ex.Loader([coinSound, jumpSound, jumperCrouching, jumperStanding, jumperFlying, coinGold, level0]);
// level0.initialize();
level0.load();

game.load(loader).then(function(){
   coinSound.setVolume(Config.soundVolume);
   jumpSound.setVolume(Config.soundVolume);
});


generateGoal = function() {
  var goal = new Goal(randInt(0, game.width - Config.goalWidth), randInt(20, ground.y - ground.height - (Config.goalHeight + 10)), Config.goalWidth, Config.goalHeight, ex.Color.Green);
  goal.init();
  level0.addChild(goal);
}

var scoreLabel = new ex.Label("Score: " + score, 5, 20);
scoreLabel.font = '15px sans-serif';
scoreLabel.color = ex.Color.Black;
scoreLabel.addEventListener('update', function(evt){
  this.text = "Score: " + score;
});

// Add actors to the game
level0.addChild(jumper);
level0.addChild(ground);
level0.addChild(scoreLabel);

generateGoal();
game.addScene("level0", level0);
game.goToScene('level0');
// Start the game
game.start();
