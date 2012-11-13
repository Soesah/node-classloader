/*
 *  Node Classloader
 */

var Classloader = (function(){

  var ClassObject = require("./Class.js");
  
  var Classloader = function Classloader()
  {
    this.classList = [];
  };

  Classloader.prototype.Classloader = Classloader;

  Classloader.prototype.Package = function (namespaceURI)
  {
    // Create a class; a class always starts with a package, subsequent function calls will be applied to this class.
    var classObject = new ClassObject(namespaceURI);

    this.classList.push(classObject);
    this.currentClass = classObject;

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

  Classloader.prototype.Import = function ()
  {
    // register the imports on the class
    for (var i = 0; i < arguments.length; i++) 
    {
     var importClass = arguments[i];
     this.currentClass.addImport(importClass);
    };
  };

  Classloader.prototype.Extends = function ()
  {
    // register extension on the class
    for (var i = 0; i < arguments.length; i++) 
    {
     var extendClass = arguments[i];
     this.currentClass.addExtend(extendClass);
    };  
  };

  Classloader.prototype.Class = function () 
  {
    // the 'Class' method contains the contents of the class
    this.parseMethods(arguments); 
  };

  Classloader.prototype.Singleton = function () 
  {
    this.currentClass.setSingleton();

    this.parseMethods(arguments);
  };

  Classloader.prototype.parseMethods = function (args) 
  {
    // Parse the methods in the class
    for (var i = 0; i < args.length; i++) 
    {
      var arg = args[i];
      if(typeof arg == 'function')
      {
        var name = this.getMethodName(arg);
        if(i == 0) // the first method is the constructor 
          this.currentClass.setConstructor(name, arg);
        else
          this.currentClass.addMethod(name, arg);
      }
      else
        this.currentClass.setFlag(arg);        
    }; 
  };

  // register a resource on the class
  Classloader.prototype.CSSResource = function (rsc) 
  {
    this.currentClass.setResource("CSSResource", rsc);
  };

  // register a resource on the class
  Classloader.prototype.XMLResource = function (rsc) 
  {
    this.currentClass.setResource("XMLResource", rsc);
  };

  Classloader.prototype.getMethodName = function (f) {
    var str = f.toString();
    var name = str.substring(str.indexOf(' ')+1, str.indexOf("("));
    if(name == '' || name == ' ')
      return name;
    else
      return name;
  };

  Classloader.prototype.namespaces = {};
  Classloader.prototype.Static = "static";
  Classloader.prototype.Protected = "protected";
  Classloader.prototype.Public = "public";


  return Classloader;
})();

module.exports = Classloader;

