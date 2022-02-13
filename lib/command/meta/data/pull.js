#!/usr/bin/env node
'use strict'
const Command = require('../../Command')
class DataPull extends Command{    
    constructor(name,settings){
        super(name || 'meta/data/pull',setting)
        
    }
    run(args){
        this.log.it('[!] No I am not pulling your leg!')
    }
}
module.exports = DataPull