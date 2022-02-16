#!/usr/bin/env node
'use strict'
const Command = require('../Command')
class MetaDataAPIVersion extends Command{    
    constructor(name,settings){
        super(name || 'meta/apiv',settings)
        this.child = require('child_process')
        this.sfdxCommand = 'sfdx force --json'
    }
    run(args){
        this.log.it('[!] I just can not keep up with this!')
        const respJSON = this.child.execSync(this.sfdxCommand)
        let resp = JSON.parse(respJSON)
        if(resp&&resp.result&&resp.result.apiVersion) console.log(resp.result.apiVersion)
        else console.log('53.0')
    }
}
module.exports = MetaDataAPIVersion