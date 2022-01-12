#!/usr/bin/env node
'use strict'
/**
 * Smanifest encompasses a metadata api package.xml manifest
 * maintains a list of Stypes, has a change set name/description and metadata api version
 */
const Stype = require('./Stype.js')
const child = require('child_process')
const fs = require('fs')
module.exports = class Smanifest{
    constructor(argments){
      this.args = argments || []
      this.apiVersion = '53.0'
      this.apiVersionCommand = 'sfdx force --json'
      this.name = ''
      this.description = ''
      this.describeCommand = 'sfdx force:mdapi:describemetadata --json'
      this.stypeNamesToInclude = []
      if(this.args.indexOf('-i')!=-1){
        this.stypeNamesToInclude = this.args[this.args.indexOf('-i')+1].split(',')
      }
      this.stypeNamesToExclude = []
      if(this.args.indexOf('-e')!=-1){
        this.stypeNamesToExclude = this.args[this.args.indexOf('-e')+1].split(',')
      }
      this.maxBufferMBs = 10
      if(this.args.indexOf('-m')!=-1){
        this.maxBufferMBs = this.args[this.args.indexOf('-m')+1].split(',')
      }
      this.filterNamespaced = false
      if(this.args.indexOf('-s')){
        this.filterNamespaced = true
      }
      this.stypes = []
      this.stypeNames = []
      this.stypeNamesToList = []
      this.packageXMLPrefix = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"
          +"\n<Package xmlns=\"http://soap.sforce.com/2006/04/metadata\">"
      this.packageXMLSuffix = "\n    <version>"+this.apiVersion+"</version>\n</Package>"
    }
    getStypes(){
      console.log('[+] Checking current metadata api version')
      this.apiVersion = JSON.parse(child.execSync(this.apiVersionCommand)).result.apiVersion || '53.0'
      console.log('[+] using metadata api version '+this.apiVersion)
      console.log('[+] describing metadata types')
      child.exec(this.describeCommand,this.handleDescribeResult.bind(this))
    }
    handleDescribeResult(error,stdout,stderr){
      if(error||stderr){
        handleDescribeError(error,stderr)
        return
      }
      let resp = JSON.parse(stdout)
      if(this.isResponseGood(resp)){
          resp.result.metadataObjects.sort(this.sortTypes)
          resp.result.metadataObjects.forEach(type => {
            if(this.includeType(type)){
              this.stypes.push(new Stype(type,this.filterNamespaced))
              this.stypeNames.push(type.xmlName)
            }
          });
          this.stypeNamesToList = this.stypeNames
          this.stypes.forEach(type => {
            console.log('[+] listing type '+type.name)
            type.getSmembers(() => {
              console.log('[+] listing type '+type.name+' complete')
              this.stypeNamesToList.splice(this.stypeNamesToList.indexOf(type.name),1)
              if(!this.stypeNamesToList.length){
                console.log('[+] type listing complete')
                this.writeXML()
              }else{
                console.log('[!] still '+this.stypeNamesToList.length+' to go')
              }})
          });
      }
    }
    includeType(type){
      return (!type.inFolder||this.args.indexOf('-n')==-1)
        && (!this.stypeNamesToInclude.length||this.stypeNamesToInclude.indexOf(type.xmlName)!=-1)
        && (!this.stypeNamesToExclude.length||this.stypeNamesToExclude.indexOf(type.xmlName)==-1)
    }
    handleDescribeError(error,stderr){
      console.log('[-] oh rasberries type describe has failed');
      console.log('[-] describe error: ');
      console.log(error);
      console.log('[-] describe stderr: ');
      console.log(stderr);
    }
    isResponseGood(resp){
      return resp
            &&resp.result
            &&resp.result.metadataObjects
            &&Array.isArray(resp.result.metadataObjects)
    }
    getSmembers(callback){
        if(!this.stypes.length) throw '[X] no types whoops!'
        this.stypes.forEach(type => {
            type.getSmembers(callback)
        });
    }
    sortTypes(a, b){
      if (a.xmlName < b.xmlName) {
          return -1;
      }
      if (a.xmlName > b.xmlName) {
          return 1;
      }
      return 0;
    }
    writeXML(){
      console.log('[+] building xml')
      let xmlString = this.packageXMLPrefix
      this.stypes.forEach(type => {
        xmlString += type.getXML()
      })
      xmlString += this.packageXMLSuffix
      let outfile = './package.xml'
      if(this.args.indexOf('-f')!=-1) outfile = this.args[this.args.indexOf('-f')+1]
      console.log('[+] writing xml to '+outfile)
      fs.writeFileSync(outfile,xmlString)
    }
}
