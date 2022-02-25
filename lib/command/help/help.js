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
        this.browserHelp = typeof this.settings.browserHelp!=='undefined' ? this.settings.browserHelp : true
        this.childCommandPrefix = this.getOpenCommandPrefix() || 'start '
        this.childFileSuffix = this.getOpenFileSuffix() || 'html '
    }
    getOpenCommandPrefix(){
      let osType = os.type()
      if(this.browserHelp){
        if(osType=='Windows_NT'){
          return 'start '
        }else if(osType=='Darwin'){
          return 'open '
        }else{
          return 'xdg-open '
        }
      }else{
        return 'cat '
      }
    }
    getOpenFileSuffix(){
      if(this.browserHelp){
        return 'html'
      }else{
        return 'txt'
      }
    }
    handleHelpError(error,stderr){
      if(error||stderr){
        this.log.it('[-] oh no the help needs help!');
        this.log.it('[-] describe error: ');
        this.log.it(error);
        this.log.it('[-] describe stderr: ');
        this.log.it(stderr);
      }
    }
    run(args){
      this.log.it('[!] Opening help for you!')
      child.exec(this.installLocCommand,(error,stdout,stderr) => {
        this.handleHelpError(error,stderr)
        let cleanedOut = stdout.replace('\n','')
        let childCommand = path.join(
          this.childCommandPrefix,cleanedOut,'lfot','etc','help.'+this.childFileSuffix
        ).replace('\\','')
        child.exec(childCommand,(error,stdout,stderr)=>{
          this.handleHelpError(error,stderr)
          console.log(stdout)
        })
      })
    }
}
module.exports = Help