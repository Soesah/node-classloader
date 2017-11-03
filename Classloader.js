/*
 *  Node Classloader
 */

var sourcePath = process.argv[2];
var package = process.argv[3];

var Classloader = (function(){

  var Glob = require('./Glob.js');
  var FileSystem = require('fs');
  var ClassObject = require("./Class.js");
  var config = require("./config.js");

  var Classloader = function Classloader(sourcePath, package) {
    this.version = "1.44";
    this.debug = false;

    if (sourcePath == undefined || package == undefined) {
      throw new Error("Classloader requires a source folder and package name");
    }

    if (!FileSystem.existsSync(sourcePath)) {
      throw new Error("Source path could not be opened");
    }

    if (!FileSystem.existsSync(sourcePath + "/" + package.replace(/\./g, "/") + ".js")) {
      throw new Error("Package name is not a fully qualified package");
    }

    this.sourcePath = sourcePath;
    this.package = package;

    this.classes = {};
    this.ordered_classes = [];

    this.encoding = "utf-8";
    this.EOF = "\n";
    this.D_EOF = "\n\n";

    this.filelist = new Glob(this.sourcePath, ".js").getList();

    
    // use file name as classname
    // get imports as dependencies
    // write out contents without imports in order based on dependencies

    if (this.filelist.length == 0) {
      throw new Error("Found no files to compile");
    }

    this.getClasses();
    this.compile();
    this.writeOutput();
  };

  Classloader.prototype.Classloader = Classloader;


  Classloader.prototype.getClasses = function() {
    var _this = this;

    this.filelist.forEach(function(file) {
        var name = file.replace(_this.sourcePath + '/', '').replace('.js', ''),
            c = new ClassObject(name, FileSystem.readFileSync(file, this.encoding));

        if (_this.debug) {
          c.removeComments();
        }

        _this.classes[name] = c  ;
    });

  };

  Classloader.prototype.parseShims = function () {
    var _this = this;

    config.shims.forEach(function(shim) {
      _this.classes[shim.source] = {
        source: shim.source,
        isResolved: function() {return true;},
        getDependencies: function() {return [];},
        getUnresolvedDependencies: function() {return [];},
        output: function() {return ''}
      }
    });
  };

  Classloader.prototype.compile = function () {

    this.parseShims();

    // update dependencies and parents
    for (var name in this.classes) {
      var c = this.classes[name],
          dependencies = c.getDependencies();
      
      for (var dependency in dependencies) {
        var obj = this.classes[dependency];

        if (!obj) {
          throw new Error("Dependency " + dependency + " not found for Class " + name);
        }

        // update the dependency with the full class object
        c.updateDependency(dependency, obj);
      }
    }

    this.resolveOrder(this.package);
  };

  Classloader.prototype.resolveOrder = function (name) {
    var c = this.classes[name];

    if (!c) {
      throw new Error("Class " + name + " not found");
    }

    for (var name in c.getUnresolvedDependencies()) {
      this.resolveOrder(name);
    }

    if (!c.isResolved())
    {
      this.ordered_classes.push(c);
      c.setResolved();
    }
  }

  Classloader.prototype.getUnresolvedClasses = function () {
    var classes = {};
    for(var name in this.classes) {
      if (!this.classes[name].isResolved()) {
        classes[name] = this.classes[name];    
      }
    }
    if (Object.keys(classes).length != 0) {
      return classes;
    } else {
      return false;
    }
  };

  Classloader.prototype.writeOutput = function() {
    process.stdout.write("\"use strict\";\n");
    process.stdout.write("// " + this.package + " - Node Classloader Version " + this.version + this.D_EOF);


    process.stdout.write("new class {\n");
    process.stdout.write("constructor() {\n");
      for (var i = 0; i < this.ordered_classes.length; i++) {
        process.stdout.write(this.ordered_classes[i].output() + '\n');
      }
    process.stdout.write("}\n};\n");
  };

  return Classloader;
})();

try
{
  new Classloader(sourcePath, package);
}
catch (e)
{
  var message = (e.stack != undefined)?e.stack.replace(/\n/g,'\\n'):e.message;
  process.stdout.write("console.error(\"Classloader " + message + "\");");
}