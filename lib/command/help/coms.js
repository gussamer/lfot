#!/usr/bin/env node
'use strict'
const Command = require('../Command')
class Coms extends Command{    
    constructor(name,lfot){
        super(name || 'help/coms',lfot)
    }
    run(args){
        //todo: iterate all lfot comms
    }
}
module.exports = Coms