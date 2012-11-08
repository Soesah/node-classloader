<?php 


Class ClassLoader
{
  function __construct($path, $package)
  {
    $this->tempfiles = array("filelist.js", "concat.js");
    $this->path = $path;
    $this->package = $package;

    // get a file list
    $this->getFileList();

    // save file list
    $this->saveFileList();

    // get node to concatenate this
    $this->nodeConcatenateCode();

    // get node to compile it
    $this->nodeCompileCode()

    // get node to minify it

    // write it out

    // clean up
    // $this->cleanup();

  }

  private function getFileList()
  {
    $this->sources = $this->glob_deep("*.js", $this->path);
  }

  private function saveFileList()
  {
    $filelist = $this->tempfiles[0];
    $fh = fopen($filelist, 'w') or die("can't open file");
    fwrite($fh, "module.exports.filelist = [\n");
    foreach ($this->sources as $file) 
    {
      if($file != $this->sources[0])
      fwrite($fh, ",");
      fwrite($fh, "'".str_replace("\\", "/", $file)."'\n");
    }
    fwrite($fh, "];\n");
    fclose($fh);    
  }

  private function nodeConcatenateCode()
  {
    system("node Concatenator.js");
  }

  private function nodeCompileCode()
  {
    system("node Compile.js");
  }

  public function output()
  {

  }

  private function glob_deep($pattern = '*', $path, $flags = 0)
  {
    $dirs = glob($path.'*', GLOB_MARK | GLOB_ONLYDIR | GLOB_NOSORT);
    $files = glob($path.$pattern, $flags);

    foreach($dirs as $dir)
      $files = array_merge($files, $this->glob_deep($pattern, $dir, $flags));

    return $files;
  }

  private function cleanup()
  {
    foreach ($this->tempfiles as $file) 
      unlink($file);
  }
}

$package = (isset($_GET["package"]))?$_GET["package"]:"com";

$cl = new ClassLoader("source\\", $package);

$cl->output();

?>