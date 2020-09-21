#!/usr/bin/env node
const child = require('child_process')
const commsJSON = child.execSync('sfdx force:doc:commands:list --json')
const comms = JSON.parse(commsJSON).result
//console.log(comms)
var commAlias = ''
var aliasList = []
var isAliasFree = (alias) => {
    if(!alias) return false
    if(aliasList.indexOf(alias)!=-1) return false
    let whichResult = child.execSync('which '+alias)
    if(whichResult.indexOf('which: no '+alias+' in ')==-1) return false
    return true
}
var getNewAlias = (command) => {
    let aliasStrings = command.name.split(":");
    let newAlias = ''
    let currentOldAliases = []
    currentOldAliases.push(aliasList)
    let currentLength,currentSegmentLength = 1
    let currentIncreseOffest = aliasStrings.length - 2
    let segmentIncreseOffest = 1
    while(newAlias=!''&&currentOldAliases.indexOf(newAlias)!=-1){
        aliasStrings.forEach((aliasSegment,index,arr) => {
            currentLength = aliasSegment.length
            if(oldAliases.indexOf(newAlias)!=-1&&index>currentIncreseOffest){
                currentSegmentLength+=segmentIncreseOffest
            }
            newAlias += aliasSegment.slice(0,currentSegmentLength)
        })
    }
}
comms.forEach(comm => {
    //console.log(comm)
    let aliasStrings = comm.name.split(":");
    let alias = ''
    aliasStrings.forEach(alas => {
        alias += alas.split('')[0]
    })
    aliasList.push(alias)
    if(commAlias!=='') commAlias += "\n"
    commAlias += 'alias '+alias+'="sfdx '+comm.name+'"'

})
console.log(commAlias)
process.exit(1)