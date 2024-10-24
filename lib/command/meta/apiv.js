#!/usr/bin/env node
'use strict'
const Command = require('../Command')
class MetaDataAPIVersion extends Command{    
    constructor(name,lfot){
        super(name || 'meta/apiv',lfot)
        this.child = require('child_process')
        this.sfdxCommand = 'sf org display --json'
    }
    run(args){
        this.log.it('[!] I just can not keep up with this!')
        const respJSON = this.child.execSync(this.sfdxCommand)
        let resp = JSON.parse(respJSON)
        if(resp&&resp.result&&resp.result.apiVersion) console.log(resp.result.apiVersion)
        else console.log(this.lfot.settings.defaultMetadataAPIVersion)
    }
}
module.exports = MetaDataAPIVersion