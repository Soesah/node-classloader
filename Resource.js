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

  Resource.prototype.getContents = function() 
  {
    return FileSystem.readFileSync(this.path, this.encoding);
  };

  return Resource;
})();

module.exports = Resource;