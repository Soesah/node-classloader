# Node ClassLoader

This is a JavaScript classloader that converts easy-to-read (and valid) JavaScript with a Class structure in functioning and executable JavaScript.

The classloader can be used through a php script to output the compiled code as JavaScript to the browser. The php does a command line call to NodeJS to run the Classloader with the proper arguments. 

The Classloader parses the original JavaScript, resolves dependencies and finally writes the output. The Classloader compiles classes that follow the format below. 

## Configuration

<code>classloader.php</code> contains two variables, path and package. Path is configured in classloader and refers to the source directory that the Classloader will scan for classes. The default for this is '<i>source</i>' Package refers to the package name. You can load smaller packages from the source. 

Below you can find how to write a class, and what the Classloader does with it.

## Example source code

<pre>
/* Always start a class with a package declaration */  
Package("com.something.components.thing");
 
/* Import classes to use them */  
Import("com.something.AnotherClass");
 
/* Extend classes to inherit functionality */  
Extends("com.something.components.AnotherThing");
 
/* Resources can be used to import data */  
XMLResource("Thing.template.xml");

/* A CSS resource */  
CSSResource("Thing.css");

/* This is the class declaration */    
Class  
(
  /* The first method is the constructor and carries the name of the class */  
  function Thing(argument)
  {
    /* Call to super constructor */  
    this.AnotherThing(parentScope);
  },
 
  /* A method on the class */  
  function doSomething(a1, a2)
  {
    var statement = a1;
    var f = function(){return a2 + 2;};
 
    return f;
  },
 
  /* A static method */  
  Static, function test()
  {
  },
 
  /* An anonymous method, which will be called within the class  */  
  function ()
  {
  }
)
</pre> 
The classloader supports Class or Singleton, Importing and Extending other classes, resources, and Static and anonymous methods.

## Example output

<pre>
/* A comment to lead in */
//#com.something.components.thing.Thing
 
if (typeof com.something.components.thing.Thing == 'undefined')
com.something.components.thing.Thing = (function() {
 
  /*  Make Imports and Extended classes available  */
  var AnotherClass = com.something.AnotherClass;
  var AnotherThing = com.something.components.AnotherThing;

  /* First we create a variable and assign a function, the foundation of the class */
  var Thing = function Thing(parentScope) 
  {
    this.AnotherThing(parentScope);
  };
 
  /* This is to keep the constructor property correct and when extended creates the super as this.Classname.*/
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
 
  /* Inhertance is accomplished by the Extends method that the Classloader adds to Function.prototype */
  Thing.Extends(com.something.components.AnotherThing, Identifier({AnotherThing:1}));

  /* Resources are added as static properties */
  Thing.XMLResource = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><xml/>";
 
  Thing.CSSResource = "xml {font-family:arial;}";
  
  /* Set a name property on the Class */
  if (!Thing.name) Thing.name = 'Thing';
  
  /* This completes the Class */
  return Thing;
 
})(); 
</pre>

## Todo
- parse comments out of the source
  - this requires parsing the code as a string. 
  - Comments outside of methods are already parsed out, comments inside functions are not
- implement building
  - building means outputting a js file
- implement crypting
  - crypting is accomplished by changing the names of objects and methods and properties to something shorter
  - this may means parsing methods in order to crypt them
  - See http://code.google.com/p/pynarcissus/source/checkout
- implement minifying (isn't that the same as crypting?)
  - you could remove unnecessary whitespace
- set up unit testing of a sort
  - you could even run this from NodeJS
- does it matter if anonymous static methods (Which get executed straight away) are before the extends statement? 
