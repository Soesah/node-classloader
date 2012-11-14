/*
 *  Node Classloader
 */

var Classloader = (function(){

  var ClassObject = require("./Class.js");
  
  var Classloader = function Classloader(sourcePath)
  {
    this.sourcePath = sourcePath;
    this.classes = {};
    this.classOrder = [];
    this.namespaces = {};
  };

  Classloader.prototype.Classloader = Classloader;

  Classloader.prototype.Package = function (namespaceURI)
  {
    // Create a class; a class always starts with a package, subsequent function calls will be applied to this class.
    this.currentClass = new ClassObject(namespaceURI);

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
    }
  };

  Classloader.prototype.Import = function ()
  {
    // register the imports on the class
    for (var i = 0; i < arguments.length; i++) 
    {
     var importClass = arguments[i];
     this.currentClass.addImport(importClass);
    }
  };

  Classloader.prototype.Extends = function ()
  {
    // register extension on the class
    for (var i = 0; i < arguments.length; i++) 
    {
     var extendClass = arguments[i];
     this.currentClass.addExtend(extendClass);
    } 
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
        {
          this.currentClass.setConstructor(name, arg);

          // add the class now that we have the full identifier
          var namespaceURI = this.currentClass.getName();
          this.classes[namespaceURI] = this.currentClass;
        }
        else
          this.currentClass.addMethod(name, arg);
      }
      else
        this.currentClass.setFlag(arg);        
    } 
  };

  // register a resource on the class
  Classloader.prototype.CSSResource = function (rsc) 
  {
    this.currentClass.addResource("CSSResource", this.sourcePath, rsc);
  };

  // register a resource on the class
  Classloader.prototype.XMLResource = function (rsc) 
  {
    this.currentClass.addResource("XMLResource", this.sourcePath, rsc);
  };

  Classloader.prototype.getMethodName = function (f) {
    var str = f.toString();
    var name = str.substring(str.indexOf(' ')+1, str.indexOf("("));
    if(name == '' || name == ' ')
      return name;
    else
      return name;
  };

  Classloader.prototype.resolveDependencies = function () 
  {
    var classes = this.getUnresolvedClasses();
    var runs = 0;
    var maxruns = 20;
    while(classes != 0 && maxruns >= runs)
    {
      for (var namespaceURI in classes) 
      {
        var c = classes[namespaceURI];

        if(c.hasUnresolvedDependencies(this.classes))
          continue;
        else
        {
          c.setResolved();
          // add the classname to an ordered list of classes to render
          this.classOrder.push(c.getName());
        }
      }

      runs++;
      classes = this.getUnresolvedClasses();
    }
  };

  Classloader.prototype.getUnresolvedClasses = function ()
  {
    var classes = {};
    for(var namespaceURI in this.classes)
      if(!this.classes[namespaceURI].isResolved())
        classes[namespaceURI] = this.classes[namespaceURI];
    if (Object.keys(classes).length != 0) 
      return classes;
    else
      return false;
  }

  Classloader.prototype.Static = "static";
  Classloader.prototype.Public = "public";
  Classloader.prototype.Protected = "protected";


  return Classloader;
})();

module.exports = Classloader;

