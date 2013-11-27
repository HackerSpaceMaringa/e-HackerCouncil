/*
 * Method to execute the function "callback"
 * every midnight.
 */

var oneDay = 86400000;
var callFunc;
var setUpInt;

exports.doEveryMidNight = function(callback) {
   callFunc = callback;
   setUpInt = setInterval(isMidNight, 1000);
}

var isMidNight = function() {
   var data = new Date();
   if (data.getHours() == 0 &&
         data.getMinutes() == 0 &&
         data.getSeconds() == 0) {

            clearInterval(setUpInt);
            setInterval(function() { callFunc(); }, oneDay);
         }
}
