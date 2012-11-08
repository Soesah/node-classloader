<?php 


Class ClassLoader
{
  function __construct($path, $package)
  {
    $this->tempfile = "filelist.js";
    $this->path = $path;
    $this->package = $package;

    // get a file list
    $this->getFileList();

    // save file list
    $this->saveFileList();

    // get node to concatenate this
    $this->nodeConcatenator();

    // get node to compile it

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
    $filelist = $this->tempfile;
    $fh = fopen($filelist, 'w') or die("can't open file");
    fwrite($fh, "var filelist = [\n");
    foreach ($this->sources as $file) 
    {
      fwrite($fh, "'".$file."'\n");
      if($file != $this->sources[count($this->sources)-1])
        fwrite($fh, ",");
    }
    fwrite($fh, "];\n");
    fclose($fh);    
  }

  private function nodeConcatenator()
  {
    $val = "";
    $line = passthru("node Concatentor.js &", $val);
    print_r($line);
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
    unlink($this->tempfile);
  }
}

$package = (isset($_GET["package"]))?$_GET["package"]:"com";

$cl = new ClassLoader("source\\", $package);

$cl->output();

?>