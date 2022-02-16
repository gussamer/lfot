#!/usr/bin/env node
'use strict'
const Command = require('../Command')
const exec = require('child_process').exec
module.exports = class Open extends Command{    
  constructor(name,settings){
    super(name || 'open/recd',settings)
    this.openCommand = 'sfdx force:org:open'
  }
  run(args){
    this.log.it('[!] your record sire!')
    if(!args||!args.length) throw '[X] this command requires getting into arguments!'
    let comm = this.openCommand
    comm = this.openCommand
    let ignoreIndex = []
    args.forEach((arg,i,a)=>{
      if(arg=='-i'){
        comm = comm+' -p '+a[i+1]
        ignoreIndex.push(i+1)
      }else if(ignoreIndex.indexOf(i)==-1){
        comm = comm+' '+arg
      }
    })
    exec(comm,() => {
      this.log.it('[!] get recd!')
    })
  }
}