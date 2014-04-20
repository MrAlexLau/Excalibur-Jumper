
var jumpTimerStart;
var jumpAmount;
var spacePushed = false;
var chargeLabel = null;
var score = 0;
var chargeBars = [];

function randInt(lowerBound, upperBound){
  return Math.floor((Math.random() * upperBound) + lowerBound);
}