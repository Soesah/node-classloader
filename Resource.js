/*
 *  Node Classloader Resource
 */

var Resource = (function(){
  
  var FileSystem = require("fs");

  var Resource = function Resource(type, path)
  { 
    this.encoding = "utf-8";
    this.type = type;
    this.path = path;
  } 

  Resource.prototype.Resource = Resource;

  Resource.prototype.getContents = function () 
  {
    return this.oneLine(this.addSlashes(FileSystem.readFileSync(this.path, this.encoding)));
  };

  Resource.prototype.oneLine = function (str)
  {
    return str.replace(/\r|\n/g, "");
  };

  Resource.prototype.addSlashes = function (str) 
  {
    return (str+'').replace(/([\\"'])/g, "\\$1").replace(/\0/g, "\\0");
  };

  return Resource;
})();

module.exports = Resource;