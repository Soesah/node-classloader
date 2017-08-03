# Vue - Node ClassLoader

This is a simple classloader that concats Vue classes with import statements to a single file with all the classes in the correct order.

## Configuration

<code>classloader.php</code> contains two variables, path and main file. Path is configured in classloader and refers to the source directory that the Classloader will scan for classes. The default for this is '<i>source</i>' The main file is the start of processing.


Use `config.js` to define shims, to keep imports consistent.
    

    module.exports = {
      shims: [{
        'name': 'Vue',
        'source': 'Vue'
      },...
