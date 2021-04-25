#!/usr/bin/env node
'use strict'
const Command = require('../Command')
class Fest extends Command{    
    constructor(){
        super('meta/fest')
        
    }
    doCommand(args){
        console.log('[!] There is a party in my xml and everyone is invited!')
    }
}
module.exports = Fest