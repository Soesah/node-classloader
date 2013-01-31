/*
 *  Node Classloader Tree manager
 */

var Tree = (function(){
  
  var Tree = function Tree()
  { 
    this.root = {};
  }

  Tree.prototype.Tree = Tree;

  Tree.prototype.addClass = function addClass(c)
  {
    var dependencies = c.getDependencies();

  }

  Tree.prototype.getOrder = function getOrder(c)
  {
    return this.walk();
  }

  Tree.prototype.walk = function walk(c)
  {
    var list = [];

    return list;
  }



  return Tree;
})();

module.exports = Tree;


/*

  class A
    extends B
    imports C, D

  class B
    extends E

  class C
    imports F, E

  class D

  class E

  class F
    extends B

  class G
    extends A

  class I



  Tree (no imports):

    root
      G
        A
          B
            E
      C
      F
        B
          E
      D
      E
      I
  Tree (with imports):

    root
      G
        A
          B
            E
          C
            E
            F
              B
                E
          D
      I
  Tree (flat & with imports):

    root
      A
        B
          E
          C
            E
            F
              B
                E
          D
      B
        E
      C
        E
        F
          B
            E
      D
      E
      F
        B
          E
      G
        A
          B
            E
          C
            E
            F
              B
                E
          D
      I

  so, walk over the tree, down first into the branch until you reach a leaf and return E, 
  then B, then A says it needs C, so run into C, down through F (E and B are done)
  You return F, C, D, then A, then G

  It doesn't actually matter who you walk down into first, as long as you walk down into everyone and reach everyone

  How do you build the tree
  - You read through the class alphabetically
  - Add them all to root 
  - branch to first dependencies
  - Then copy what you need, adding further dependencies
  - walk down, then over each branch, and on
  - this should take doubles into account


*/