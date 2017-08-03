<?php 

Class Classloader
{
  function __construct($path, $package)
  {
    $this->path = $path;
    $this->package = $package;

    $this->nodepath = "";
    if(PHP_OS == "Darwin") // Mac OS Apache can't find node without full path
      $this->nodepath = "/Users/Carl/local/bin/";

    system($this->nodepath."node Classloader.js ".$this->path." ".$this->package." 2>&1");
  }
}

header("Content-type: text/javascript; charset=utf-8");

header("Content-Encoding: gzip");
ob_start('ob_gzhandler') ;

$package = str_replace('_', '.', key($_GET));

if ($package == "")
{
  echo "console.error('Classloader Error: no package found');";
  die();
}
new Classloader("../src", $package);

?>