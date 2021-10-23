#!/usr/bin/env node
'use strict'
const Command = require('../Command')
const Smanifest = require('../../obj/Smanifest.js')
class Fest extends Command{    
    constructor(){
        super('meta/fest')
        
    }
    doCommand(args){
        console.log('[!] There is a party in my xml and everyone is invited!')
        let manifest = new Smanifest()
        manifest.getStypes()
    }
}
module.exports = Fest