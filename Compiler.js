
var encoding = "utf-8";
var end_of_line = "\n";

var outfile = "./concat.js";

var Compiler = (function(){
  
  var Classloader = require('./Classloader.js');

  var Compiler = function Compiler()
  {
    this.classloader = new Classloader();
  }

  Compiler.prototype.Compiler = Compiler;

  Compiler.prototype.compile = function compile()
  {
    var code = require(outfile).code;

    var cc = this.classloader;

    // register function called in concatenated source as globals, and route them to the right object in the right way
    Package     = function () {cc.Package.apply(cc, arguments)};
    Extends     = function () {cc.Extends.apply(cc, arguments)};
    Import      = function () {cc.Import.apply(cc, arguments)};
    Class       = function () {cc.Class.apply(cc, arguments)};
    Singleton   = function () {cc.Singleton.apply(cc, arguments)};
    Static      = function () {cc.Static.apply(cc, arguments)};
    XMLResource = function () {cc.XMLResource.apply(cc, arguments)};
    CSSResource = function () {cc.CSSResource.apply(cc, arguments)};

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

compiler.compile();
console.log(compiler.classloader.classList)

