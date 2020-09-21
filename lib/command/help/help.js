#!/usr/bin/env node
'use strict'
const Command = require('../Command')
class Help extends Command{    
    constructor(){
        super('help')
        this.marked = require('marked')
        this.TerminalRenderer = require('marked-terminal')
        this.fs = require('fs')
        this.marked.setOptions({
            renderer: new this.TerminalRenderer()
        })
    }
    doCommand(args){
        console.log(
            this.marked(
                this.fs.readFileSync(__dirname.replace('lib\\command\\help','')+'README.md').toString()
            )
        )
    }
}
module.exports = Help