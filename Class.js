/*
 *  Node Classloader Class
 */

var Class = (function(){
  
  var Resource = require("./Resource.js");

  var Class = function Class(namespaceURI)
  { 
    this.name;
    this.namespaceURI = namespaceURI;

    this.dependencies = {};
    this.imports = [];
    this.extend = null;
    this.methods = [];
    this.flag = null;
    this.resources = [];
    this.resolved = false;
  } 

  Class.prototype.Class = Class;

  Class.prototype.getName = function()
  {
    return this.namespaceURI + "." +  this.name;
  }

  Class.prototype.setSingleton = function() 
  {
    this.singleton = true;
  };
  Class.prototype.setFlag = function(flag) 
  {
    this.flag = flag;
  };

  Class.prototype.setConstructor = function(name, f) 
  {
    this.name = name;
    this.constr = {name: name, method: f};
  };

  Class.prototype.addMethod = function(name, f) 
  {
    var method = {name: name, method: f};
    if(this.flag)
      method.flag = this.flag;
    this.methods.push(method);
    this.setFlag(null);
  };

  Class.prototype.addImport = function(className) 
  {
    this.imports.push(className);
    this.addDependency(className);
  };

  Class.prototype.addExtend = function(className) 
  {
    this.extend = className;
    this.addDependency(className);
  };

  Class.prototype.addResource = function(type, sourcePath, file) 
  {
    var path = sourcePath + "/" + this.namespaceURI.replace(/\./g,'/') + "/"+ file;
    this.resources.push(new Resource(type, path));
  };

  Class.prototype.addDependency = function(className) 
  {
    this.dependencies[className] = true;
  };

  Class.prototype.hasUnresolvedDependencies = function(classes)
  {
    for(var namespaceURI in this.dependencies)
      if(!classes[namespaceURI].isResolved())
        return true;
     
    return false;
  }

  Class.prototype.setResolved = function() 
  {
    this.resolved = true;
  };

  Class.prototype.isResolved = function() 
  {
    return this.resolved;
  };

  return Class;
})();

module.exports = Class;