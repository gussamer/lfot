#!/usr/bin/env node
'use strict'
const Command = require('../Command')
const Smanifest = require('../../obj/Smanifest.js')
class Fest extends Command{    
    constructor(name,lfot){
      super(name || 'meta/fest',lfot)
    }
    run(args,settings){
      this.log.it('[!] There is a party in my xml and everyone is invited!')
      let manifest = new Smanifest(args,this.lfot)
      manifest.getStypes()
    }
}
module.exports = Fest