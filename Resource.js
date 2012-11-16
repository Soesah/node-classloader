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

    this.setContents();
  } 

  Resource.prototype.Resource = Resource;

  Resource.prototype.setContents = function() 
  {
    if(!FileSystem.existsSync(this.path))
      throw new Error(this.type + " could not be found on path '" + this.path + "'");
    this.contents = FileSystem.readFileSync(this.path, this.encoding);
  };

  Resource.prototype.getContents = function () 
  {
    return this.oneLine(this.addSlashes(this.contents));
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