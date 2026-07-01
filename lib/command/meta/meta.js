#!/usr/bin/env node
'use strict'
const Command = require('../Command')
class Meta extends Command{    
    constructor(name,lfot){
        super(name || 'meta',lfot)
        
    }
    run(args){
        this.log.it('[!] This is so meta!!\n[!] fest: build package.xml manifests\n[!] data: pull or push metadata')
    }
}
module.exports = Meta