#!/usr/bin/env node
'use strict'
const Command = require('../../Command')
class DataPull extends Command{    
    constructor(){
        super('meta/data/pull')
        
    }
    doCommand(args){
        console.log('[!] No I am not pulling your leg!')
    }
}
module.exports = DataPull