
/* a comment to lead in */
//#com.something.components.thing.Thing

/* not sure why this is needed */
if (typeof com.something.components.thing.Thing == 'undefined')
com.something.components.thing.Thing = (function() {

  /*  this makes extended and imported class available, it allows for use of statics, and instantiations of objects and supers  */
  var AnotherClass = com.something.AnotherClass;
  var AnotherThing = com.something.components.AnotherThing;

  /* This is, simply, just a variable being set... and it is the actual core function */
  var Thing = function Thing(parentScope) {
      // constructor
      this.AnotherThing(parentScope);
  };

  /* This is to keep the constructor property correct and inheritFrom uses this to copy one thing to the other.*/
  Thing.prototype.Thing = Thing;

  /* Add simple a method to the class */
  Thing.prototype.doSomething = function doSomething(a1, a2)
  {
    // comment
    var statement = a1;
    var f = function(){return a2 + 2;};

    return f;
  };

  /* A static method */
  Thing.test = function test()
  {
    // static
  };

  (function ()
  {
    // anonymous
  })();

  /* inhertance */
  Thing.inheritFrom(com.something.components.AnotherThing, Identifier({AnotherThing:1}));

  /* setting a name on the object, Identifier is used for the cryptor */
  if (!Thing.name) Thing.name = Identifier({Thing:1});

  /* to set it to the namespace property */
  return Thing;

})(); 