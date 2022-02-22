#!/usr/bin/env node
'use strict'
const Command = require('../Command')
const exec = require('child_process').exec
module.exports = class Open extends Command{    
  constructor(name,settings){
    super(name || 'open/setp',settings)
    this.openCommand = 'sfdx force:org:open'
    this.urls = {
      '-s': 'lightning/setup/SetupOneHome/home'
      ,'-d': 'lightning/setup/DeployStatus/home'
      ,'-o': 'lightning/setup/ObjectManager/home'
      ,'-l': 'lightning/setup/ApexDebugLogs/home'
      ,'-j': 'lightning/setup/AsyncApexJobs/home'
    }
  }
  run(args){
    this.log.it('[!] how is this still just wrapped in lightning!')
    let comm = ''
    if(!args||!args.length){
      comm = this.openCommand+' -p '+this.urls['-s']
    }else{
      comm = this.openCommand
      let keyFound = false
      args.forEach(arg=>{
        if(!keyFound&&arg in this.urls){
          comm = comm+' -p '+this.urls[arg]
          keyFound=true
        }else{
          comm = comm+' '+arg
        }
      })
    }
    exec(comm,() => {
      this.log.it('[!] heeeeere\'s SETUP!')
    })
  }
}