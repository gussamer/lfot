#!/usr/bin/env node
'use strict'
const Command = require('../Command')
const child = require('child_process')
const os = require('os')
const path = require('path')
class Help extends Command{    
    constructor(name,settings){
        super(name || 'help',settings)
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
    run(args){
      this.log.it('[!] Opening help in your web browser!')
      child.exec(this.installLocCommand,(error,stdout,stderr) => {
        if(error||stderr){
          this.log.it('[-] oh no the help needs help!');
          this.log.it('[-] describe error: ');
          this.log.it(error);
          this.log.it('[-] describe stderr: ');
          this.log.it(stderr);
        }
        let childCommand = path.join(this.childCommandPrefix,stdout.replace('\n',''),'lfot','etc','help.html').replace('\\','')
        child.execSync(childCommand)
      })
    }
}
module.exports = Help