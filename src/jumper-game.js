var JumperGame = ex.Engine.extend({
  init : function() {
    var that = this;
    that.gameStarted = false;
    that.startGameTime = 0;

    that.addEventListener('keydown', function(event) {
      var that = this;
      if (!that.gameStarted) {
        if (event.key === ex.InputKey.Space){
          that.gameStarted = true;
          that.startGameTime = Date.now();
          that.timeLeft = 30;
        }
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
