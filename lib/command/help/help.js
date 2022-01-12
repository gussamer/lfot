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
      this.child.exec(this.childCommand,() => {})
    }
}
module.exports = Help