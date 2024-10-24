#!/usr/bin/env node
'use strict'
const Command = require('../../Command')
const Profile = require('../../../obj/Profile.js')
class Prof extends Command{    
    constructor(name,lfot){
        super(name || 'meta/prof',lfot)
    }
    run(args){
        this.log.it('[!] I hope you are not multitasking right now!')
        let profileObj = new Profile(args)
        profileObj.getXML()
    }
}
module.exports = Prof