var JumperGame = ex.Engine.extend({
  init : function() {
    var that = this;
    that.gameStarted = false;
    that.startGameTime = 0;

    that.addEventListener('keydown', function(event) {
      var that = this;
      if (!that.gameStarted) {
        if (event.key === ex.InputKey.Space) {
          score = 0;
          that.gameStarted = true;
          that.startGameTime = Date.now();
          that.timeLeft = 30;

          jumper = new Jumper(Config.gameWidth / 2 - Config.jumperWidth / 2, ground.y - Config.jumperHeight, Config.jumperWidth, Config.jumperHeight, ex.Color.Red);
          jumper.loadImages();
          jumper.init();
          defaultLevel.addChild(jumper);
          startLabel.kill();
        }
      }
    });

    that.addEventListener('update', function(event) {
      var that = this;
      if (that.isOver()) {
        that.gameStarted = false;
      }
      else {
        gameOverLabel.invisible = true;
      }
    });
  },

  getTimeLeft : function() {
    return Math.max(parseInt(this.timeLeft - (Date.now() - this.startGameTime) / 1000), 0);
  },

  addTime : function() {
    this.timeLeft += 1;
  },

  isOver : function() {
    return this.getTimeLeft() === 0;
  }
});
