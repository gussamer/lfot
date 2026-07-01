#!/usr/bin/env node
'use strict'
const Command = require('../Command')
class Test extends Command{    
    constructor(name,lfot){
        super('test',lfot)
    }
    run(args){
        this.log.it('[+] Testing! Doing done did a test!')
    }
}
module.exports = Test