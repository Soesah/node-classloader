/*
 *  Node Classloader Compiler
 */

var source = "./concat.js";
var sourcePath = "source";

var Compiler = (function(){
  
  var Classloader = require('./Classloader.js');

  var Compiler = function Compiler()
  {
    this.classloader = new Classloader(sourcePath);

    this.classloader.resolveDependencies();
  }

  Compiler.prototype.Compiler = Compiler;

  Compiler.prototype.compile = function ()  {
    var code = require(source).code;

    code();
  }

  Compiler.prototype.writeNamespaces = function writeNamespaces(namespaces, isroot) 
  {
    var str = "";
    for(var name in namespaces)
    {
      if(isroot)
        str += "var " + name +" = {" + writeNamespaces(namespaces[name])+ "}; ";
      else
        str += name +": {" + writeNamespaces(namespaces[name])+ "},";
    }

    return str.substring(0, str.length - 1);
  }

  return Compiler;
})();


var compiler = new Compiler();

// register function called in concatenated source as globals, and route them to the right object in the right way
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
