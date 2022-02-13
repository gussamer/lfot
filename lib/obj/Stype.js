#!/usr/bin/env node
'use strict'
/**
 * Stype encompasses a metadata api package.xml manifest type
 * maintains a list of Smembers and has a metadata type name 
 */
const Logit = require('./Logit.js')
const Smember = require('./Smember.js')
const exec = require('child_process').exec
module.exports = class Stype{    
    constructor(typeJSON,filterNamespaced,settings){
      this.typeJSON = typeJSON || {}
      this.name = this.typeJSON.xmlName || this.typeJSON.fullName
      this.inFolder = this.typeJSON.inFolder
      this.listCommandPrefix = 'sfdx force:mdapi:listmetadata --json -m '
      this.listCommand = this.listCommandPrefix+this.name
      this.listFolderCommand = this.listCommand+'Folder'
      this.smembers = []
      this.folderSmembers = []
      this.childTypes = []
      this.typeXMLPrefix = "\n    <types>\n        <name>"+this.name+"</name>"
      this.typeXMLSuffix = "\n    </types>"
      this.hasError = false
      this.error = null
      this.stderr = null
      this.filterNamespaced = filterNamespaced || false
      this.settings = settings || {}
      this.log = new Logit(this.settings)
      this.settings.maxBufferMBs = this.settings.maxBufferMBs || 10
    }
    getSmembers(callback){
      exec(this.listCommand,{maxBuffer:(1024*1024*this.settings.maxBufferMBs)},(error,stdout,stderr) => {
        if(error){
          this.hasError = true
          this.error = error
        }
        if(stderr){
          this.hasError = true
          this.stderr = stderr
        }
        if(this.hasError){
          this.handleListError()
        }else{
          let resp = JSON.parse(stdout)
          if(resp&&resp.result&&Array.isArray(resp.result)){
              resp.result.forEach(member => {
                let newMember = new Smember(member)
                if(!this.filterNamespaced
                  ||(this.filterNamespaced&&!newMember.isNamespaced())){
                    this.smembers.push(newMember)
                  }
              });
              this.smembers.sort(this.sortSmembers)
          }
        }
        callback(this)
      })
    }
    isMemberNamespaced(member){
      if(member.namespacePrefix){
        return true
      }else if((member.fullName.match(new RegExp('__','gi'))||[]).length>1){
        return true
      }
      return false
    }
    handleListResult(error,stdout,stderr){

    }
    handleListError(){
      this.log.it('[-] oh rasberries type '+this.name+' has failed listing');
      this.log.it('[-] type '+this.name+' error: ');
      this.log.it(this.error);
      this.log.it('[-] type '+this.name+' stderr: ');
      this.log.it(this.stderr);
    }
    sortSmembers(a, b){
      if (a.name < b.name) {
          return -1;
      }
      if (a.name > b.name) {
          return 1;
      }
      return 0;
    }
    getXML(){
      let xmlString = ''
      if(this.smembers.length&&!this.hasError){
        xmlString = this.typeXMLPrefix
        this.smembers.forEach(memeber => {
            xmlString += memeber.xml
        })
        xmlString += this.typeXMLSuffix
      }
      return xmlString
    }
}
