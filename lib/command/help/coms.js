#!/usr/bin/env node
'use strict'
const Command = require('../Command')
class Coms extends Command{    
    constructor(name,settings){
        super(name || 'help/coms',settings)
    }
    run(args){
        //todo: iterate all lfot comms
    }
}
module.exports = Coms