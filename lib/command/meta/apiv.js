#!/usr/bin/env node
'use strict'
const Command = require('../Command')
class MetaDataAPIVersion extends Command{    
    constructor(){
        super('meta/apiv')        
    }
    doCommand(args){
        console.log('[!] I just can not keep up with this!')
        require('child_process').execSync('ls ..')
    }
}
module.exports = MetaDataAPIVersion