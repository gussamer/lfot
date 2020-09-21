#!/usr/bin/env node
'use strict'
const Command = require('../Command')
class Test extends Command{    
    constructor(){
        super('test')
    }
    doCommand(args){
        console.log('[+] Testing! Doing done did a test!')
    }
}
module.exports = Test