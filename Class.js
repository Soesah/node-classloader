/*
 *  Node Classloader Class
 */

var Class = (function(){
  
  var Class = function Class(name, source) {
    this.name = name;
    this.source = (source + '');
    this.lines = [];
    this.dependencies = {};
    this.resolved = false;

    this.parseLines();
  } 

  Class.prototype.Class = Class;

  Class.prototype.getClassName = function() {
    return this.name;
  };

  Class.prototype.parseLines = function() {
    var _this = this,
        source = this.source.split('\n');

    // filter empty lines and imports
    this.lines = source.filter(function(line, index) {
      if (line.substring(0, 6) === 'import') {
        _this.addDependency(line);
        return false;
      }
      return line !== '';
    });
  };

  Class.prototype.addDependency = function(line) {
    // strip everything before 'from'
    var stripped = line.substring(line.indexOf('from') + 5),
        dependency = stripped.replace(/[\'\;]/g, '').trim();

    this.dependencies[dependency] = true;
  };

  Class.prototype.updateDependency = function(name, obj) {
    this.dependencies[name] = obj;
  };

  Class.prototype.hasDependencies = function() {
    return !this.isEmpty(this.dependencies);
  };

  Class.prototype.getDependencies = function() {
    return this.dependencies;
  };

  Class.prototype.getUnresolvedDependencies = function() {
    var obj = {};
    for (var name in this.dependencies) {
      if (!this.dependencies[name]) {
        throw new Error(this.name + " cannot resolve dependency " + name);
      }
      if (!this.dependencies[name].isResolved()) {
        obj[name] = this.dependencies[name];
      }
    }
    return obj;
  };

  Class.prototype.removeComments = function (code) {
    this.lines = this.lines.map(function(line) {
      return line.replace(/((\s|$)\/\/.*)/g, "");
    });    
  };

  Class.prototype.output = function() {
    return this.lines.join('\n')
  };


  Class.prototype.setResolved = function() {
    this.resolved = true;
  };

  Class.prototype.isResolved = function() {
    return this.resolved;
  };

  return Class;
})();

module.exports = Class;