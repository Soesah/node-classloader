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
    this.EOF = "\n";
    this.D_EOF = "\n\n";

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
    return sources.join(this.EOF);
  };

  Compiler.prototype.compile = function ()  
  {
    eval(this.sourceCode);

    this.classloader.resolveDependencies();
  };

  Compiler.prototype.output = function() 
  {

    var cl = this.classloader;
    process.stdout.write("// Node Classloader Version " + cl.version + this.D_EOF);
    process.stdout.write(this.writeExtendsFunction() + this.D_EOF);
    process.stdout.write(this.writeNamespaces(cl.namespaces, true) + this.D_EOF);

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
            "    if (this.prototype[name]) //if the method exists, declare it as a super method" +this.EOF + 
            "      this.prototype[base.name + \"$\" + name] = base.prototype[name];" +this.EOF + 
            "    else //if the method does not exist, declare it as regular", 
            "      this.prototype[name] = base.prototype[name];", 
            "  }", 
            "} "].join(this.EOF) ;
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
    str += "// " + c.getName() + this.EOF;
    str += "if (typeof " + c.getName() + " == 'undefined')" + this.EOF;
    str += c.getName() + " = (function()" + this.EOF;
    str += "{" + this.D_EOF;

    for(var namespaceURI in c.dependencies)
      str += "  var " + this.classloader.classes[namespaceURI].getClassName() + " = " + namespaceURI + ";"+ this.EOF;
    
    if(c.hasDependencies())
      str += this.EOF;

    str += "  var " + c.getClassName() + " = " + c.constr.method + this.D_EOF;

    var prototypestr = "  " + c.getClassName() + ".prototype.";
    var staticstr = "  " + c.getClassName() + ".";
    str +=  prototypestr+ c.getClassName() + " = " + c.getClassName() + ";" + this.D_EOF;

    for (var i = 0; i < c.methods.length; i++) 
    {
      var method = c.methods[i];
      if(!method.name) //anonymous functions
        str += "  (" + method.method + ")();" + this.D_EOF;
      else if(method.flag == this.classloader.Static) // static methods
        str += staticstr + method.name + " = " + method.method + ";" + this.D_EOF;
      else
        str += prototypestr + method.name + " = " + method.method + ";" + this.D_EOF;
    }
    if(c.extends)  
      str += "  " + c.getClassName() + ".Extends(" + c.extends +");" + this.D_EOF;

    for (var i = 0; i < c.resources.length; i++)
      str += "  " + c.getClassName() + "." + c.resources[i].type + " = \"" + this.addSlashes(c.resources[i].getContents().replace(/\r|\n/g, "")) + "\";" + this.D_EOF;

    str += "  if (!" + c.getClassName() + ".name) " + c.getClassName() + ".name = '" +c.getClassName()+ "';" + this.D_EOF;

    if(c.singleton)
      str += "  return new " + c.getClassName() + "();" + this.D_EOF + "})();" + this.D_EOF;
    else
      str += "  return " + c.getClassName() + ";" + this.D_EOF + "})();" + this.D_EOF;
    return str;
  };

  Compiler.prototype.addSlashes = function (str) 
  {
    return (str+'').replace(/([\\"'])/g, "\\$1").replace(/\0/g, "\\0");
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
