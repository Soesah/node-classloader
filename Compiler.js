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

    this.classloader = new Classloader(sourcePath);
    this.sourceCode = this.concatenate(filelist)

    this.classloader.resolveDependencies();
  }

  Compiler.prototype.Compiler = Compiler;

  Compiler.prototype.concatenate = function(filelist)
  {
    var encoding = "utf-8";
    var end_of_line = "\n";

    var sources = filelist.map(function(file){
            return FileSystem.readFileSync(file, encoding);
          });
    return sources.join(end_of_line);
  };

  Compiler.prototype.compile = function ()  
  {
    eval(this.sourceCode);
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
