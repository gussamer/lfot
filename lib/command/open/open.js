#!/usr/bin/env node
'use strict'
const Command = require('../Command')
const exec = require('child_process').exec
module.exports = class Open extends Command{    
    constructor(name,lfot){
        super(name || 'open',lfot)
        this.openCommand = 'sf force org open'
    }
    run(args = []){
        this.log.it('[!] open your mind!')
        let comm = this.openCommand
        comm = this.openCommand
        comm = comm+' '+args.join(' ')
        exec(comm,() => {
          this.log.it('[!] open says me!')
        })
    }
}