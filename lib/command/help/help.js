#!/usr/bin/env node
'use strict'
const Command = require('../Command')
class Help extends Command{    
    constructor(){
        super('help')
        this.child = require('child_process')
        this.childCommand = 'start etc/help.html'
    }
    doCommand(args){
      console.log('[!] Opening help in your web browser!')
      this.child.exec(this.childCommand,() => {})
    }
}
module.exports = Help