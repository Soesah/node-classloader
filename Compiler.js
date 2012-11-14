/*
 *  Node Classloader Compiler
 */

var sourcePath = process.argv[2];
var filelist = require('./filelist.js').filelist;

var Compiler = (function(){
  
  var Classloader = require('./Classloader.js');
  var FileSystem = require('fs');

  var Compiler = function Compiler(sourcePath, filelist)
  {
    this.encoding = "utf-8";
    this.end_of_line = "\n";

    if(sourcePath == undefined)
      throw new Error("A source must be provided to the Compiler")


    this.classloader = new Classloader(sourcePath);
    this.sourceCode = this.concatenate(filelist)
  }

  Compiler.prototype.Compiler = Compiler;

  Compiler.prototype.concatenate = function(filelist)
  {
    var sources = filelist.map(function(file){
            return FileSystem.readFileSync(file, this.encoding);
          });
    return sources.join(this.end_of_line);
  };

  Compiler.prototype.compile = function ()  
  {
    eval(this.sourceCode);

    this.classloader.resolveDependencies();
  };

  Compiler.prototype.output = function() 
  {
    this.double_end_of_line = "\n\n";

    var cl = this.classloader;
    process.stdout.write("// Node Classloader Version " + cl.version + this.double_end_of_line);
    process.stdout.write(this.writeExtendsFunction() + this.double_end_of_line);
    process.stdout.write(this.writeNamespaces(cl.namespaces, true) + this.double_end_of_line);

    for (var i = 0; i < cl.classOrder.length; i++) 
    {
      process.stdout.write(this.writeClassDefinition(cl.classes[cl.classOrder[i]]));
    }

  };

  Compiler.prototype.writeExtendsFunction = function()
  {
    return ["Function.prototype.Extends = function(base)", 
            "{", 
            "  if(!base)", 
            "    debugger;", 
            "  for (var name in base.prototype)", 
            "  {", 
            "    if (this.prototype[name]) //if the method exists, declare it as a super method" +this.end_of_line + 
            "      this.prototype[base.name + \"$\" + name] = base.prototype[name];" +this.end_of_line + 
            "    else //if the method does not exist, declare it as regular", 
            "      this.prototype[name] = base.prototype[name];", 
            "  }", 
            "} "].join(this.end_of_line) ;
  };

  Compiler.prototype.writeNamespaces = function (obj, isroot) 
  {
    var str = "";
    for(var name in obj)
    {
      if(isroot)
        str += "var " + name +" = {" + this.writeNamespaces(obj[name])+ "}; ";
      else
        str += name +": {" + this.writeNamespaces(obj[name])+ "},";
    }

    return str.substring(0, str.length - 1);
  }

  Compiler.prototype.writeClassDefinition = function(c)
  {
    var str = "";
    str += "// " + c.getName() + this.end_of_line;
    str += "if (typeof " + c.getName() + " == 'undefined')" + this.end_of_line;
    str += c.getName() + " = (function()" + this.end_of_line;
    str += "{" + this.double_end_of_line;

    for(var namespaceURI in c.dependencies)
      str += "  var " + this.classloader.classes[namespaceURI].getClassName() + " = " + namespaceURI + ";"+ this.end_of_line;
    
    if(c.hasDependencies())
      str += this.end_of_line;

    str += "  var " + c.getClassName() + " = " + c.constr.method + this.double_end_of_line;

    var prototypestr = "  " + c.getClassName() + ".prototype.";
    var staticstr = "  " + c.getClassName() + ".";
    str +=  prototypestr+ c.getClassName() + " = " + c.getClassName() + ";" + this.double_end_of_line;

    for (var i = 0; i < c.methods.length; i++) 
    {
      var method = c.methods[i];
      if(!method.name) //anonymous functions
        str += "  (" + method.method + ")();" + this.double_end_of_line;
      else if(method.flag == this.classloader.Static) // static methods
        str += staticstr + method.name + " = " + method.method + ";" + this.double_end_of_line;
      else
        str += prototypestr + method.name + " = " + method.method + ";" + this.double_end_of_line;
    }
      
    str += "  return " + c.getClassName() + ";" + this.double_end_of_line + "})();" + this.double_end_of_line;
    return str;
  };

  return Compiler;
})();


var compiler = new Compiler(sourcePath, filelist);

// globally register functions called in source , and route them to the Classloader
Package     = function () {compiler.classloader.Package.apply(compiler.classloader, arguments)};
Extends     = function () {compiler.classloader.Extends.apply(compiler.classloader, arguments)};
Import      = function () {compiler.classloader.Import.apply(compiler.classloader, arguments)};
Class       = function () {compiler.classloader.Class.apply(compiler.classloader, arguments)};
Singleton   = function () {compiler.classloader.Singleton.apply(compiler.classloader, arguments)};
XMLResource = function () {compiler.classloader.XMLResource.apply(compiler.classloader, arguments)};
CSSResource = function () {compiler.classloader.CSSResource.apply(compiler.classloader, arguments)};

// flags
Static      = compiler.classloader.Static;
Public      = compiler.classloader.Public;
Protected   = compiler.classloader.Protected;

compiler.compile();
compiler.output();
