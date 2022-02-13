#!/usr/bin/env node
'use strict'
const Command = require('../Command')
class Run extends Command{    
    constructor(name,settings){
        super('test/run')
    }
    run(args){
        this.log.it(args)
    }
}
module.exports = Run