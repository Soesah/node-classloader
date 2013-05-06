
import os
import sys
import subprocess

class Classloader():
  """Python implementation of server script to run the node classloader"""
  def __init__(self, path, package, classloaderpath=""):
    if package == None:
      raise Exception("Classloader Error: no package found")

    self.path = path
    self.package = package
  
    self.classloaderpath = classloaderpath

    self.nodepath = ""
    if sys.platform == "darwin": # Mac OS Apache can't find node without full path
      self.nodepath = "/usr/local/bin/"

  def nodeClassloader(self):
    command = [self.nodepath+"node", self.classloaderpath + "Classloader.js", self.path,self.package]
    process = subprocess.Popen(command, stdout=subprocess.PIPE)
    script = process.stdout.read().decode("utf-8") 
    return script

if __name__ == "__main__":
  path = "../source"
  package = None

  if len(sys.argv) > 1:
    package = sys.argv[1];

  try:
    classloader = Classloader(path, package)
    print classloader.nodeClassloader()
  except Exception, e:
    print "console.log('"+e.message+"');"