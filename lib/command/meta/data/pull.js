#!/usr/bin/env node
'use strict'
const Command = require('../../Command')
class DataPull extends Command{    
    constructor(name,lfot){
        super(name || 'meta/data/pull',lfot)
        
    }
    run(args){
        this.log.it('[!] No I am not pulling your leg!')
    }
}
module.exports = DataPull