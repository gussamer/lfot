#!/usr/bin/env node
'use strict'
const Command = require('../../Command')
class DataPush extends Command{    
    constructor(name,lfot){
        super(name || 'meta/data/push',lfot)
        
    }
    run(args){
        this.log.it('[!] Did you just do that in Production?!')
    }
}
module.exports = DataPush