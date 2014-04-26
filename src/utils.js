var jumpTimerStart;
var jumpAmount;
var spacePushed = false;
var chargeLabel = null;
var score = 0;
var chargeBars = [];

randInt = function(lowerBound, upperBound) {
  return Math.floor((Math.random() * upperBound) + lowerBound);
}
