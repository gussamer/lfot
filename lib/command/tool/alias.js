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
class Alias extends Command{
    constructor(){
        super('tool\\alias')
        this.child = require('child_process')
        this.commAlias = ''
        this.aliasList = []
    }
    doCommand(args){ 
        this.commsJSON = this.child.execSync('sfdx force:doc:commands:list --json')
        this.comms = JSON.parse(this.commsJSON).result       
        this.comms.forEach(comm => {
            this.alias = this.getNewAlias(comm)
            this.aliasList.push(this.alias)
            if(this.commAlias!=='') this.commAlias += "\n"
            this.commAlias += 'alias '+this.alias+'="sfdx '+comm.name+'"'

        })
        console.log(this.commAlias)
    }
    isAliasFree(alias){
        if(!alias) return false
        if(this.aliasList.indexOf(alias)!=-1) return false
        let whichResult
        try{
            whichResult = this.child.execSync('which '+alias,{stdio:'pipe'})
        }catch(error){
            whichResult = error.toString()
        }        
        if(whichResult.indexOf('which: no '+alias+' in ')==-1) return false
        return true
    }
    getNewAlias(command) {
        let aliasStrings = command.name.split(":");
        let newAlias = '',previousAlias = ''
        let currentOldAliases = []
        let currentSegmentLength = 1,currentSegmentLengthOffset = 0
        let currentIncreseOffest = aliasStrings.length - 2
        while(newAlias==''||currentOldAliases.indexOf(newAlias)!=-1||!this.isAliasFree(newAlias)){ 
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
                            throw '[-] oh rasberries! can\'t find a free alias for '+command.name
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