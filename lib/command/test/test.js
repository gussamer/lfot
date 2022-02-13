#!/usr/bin/env node
'use strict'
const Command = require('../Command')
class Test extends Command{    
    constructor(name,settings){
        super('test')
    }
    run(args){
        this.log.it('[+] Testing! Doing done did a test!')
    }
}
module.exports = Test