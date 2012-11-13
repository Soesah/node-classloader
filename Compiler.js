
var encoding = "utf-8";
var end_of_line = "\n";

var outfile = "./concat.js";

var Compiler = (function(){
  
  var Classloader = require('./Classloader.js');

  var Compiler = function Compiler()
  {
    this.classloader = new Classloader();

    this.compile();

    this.classloader.resolveDependencies();
  }

  Compiler.prototype.Compiler = Compiler;

  Compiler.prototype.compile = function ()
  {
    var code = require(outfile).code;

    // register function called in concatenated source as globals, and route them to the right object in the right way
    Package     = function () {this.classloader.Package.apply(this.classloader, arguments)};
    Extends     = function () {this.classloader.Extends.apply(this.classloader, arguments)};
    Import      = function () {this.classloader.Import.apply(this.classloader, arguments)};
    Class       = function () {this.classloader.Class.apply(this.classloader, arguments)};
    Singleton   = function () {this.classloader.Singleton.apply(this.classloader, arguments)};
    XMLResource = function () {this.classloader.XMLResource.apply(this.classloader, arguments)};
    CSSResource = function () {this.classloader.CSSResource.apply(this.classloader, arguments)};

    // flags
    Static      = this.classloader.Static;
    Public      = this.classloader.Public;
    Protected   = this.classloader.Protected;

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
  };

  return Compiler;
})();


var compiler = new Compiler();

