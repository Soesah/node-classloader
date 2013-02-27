/*
 *  Node Classloader
 */

var sourcePath = process.argv[2];
var package = process.argv[3];

var Classloader = (function(){

  var Glob = require('./Glob.js');
  var FileSystem = require('fs');
  var ClassObject = require("./Class.js");

  var Classloader = function Classloader(sourcePath, package)
  {
    this.version = "1.42";

    if (sourcePath == undefined || package == undefined)
      throw new Error("Classloader requires a source folder and package name");

    if (!FileSystem.existsSync(sourcePath))
      throw new Error("Source path could not be opened");

    if (!FileSystem.existsSync(sourcePath + "/" + package.replace(/\./g, "/") + ".js"))
      throw new Error("Package name is not a fully qualified package");

    this.sourcePath = sourcePath;
    this.package = package;
    this.packageRoot = this.package.substring(0, this.package.indexOf(".")); // get the root of the package we are loading
    this.object = this.package.substring(this.package.lastIndexOf(".") + 1); // get the name of the object

    this.classes = {};
    this.classOrder = [];
    this.namespaces = {};

    this.encoding = "utf-8";
    this.EOF = "\n";
    this.D_EOF = "\n\n";

    this.filelist = new Glob(this.sourcePath + "/" + this.packageRoot, ".js").getList();

    if (this.filelist.length == 0)
      throw new Error("Found no files to compile");

    this.sourceCode = this.getSourceContent(this.filelist);
  };

  Classloader.prototype.Classloader = Classloader;

  Classloader.prototype.Package = function (namespaceURI)
  {
    if (namespaceURI == "")
      throw new Error("Package namespaceURI cannot be empty");

    // Create a class; a class always starts with a package, subsequent function calls will be applied to this class.
    this.currentClass = new ClassObject(namespaceURI);
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
     this.currentClass.addExtends(extendClass);
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

  Classloader.prototype.Abstract = "abstract";
  Classloader.prototype.Static = "static";
  Classloader.prototype.Public = "public";
  Classloader.prototype.Protected = "protected";

  Classloader.prototype.parseMethods = function (args) 
  {

    if (typeof args[0] !== "function")
      throw new Error("First argument of Class should be a function");

    // Parse the methods in the class
    for (var i = 0; i < args.length; i++) 
    {
      var arg = args[i];
      if (typeof arg == "function")
      {
        var name = this.getMethodName(arg);
        if (i == 0) // the first method is the constructor 
        {
          if (name == "")
            throw new Error("First method of a class should carry the Class name");

          this.currentClass.setConstructor(name, arg);

          // add the class now that we have the full identifier
          var namespaceURI = this.currentClass.getName();
          this.classes[namespaceURI] = this.currentClass;
        }
        else
          this.currentClass.addMethod(name, arg);
      }
      else if (typeof arg == "object")
      {
        for(var name in arg)
          this.currentClass.setProperty(name, arg[name])
      }
      else if (typeof arg == "string")
        this.currentClass.setFlag(arg);        
      else
        throw new Error("Class could not parse object of type " + (typeof arg));
    } 
  };

  Classloader.prototype.getMethodName = function (f) {
    var str = f.toString();
    var name = str.substring(str.indexOf(' ')+1, str.indexOf("("));
    if (name == '' || name == ' ')
      return false;
    else
      return name;
  };

  Classloader.prototype.resolveDependencies = function () 
  {
    // update dependencies and parents
    for (var namespaceURI in this.classes)
    {
      var classObject = this.classes[namespaceURI];
      var dependencies = classObject.getDependencies();
      
      for (var dependency in dependencies)
      {
        var dependencyObject = this.classes[dependency];

        if (dependencyObject == undefined)
          throw new Error("Class '"+namespaceURI+"' could not resolve dependency on '"+dependency+"'")

        // update the dependency with the full class object
        classObject.addDependency(dependency, dependencyObject);
      }
    }

    this.resolveOrder(this.package);
  };

  Classloader.prototype.resolveOrder = function (namespaceURI)
  {
    var classObject = this.classes[namespaceURI];

    for (var dependencyURI in classObject.getUnresolvedDependencies())
      this.resolveOrder(dependencyURI);

    if (!classObject.isResolved())
    {
      this.classOrder.push(classObject);
      classObject.setResolved();
    }
  }

  Classloader.prototype.getUnresolvedClasses = function ()
  {
    var classes = {};
    for(var namespaceURI in this.classes)
    {
      if (!this.classes[namespaceURI].isResolved())
        classes[namespaceURI] = this.classes[namespaceURI];    
    }
    if (Object.keys(classes).length != 0) 
      return classes;
    else
      return false;
  };

  Classloader.prototype.gatherNamespaces = function()
  {
    for (var namespaceURI in this.classes)
    {
      if (this.classes[namespaceURI].isResolved())
      {
        var namespaces = namespaceURI.split(".");
        var obj = this.namespaces;

        for (var i = 0; i < namespaces.length -1; i++) 
        {
          var ns = namespaces[i];
          if (obj[ns] === undefined) 
          {
            obj[ns] = {};
            obj = obj[ns];
          }
          else
            obj = obj[ns];
        }
      }
    }
  };

  Classloader.prototype.getSourceContent = function(filelist)
  {
    var sources = filelist.map(function(file){
            return FileSystem.readFileSync(file, this.encoding);
          });
    return sources.join(this.EOF);
  };

  Classloader.prototype.compile = function ()  
  {
    eval(this.sourceCode);

    this.resolveDependencies();

    this.gatherNamespaces();
  };

  Classloader.prototype.writeOutput = function() 
  {    
    process.stdout.write("\"use strict\";\n");
    process.stdout.write("// " + this.object + " - Node Classloader Version " + this.version + this.D_EOF);
    process.stdout.write(this.writeExtendsFunction() + this.D_EOF);
    process.stdout.write(this.writeNamespaces(this.namespaces, true) + this.D_EOF);

    for (var i = 0; i < this.classOrder.length; i++) 
      process.stdout.write(this.writeClassDefinition(this.classOrder[i]));
  };

  Classloader.prototype.writeExtendsFunction = function()
  {
    return ["Function.prototype.Extends = function(base)", 
            "{", 
            "  if (!base)", 
            "    debugger;", 
            "  for (var name in base.prototype)", 
            "  {", 
            "    if (this.prototype[name]) //if the method exists, declare it as a super method" +this.EOF + 
            "      this.prototype[base.name + \"$\" + name] = base.prototype[name];" +this.EOF + 
            "    else //if the method does not exist, declare it as regular", 
            "      this.prototype[name] = base.prototype[name];", 
            "  }", 
            "} "].join(this.EOF) ;
  };

  Classloader.prototype.writeNamespaces = function (obj, isroot) 
  {
    var str = "";
    for(var name in obj)
    {
      if (isroot)
        str += "var " + name +" = {" + this.writeNamespaces(obj[name])+ "}; ";
      else
        str += name +": {" + this.writeNamespaces(obj[name])+ "},";
    }

    return str.substring(0, str.length - 1);
  }

  Classloader.prototype.writeClassDefinition = function(c)
  {
    var str = "";
    str += "// " + c.getName() + this.EOF;
    str += "if (typeof " + c.getName() + " == 'undefined')" + this.EOF;
    str += c.getName() + " = (function()" + this.EOF;
    str += "{" + this.D_EOF;

    var dependencyCount = 1;
    for(var namespaceURI in c.dependencies)
    {
      var pre = (dependencyCount === 1)?"  var ":"      ";
      str += pre + this.classes[namespaceURI].getClassName() + " = " + namespaceURI + "," + this.EOF;
      dependencyCount += 1;
    } 

    var pre = (!c.hasDependencies())?"  var ":"      ";
    str += pre + c.getClassName() + " = " + c.constr.method + this.D_EOF;

    var prototypestr = "  " + c.getClassName() + ".prototype.";
    var staticstr = "  " + c.getClassName() + ".";
    str +=  prototypestr+ c.getClassName() + " = " + c.getClassName() + ";" + this.D_EOF;

    for (var i = 0; i < c.methods.length; i++) 
    {
      var method = c.methods[i];
      if (!method.name) //anonymous functions
        str += "  (" + method.method + ")();" + this.D_EOF;
      else if (method.flag == this.Static) // static methods
        str += staticstr + method.name + " = " + method.method + ";" + this.D_EOF;
      else
        str += prototypestr + method.name + " = " + method.method + ";" + this.D_EOF;
    }
    if (c.extends.length != 0)  
    {
      for (var i = 0; i < c.extends.length; i++)
        str += "  " + c.getClassName() + ".Extends(" + c.extends[i] +");" + this.EOF;
      str += this.EOF;
    }

    for (var i = 0; i < c.resources.length; i++)
      str += "  " + c.getClassName() + "." + c.resources[i].type + " = \"" + c.resources[i].getContents() + "\";" + this.D_EOF;

    for(var name in c.getProperties())
      str += "  " + c.getClassName() + "." + name + " = " + c.getProperty(name) + ";" + this.EOF;
    if (c.hasProperties())
      str += this.EOF;

    str += "  if (!" + c.getClassName() + ".name) " + c.getClassName() + ".name = '" +c.getClassName()+ "';" + this.D_EOF;

    if (c.singleton)
      str += "  return new " + c.getClassName() + "();" + this.D_EOF + "})();" + this.D_EOF;
    else
      str += "  return " + c.getClassName() + ";" + this.D_EOF + "})();" + this.D_EOF;

    return str;
  };

  return Classloader;
})();

try
{
  var classloader = new Classloader(sourcePath, package);

  // globally register functions called in source , and route them to the Classloader
  Package     = function () { classloader.Package.apply(classloader, arguments)};
  Extends     = function () { classloader.Extends.apply(classloader, arguments)};
  Import      = function () { classloader.Import.apply(classloader, arguments)};
  Class       = function () { classloader.Class.apply(classloader, arguments)};
  Singleton   = function () { classloader.Singleton.apply(classloader, arguments)};
  XMLResource = function () { classloader.XMLResource.apply(classloader, arguments)};
  CSSResource = function () { classloader.CSSResource.apply(classloader, arguments)};

  // flags
  Abstract    = classloader.Abstract;
  Static      = classloader.Static;
  Public      = classloader.Public;
  Protected   = classloader.Protected;

  classloader.compile();
  classloader.writeOutput();
}
catch (e)
{
  process.stdout.write("console.error(\"Classloader " +e.stack.replace(/\n/g,'\\n')+"\");");
}