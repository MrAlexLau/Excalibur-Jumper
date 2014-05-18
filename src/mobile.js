Config.pressToStart = 'Tap to start'; // 112px in width
Config.startLabelX = Config.gameWidth / 2 - 56;

window.ondevicemotion = function(event) {
  var accelerationX = event.accelerationIncludingGravity.x;
  if (accelerationX > 0) {
    jumper.moveRight();
  }
  else {
    jumper.moveLeft();
  }
}

ex.TouchStart = function(evt) {
  jumper.startCharge();
};

ex.TouchEnd = function(evt) {
  jumper.endCharge();
};
