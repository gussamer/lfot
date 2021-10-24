#!/usr/bin/env node
'use strict'
/**
 * Stype encompasses a metadata api package.xml manifest type
 * maintains a list of Smembers and has a metadata type name 
 */
const Smember = require('./Smember.js')
const exec = require('child_process').exec
module.exports = class Stype{    
    constructor(typeJSON){
        this.typeJSON = typeJSON || {}
        this.name = this.typeJSON.xmlName
        this.inFolder = this.typeJSON.inFolder
        this.listCommand = 'sfdx force:mdapi:listmetadata --json -m '+this.name
        this.listFolderCommand = this.listCommand+'Folder'
        this.smembers = []
        this.folderSmembers = []
        this.typeXMLPrefix = "    <types>\n        <name>"+this.name+"</name>"
        this.typeXMLSuffix = "    </types>"
    }
    getSmembers(callback){
      exec(this.listCommand,(error,stdout,stderr) => {
          if(error) throw error
          if(stderr){
              console.log(stderr)
              return
          }
          let resp = JSON.parse(stdout)
          if(resp&&resp.result){
              resp.result.forEach(member => {
                  this.smembers.push(new Smember(member))
              });
          }
          callback()
      })
    }
    getXML(){
        if(!this.smembers.length)  throw '[X] no members whoops!'
        let xmlString = this.typeXMLPrefix
        this.smembers.forEach(memeber => {
            xmlString += memeber.xml
        })
        xmlString += this.typeXMLSuffix
        return xmlString
    }
}
