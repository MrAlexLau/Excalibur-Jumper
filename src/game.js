var game = new ex.Engine(Config.gameWidth, Config.gameHeight);
game.backgroundColor = ex.Color.Black;

generateGoal = function() {
  var goal = new Goal(randInt(0, game.width - Config.jumperWidth), randInt(20, ground.y - ground.height - 20), Config.jumperWidth, Config.jumperHeight, ex.Color.Green);
  game.addChild(goal);
}

var scoreLabel = new ex.Label("Score: " + score, 5, 20);
scoreLabel.font = '20px sans-serif';
scoreLabel.color = ex.Color.Red;
scoreLabel.addEventListener('update', function(evt){
  this.text = "Score: " + score;
});

// Add actors to the game
game.addChild(jumper);
game.addChild(ground);
game.addChild(scoreLabel);

generateGoal();

// Start the game
game.start();
