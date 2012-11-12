

var Class = (function(){
  

  var Class = function Class(namespaceURI)
  { 
    this.namespaceURI = namespaceURI;

    this.imports = [];
    this.extend = null;
    this.dependencies = [];
    this.methods = [];
    this.flag = null;
  } 

  Class.prototype.Class = Class;

  Class.prototype.getName = function()
  {
    return this.namespaceURI + "." +  this.constr.name;
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

  Class.prototype.setResource = function(name, resource) 
  {
    this[name] = resource;
  };

  Class.prototype.addDependency = function(className) 
  {
    this.dependencies.push(className);
  };

  Class.prototype.hasUnresolvedDependencies = function(resolved_classes)
  {

  }

  return Class;
})();

module.exports = Class;