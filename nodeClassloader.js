/*
 *  Node Class Loader
 */

module.exports = {

  // register the package
  Package: function(str)
  {
    console.log(str);
  },

  // import other classes
  Import: function()
  {
    console.log(arguments);
  },

  // extends other classes
  Extends: function()
  {
    console.log(arguments);
  },

  // setup a class
  Class: function () 
  {
    console.log(arguments);
  },

  Singleton: function () 
  {
    console.log(arguments);
  },


  CSSResource: function () 
  {
    console.log(arguments);
  },

  XMLResource: function () 
  {
    console.log(arguments);
  },

  Static: function(){}

}