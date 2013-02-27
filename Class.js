/*
 *  Node Classloader Class
 */

var Class = (function(){
  
  var Resource = require("./Resource.js");

  var Class = function Class(namespaceURI)
  { 
    this.name;
    this.namespaceURI = namespaceURI;

    this.resources = [];
    this.dependencies = {};
    this.dependencyCount = 0;
    this.imports = [];
    this.extends = [];
    this.methods = [];
    this.properties = {};

    this.flag = null;
    this.resolved = false;
  } 

  Class.prototype.Class = Class;

  Class.prototype.getClassName = function()
  {
    return this.name;
  };

  Class.prototype.getName = function()
  {
    return this.namespaceURI + "." +  this.name;
  };

  Class.prototype.setProperty = function(name, value)
  {
    this.properties[name] = value;
  }

  Class.prototype.getProperty = function(name)
  {
    var propValue = this.properties[name];
    return this.writeValue(propValue);
  }

  Class.prototype.writeValue = function(value)
  {
    if (typeof value == "string") // escape strings
      return "\"" + value + "\"";
    else if (typeof value == "object" && !this.isArray(value) && !this.isRegExp(value)) // regular expressions type as objects
      return this.writeObject(value);
    else if (this.isArray(value))
      return this.writeArray(value);
    else
      return value; // anything else for now, just output it.
  }
  
  Class.prototype.writeArray = function (value) 
  {
    var str = "[";

    var parts = [];
    for (var name in value)
      parts.push(this.writeValue(value[name]));

    str += parts.join(",") +"]";
    return str;
  }

  Class.prototype.writeObject = function (value) 
  {
    var str = "\n  {";

    var parts = [];
    for (var name in value)
      parts.push("\n    " + name + ":" + this.writeValue(value[name]));


    str += parts.join(",") +"\n  }";
    return str;
  }

  Class.prototype.isArray = function (obj) 
  {
    return Object.prototype.toString.call(obj).indexOf("Array") != -1;
  }

  Class.prototype.isRegExp = function (obj) 
  {
    return Object.prototype.toString.call(obj).indexOf("RegExp") != -1;
  }

  Class.prototype.getProperties = function()
  {
    return this.properties;
  }

  Class.prototype.hasProperties = function()
  {
    return !this.isEmpty(this.properties);
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

  Class.prototype.addExtends = function(className) 
  {
    this.extends.push(className);
    this.addDependency(className);
  };

  Class.prototype.addResource = function(type, sourcePath, file) 
  {
    var path = sourcePath + "/" + this.namespaceURI.replace(/\./g,'/') + "/"+ file;
    this.resources.push(new Resource(type, path));
  };

  Class.prototype.addDependency = function(className, classObject) 
  {
    this.dependencies[className] = (classObject)?classObject:true;
    if (classObject)
      this.dependencyCount += 1;
  };

  Class.prototype.hasDependencies = function()
  {
    return !this.isEmpty(this.dependencies);
  };

  Class.prototype.getDependencies = function()
  {
    return this.dependencies;
  };

  Class.prototype.getDependencyCount = function()
  {
    return this.dependencyCount;
  };

  Class.prototype.getUnresolvedDependencies = function()
  {
    var obj = {};
    for (var namespaceURI in this.dependencies)
      if (!this.dependencies[namespaceURI].isResolved())
        obj[namespaceURI] = this.dependencies[namespaceURI];
    return obj;
  };

  Class.prototype.isEmpty = function(obj) 
  {
    if(Object.keys(obj).length == 0)
      return true;
    else
      return false;
  };

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