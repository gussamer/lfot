#!/usr/bin/env node
'use strict'
const Command = require('../../Command')
class Data extends Command{    
    constructor(name,lfot){
        super(name || 'meta/data',lfot)
        
    }
    run(args){
        this.log.it('[!] I do not understand this data!\n[!] pull: pull metadata from a org\n[!] push: push metadata to a org')
    }
}
module.exports = Data