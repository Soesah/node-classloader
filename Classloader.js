/*
 *  Node Class Loader
 */

var ClassLoader = (function(){

  var ClassLoader = function ClassLoader()
  {
  };

  ClassLoader.prototype.ClassLoader = ClassLoader;

  // register the package
  ClassLoader.prototype.Package =  function Package(namespaceURI)
  {
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

  // import other classes
  ClassLoader.prototype.Import = function Import()
  {
    // console.log(arguments);
  };

  // extends other classes
  ClassLoader.prototype.Extends = function Extends()
  {
    // console.log(arguments);
  };

  // setup a class
  ClassLoader.prototype.Class = function Class () 
  {
    // console.log(arguments);
  };

  ClassLoader.prototype.Singleton = function Singleton () 
  {
    // console.log(arguments);
  };

  ClassLoader.prototype.CSSResource = function CSSResource () 
  {
    // console.log(arguments);
  };

  ClassLoader.prototype.XMLResource = function XMLResource () 
  {
    // console.log(arguments);
  };

  ClassLoader.prototype.namespaces = {};
  ClassLoader.prototype.Static = true;


  return ClassLoader;
})();

module.exports = ClassLoader;
