/*
 *  Very simple Glob to a list of files of a particular inclination.
 */

var Glob = (function(){

  var FileSystem = require("fs");

  var Glob = function Glob(dir, ext)
  {
    this.dir = dir;
    this.ext = ext;
    this.list = [];

    this.read(this.dir);
  }

  Glob.prototype.Glob = Glob;

  Glob.prototype.getList = function() 
  {
    return this.list;
  };

  Glob.prototype.read = function(path) 
  {
    var list = FileSystem.readdirSync(path);

    for (var i = 0; i < list.length; i++) 
    {
      var obj = list[i];
      var objPath = this.getPath(path, obj);
      var objStats = FileSystem.statSync(objPath);
      if(objStats.isDirectory())
        this.read(objPath)
      else if(this.ext && objPath.substr(objPath.lastIndexOf(".")) == this.ext)
        this.list.push(objPath);
      else if(this.ext === undefined)
        this.list.push(objPath);
    }
  };

  Glob.prototype.getPath = function() 
  {
    var args = [];
    for(var name in arguments)
      args.push(arguments[name]);
    return args.join("/");
  };

  return Glob;

})();

module.exports = Glob;