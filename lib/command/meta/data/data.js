#!/usr/bin/env node
'use strict'
const Command = require('../../Command')
class Data extends Command{    
    constructor(){
        super('meta/data')
        
    }
    doCommand(args){
        console.log('[!] I do not understand this data!\n[!] pull: pull metadata from a org\n[!] push: push metadata to a org')
    }
}
module.exports = Data