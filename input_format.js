/*
 * this is a nice way of writing Javascript, with classes, inheritence, imports, and resources
 */

/* register the package name */
Package("com.something.components.thing");

/* import a class */
Import("com.something.AnotherClass");

/* extend a class, currently we'll only do single. */
Extends("com.something.components.AnotherThing");

/* add a resource to the object */
XMLResource("Thing.template.xml");
/* add another resource */
CSSResource("Thing.css");

/* define a class */
Class
(
  /* constructor, which has the name */
  function Thing(argument)
  {
    /* call to super constructor */
    this.AnotherThing(parentScope);
  },

  /* class method */
  function doSomething(a1, a2)
  {
    var statement = a1;
    var f = function(){return a2 + 2;};

    return f;
  },

  /* static method */
  Static, function test()
  {
  },

  /* anonymous method, will be called within the class  */
  function ()
  {
  }
)

