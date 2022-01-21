#!/usr/bin/env node
'use strict'
const Command = require('../Command')
const Profile = require('../../obj/Profile.js')
class Prof extends Command{    
    constructor(){
        super('meta/prof')
        
    }
    doCommand(args){
        console.log('[!] I hope you are not multitasking right now!')
        let profileObj = new Profile(args)
        profileObj.getXML()
    }
}
module.exports = Prof