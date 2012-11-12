/*
 *  Node Class Loader
 */

var ClassLoader = (function(){

  var c = require("./Class.js");
  
  var ClassLoader = function ClassLoader()
  {
    this.classList = new Array();
  };

  ClassLoader.prototype.ClassLoader = ClassLoader;

  // register the package
  ClassLoader.prototype.Package = function Package(namespaceURI)
  {
    var cl = new c(namespaceURI);

    this.classList.push(cl);
    this.currentClass = cl;

    var namespaces = namespaceURI.split(".");
    var obj = this.namespaces;

    for (var i = 0; i < namespaces.length; i++) 
    {
      var ns = namespaces[i];
      if(obj[ns] === undefined) 
      {
        obj[ns] = {};
        obj = obj[ns];
      }
      else
        obj = obj[ns];
    };
  };

  // import other classes
  ClassLoader.prototype.Import = function Import()
  {
    for (var i = 0; i < arguments.length; i++) 
    {
     var importClass = arguments[i];
     this.currentClass.addImport(importClass);
    };
  };

  // extends other classes
  ClassLoader.prototype.Extends = function Extends()
  {
    for (var i = 0; i < arguments.length; i++) 
    {
     var extendClass = arguments[i];
     this.currentClass.addExtend(extendClass);
    };  
  };

  // setup a class
  ClassLoader.prototype.Class = function Class() 
  {
    this.parseMethods(arguments); 
  };

  ClassLoader.prototype.Singleton = function Singleton () 
  {
    this.currentClass.setSingleton();

    this.parseMethods(arguments);
  };

  ClassLoader.prototype.parseMethods = function(args) 
  {
    for (var i = 0; i < args.length; i++) 
    {
      var arg = args[i];
      var name = this.getName(arg);
      if(typeof arg == 'function')
      {
        if(i == 0)
          this.currentClass.setConstructor(name, arg);
        else
          this.currentClass.addMethod(name, arg);
      }
      else
        this.currentClass.setFlag(arg);        
    }; 
  };

  ClassLoader.prototype.CSSResource = function CSSResource (rsc) 
  {
    this.currentClass.setResource("CSSResource", rsc);
  };

  ClassLoader.prototype.XMLResource = function XMLResource (rsc) 
  {
    this.currentClass.setResource("XMLResource", rsc);
  };

  ClassLoader.prototype.getName = function getName(f) {
    var str = f.toString();
    var name = str.substring(str.indexOf(' ')+1, str.indexOf("("));
    if(name == '' || name == ' ')
      return name;
    else
      return name;
  };

  ClassLoader.prototype.namespaces = {};
  ClassLoader.prototype.Static = "static";
  ClassLoader.prototype.Protected = "protected";
  ClassLoader.prototype.Public = "public";


  return ClassLoader;
})();

module.exports = ClassLoader;

