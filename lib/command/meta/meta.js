#!/usr/bin/env node
'use strict'
const Command = require('../Command')
class Meta extends Command{    
    constructor(){
        super('meta')
        
    }
    doCommand(args){
        console.log('[!] This is so meta!!\n[!] fest: build package.xml manifests\n[!] data: pull or push metadata')
    }
}
module.exports = Meta