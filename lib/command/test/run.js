#!/usr/bin/env node
'use strict'
const Command = require('../Command')
class Run extends Command{    
    constructor(){
        super('test/run')
    }
    doCommand(args){
        console.log(args)
    }
}
module.exports = Run