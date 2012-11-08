Package("com.something.components.thing");


Import("com.something.AnotherClass");
Extends("com.something.components.AnotherThing");

XMLResource("Thing.template.xml");
CSSResource("Thing.css");

Class
(
  function Thing(argument)
  {
    // constructor
    this.AnotherThing(parentScope);
  },

  function doSomething(a1, a2)
  {
    // comment
    var statement = a1;
    var f = function(){return a2 + 2;};

    return f;
  },

  Static, function test()
  {
    // static
  },

  function ()
  {
    // anonymous
  }
)

