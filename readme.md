# Node ClassLoader

This is a Javascript classloader that converts easy to read (and valid) Javascript in functioning and executable Javascript.

The classloader uses a php script to output the compiled code as Javascript to the browser. I didn't feel like using a NodeJS server for that. The php calls does a command line call to NodeJS to run the Classloader.

The Classloader parses the original Javascript. Resolves dependencies and finally writes the output. The Classloader compiles classes that follow the format below. 

## Example source code

<pre>
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
</pre> 
The classloader supports Class or Singleton, Importing and Extending other classes, resources, and Static and anonymous methods.

## Example output

<pre>
/* a comment to lead in */
//#com.something.components.thing.Thing
 
if (typeof com.something.components.thing.Thing == 'undefined')
com.something.components.thing.Thing = (function() {
 
  /*  this makes extended and imported class available, it allows for use of statics, and instantiations of objects and supers  */
  var AnotherClass = com.something.AnotherClass;
  var AnotherThing = com.something.components.AnotherThing;

  /* This is, simply, just a variable being set... and it is the actual core function */
  var Thing = function Thing(parentScope) 
  {
    // constructor
    this.AnotherThing(parentScope);
  };
 
  /* This is to keep the constructor property correct and Extends uses this to copy one thing to the other.*/
  Thing.prototype.Thing = Thing;
 
  /* Add simple a method to the class */
  Thing.prototype.doSomething = function doSomething(a1, a2)
  {
    var statement = a1;
    var f = function(){return a2 + 2;};

    return f;
  };
 
  /* A static method */
  Thing.test = function test()
  {
  };
 
  (function ()
  {
  })();
 
  /* inhertance using the Extends method that the classloader adds to Function.prototype */
  Thing.Extends(com.something.components.AnotherThing, Identifier({AnotherThing:1}));

  /* add the resources as static properties on the class*/
  Thing.XMLResource = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><xml/>";
 
  Thing.CSSResource = "xml {font-family:arial;}";
 
  /* setting a name on the object, Identifier is used for the cryptor */
  if (!Thing.name) Thing.name = Identifier({Thing:1});
 
  /* to set it to the namespace property */
  return Thing;
 
})(); 
</pre>

## Todo
- write down demands on code and source folders and packages
- throw more errors when you write improper classes
- set up unit testing of a sort.
- implement crypting
- implement building
- implement minifying (isn't that the same as crypting?)