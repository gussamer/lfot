#!/usr/bin/env node
'use strict'
const Command = require('../../Command')
class DataPush extends Command{    
    constructor(){
        super('meta/data/push')
        
    }
    doCommand(args){
        console.log('[!] Did you just do that in Production?!')
    }
}
module.exports = DataPush