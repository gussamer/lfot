#!/usr/bin/env node
'use strict'
const Command = require('../Command')
const child = require('child_process')
const os = require('os')
class Help extends Command{    
    constructor(){
        super('help')
        this.installLocCommand = 'npm root -g'
        this.childCommandPrefix = this.getOpenCommandPrefix() || 'start '
    }
    getOpenCommandPrefix(){
      let osType = os.type()
      if(osType=='Windows_NT'){
        return 'start '
      }else if(osType=='Darwin'){
        return 'open '
      }else{
        return 'xdg-open '
      }
    }
    doCommand(args){
      console.log('[!] Opening help in your web browser!')
      child.exec(this.installLocCommand,(error,stdout,stderr) => {
        if(error||stderr){
          console.log('[-] oh no the help needs help!');
          console.log('[-] describe error: ');
          console.log(error);
          console.log('[-] describe stderr: ');
          console.log(stderr);
        }
        let childCommand = this.childCommandPrefix+stdout.replace('\n','')+'\\lfot\\etc\\help.html'
        child.execSync(childCommand)
      })
    }
}
module.exports = Help