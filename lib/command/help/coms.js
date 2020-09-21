#!/usr/bin/env node
'use strict'
const Command = require('../Command')
class Coms extends Command{    
    constructor(){
        super('help/coms')
    }
    doCommand(args){
        //todo: iterate all lfot comms
    }
}
module.exports = Coms