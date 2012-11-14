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

    this.classloader.resolveDependencies();
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
  }

  Compiler.prototype.output = function() 
  {
    process.stdout.write("// Node Classloader Version " + this.classloader.version + this.end_of_line + this.end_of_line);
    process.stdout.write(this.classloader.writeNamespaces(this.classloader.namespaces, true));
    // process.stdout.write(this.sourceCode);
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
