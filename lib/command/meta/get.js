#!/usr/bin/env node
'use strict'
const Command = require('../Command')
const exec = require('child_process').exec
const fs = require('fs')
const path = require('path');
class MetaDataGet extends Command{    
    constructor(name,lfot){
        super(name || 'meta/get',lfot)
        this.child = require('child_process')
        this.sfdxCommand = 'sf project retrieve start --manifest '
    }
    run(args){
      if(!args||!args.length) throw '[X] this command requires getting into arguments!\n[!] lfot meta get -d path/to/package.aml/directory'
      else{
        let comm = ''
        let packageDir = ''
        let otherArgs = ''
        args.forEach((arg,i,a)=>{
          if(arg=='-d'){
            packageDir = a[i+1]
          }else{
            if(otherArgs==''){
              otherArgs = arg
            }else{
              otherArgs += ' '+arg
            }
          }
        })
        const packageFiles = fs.readdirSync(packageDir, { withFileTypes: true })
                      .filter(file => path.extname(file).toLowerCase() === 'xml')
                      .map(file => file.name);
        packageFiles.forEach((file) =>{
          comm = this.sfdxCommand+path.join(packageDir,file)
          this.child.execSync(comm)
          comm = ''
        })
      }
    }
}
module.exports = MetaDataGet