# Node ClassLoader

This is a Javascript classloader that converts easy to read (and valid) Javascript in functioning and executable Javascript.

The classloader uses a php script to do 2 things:
- use glob to get all the source files into a list of files
- output the compiled code as Javascript to the browser. I didn't feel like using a NodeJS server for that.

The php calls does a command line call to NodeJS to run the Compiler.

The Compiler manages the writing, and uses the real Classloader to parse the original Javascript. A class looks something like this:

## Example source code

> Package("com.namespace.package")
> 
> Import("com.namespace.object.Object");
> 
> Extends("com.namespace.box.Box");
>
> Class
> (
>  
>   function Package()
>   {
>     this.Box();  
>   }
>
>   function method()
>   {
>     this.Box.stuff(new Object);  
>   }
>
> )

The classloader supports Class or Singleton, Importing and Extending other classes, and the Static flag for a method:

> Static, function wrap()
> {
>  
> }

## Example output

> if(typeof com.namespace.package.Package == undefined)
> com.namespace.package.Package = (function(){
> 
>   var Object = com.namespace.object.Object;
>   var Box = com.namespace.box.Box;
> 
>   var Package = function Package()
>   {
>     this.Box()
>   }
>
>   Package.prototype.Package = Package;
>
>   Package.prototype.method = function method()
>   {
>     this.Box.stuff(new Object);  
>   }
>
>   Package.Extends(com.namespace.box.Box);
>
>   return Box;
>
> })();


TODO
- make it capable of getting a root package, to do unit testing
- throw more errors when you write improper classes
- set up unit testing of a sort.