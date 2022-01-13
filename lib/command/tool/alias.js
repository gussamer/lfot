#!/usr/bin/env node
'use strict'
/**
 * @description       : 
 * @author            : angustalves@gmail.com
 * @group             : 
 * @last modified on  : 09-16-2020
 * @last modified by  : angustalves@gmail.com
 * Modifications Log 
 * Ver   Date         Author                  Modification
 * 1.0   09-16-2020   angustalves@gmail.com   Initial Version
**/
const Command = require('../Command.js')
const child = require('child_process')
const fs = require('fs')
class Alias extends Command{
    constructor(){
        super('tool\\alias')
        this.commAlias = []
        this.aliasList = []
        this.prettyList = []
        this.overrideIdList = []
        this.overrides = [
          {alias:"fpc",commid:"force:project:create"}
        ]
    }
    doCommand(args){ 
      args = args || []
      this.filename = ''
      if(args.indexOf('-f')!=-1){
        this.filename = args[args.indexOf('-f')+1]
      }
      this.commsJSON = child.execSync('sfdx commands --hidden --output=json')
      this.comms = JSON.parse(this.commsJSON)
      if(args.indexOf('-n')==-1){
        this.overrides.forEach(override => {
          this.aliasList.push(override.alias)
          this.commAlias.push('alias '+override.alias+'="sfdx '+override.commid+'"')
          this.prettyList.push('  '+override.alias+' = sfdx '+override.commid)
          this.overrideIdList.push(override.commid)
        })
      }
      this.comms.forEach(comm => {
        if(this.overrideIdList.indexOf(comm.id)==-1){
          this.alias = this.getNewAlias(comm.id)
          this.aliasList.push(this.alias)
          this.commAlias.push('alias '+this.alias+'="sfdx '+comm.id+'"')
          this.prettyList.push('  '+this.alias+' = sfdx '+comm.id)
        }
      })
      this.commAlias = this.commAlias.sort()
      this.prettyList = this.prettyList.sort()
      if(args.indexOf('-p')==-1){
        if(this.filename){
          fs.writeFileSync(this.filename,this.commAlias.join("\n"))
          console.log('[!] wrote aliases to '+this.filename)
        }else{
          console.log(this.commAlias.join("\n"))
        }
      }else{
        console.log(this.prettyList.join("\n\n"))
      }
    }
    isAliasFree(alias){
        if(!alias) return false
        if(this.aliasList.indexOf(alias)!=-1) return false
        let whichResult
        try{
            whichResult = child.execSync('which '+alias,{stdio:'pipe'})
        }catch(error){
            whichResult = error.toString()
        }        
        if(whichResult.indexOf('which: no '+alias+' in ')==-1) return false
        return true
    }
    getNewAlias(command) {
        let aliasStrings = command.split(":")
        if(aliasStrings[0]!='force') aliasStrings.unshift('force')
        let newAlias = '',previousAlias = ''
        let currentOldAliases = []
        let currentSegmentLength = 1,currentSegmentLengthOffset = 0
        let currentIncreseOffest = aliasStrings.length - 2
        while(!newAlias||newAlias.length<3||currentOldAliases.indexOf(newAlias)!=-1||!this.isAliasFree(newAlias)){ 
            if(newAlias!='') currentOldAliases.push(newAlias)
            newAlias=''
            currentSegmentLength=1
            aliasStrings.forEach((aliasSegment,index,arr) => {
                if(currentOldAliases.indexOf(previousAlias)!=-1){
                    if(index>currentIncreseOffest){
                        currentSegmentLengthOffset++
                    }else{
                        currentSegmentLengthOffset=0
                    }
                    currentSegmentLength+=currentSegmentLengthOffset
                    if(index==arr.length-1){
                        currentIncreseOffest--
                        if(currentIncreseOffest<0&&currentSegmentLength>aliasSegment.length) 
                            throw '[-] oh rasberries! can\'t find a free alias for '+command
                    }
                }
                newAlias += aliasSegment.slice(0,currentSegmentLength)
            })
            previousAlias = newAlias
        }
        return newAlias
    }
}
module.exports = Alias