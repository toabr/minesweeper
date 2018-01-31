// extend the array object
// ================================================================
Array.prototype.inArray = function inArray(value){
  for(var i=0; i< this.length; i++){
    if(this[i] === value){
      return true;
    }
  }
  return false;
}

// Warn if overriding existing method
  if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}

if(Array.prototype.contains)
    console.warn("Overriding existing Array.prototype.contains. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .contains method to Array's prototype to call it on any array
Array.prototype.contains = function (thing) {
    // if the other array is a falsy value, return false
    if (!this)
        return false;

    //start by assuming the array doesn't contain the thing
    var result = false;
    for (var i = 0, l=this.length; i < l; i++)
      {
      //if anything in the array is the thing then change our mind from before

      if (this[i] instanceof Array)
        {if (this[i].equals(thing))
          result = true;}
        else
          if (this[i]===thing)
            result = true;


      }
     //return the decision we left in the variable, result
    return result;
}

//if(Array.prototype.indexOf)
    //no warnings here because I'm intentionally overriding it, but it should do the same thing in all cases except nested arrays
// attach the .indexOf method to Array's prototype to call it on any array
Array.prototype.indexOf = function (thing)
  {
    // if the other array is a falsy value, return -1
    if (!this)
        return -1;

    //start by assuming the array doesn't contain the thing
    var result = -1;
    for (var i = 0, l=this.length; i < l; i++)
      {
      //if anything in the array is the thing then change our mind from before
      if (this[i] instanceof Array)
        if (this[i].equals(thing))
          result = i;
        else
          if (this[i]===thing)
            result = i;


      }
     //return the decision we left in the variable, result
    return result;
}
