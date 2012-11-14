/*
 *  Node Classloader Resource
 */

var Resource = (function(){
  
  var FileSystem = require("fs");

  var Resource = function Resource(type, path)
  { 
    this.type = type;
    this.path = path;

    console.log(type, path)
  } 

  Resource.prototype.Resource = Resource;

  Resource.prototype.getContents = function() 
  {
    var string;
  };

  return Resource;
})();

module.exports = Resource;