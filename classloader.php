<?php 


Class ClassLoader
{
  function __construct($path, $package)
  {
    $this->path = $path;
    $this->package = $package;

    $this->nodepath = "";
    if(PHP_OS == "Darwin") // Mac OS Apache can't find node without full path
      $this->nodepath = "/usr/local/bin/";

    $this->nodeClassloader();
  }

  private function nodeClassloader()
  {
    system($this->nodepath."node Compiler.js ".$this->path." 2>&1");
  }

}

$package = (isset($_GET["package"]))?$_GET["package"]:"com";

header("Content-type:application/x-javascript ; charset=utf-8");
header("Content-type: text/javascript");
header("Content-Encoding: gzip");

ob_start('ob_gzhandler') ;

$cl = new ClassLoader("source", $package);

?>