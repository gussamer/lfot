#!/usr/bin/env node
'use strict'
/**
 * Smanifest encompasses a metadata api package.xml manifest
 * maintains a list of Stypes, has a change set name/description and metadata api version
 */
const Logit = require('./Logit.js')
const Stype = require('./Stype.js')
const child = require('child_process')
const fs = require('fs')
module.exports = class Smanifest {
  constructor(argments, settings) {
    this.apiVersion = '53.0'
    this.apiVersionCommand = 'sfdx force --json'
    this.name = ''
    this.description = ''
    this.describeCommand = 'sfdx force:mdapi:describemetadata --json'
    this.args = argments || []
    this.filterFoldered = false
    if(this.args.indexOf('-n') != -1) {
      this.filterFoldered = true
    }
    this.stypeNamesToInclude = []
    if(this.args.indexOf('-i') != -1) {
      this.stypeNamesToInclude = this.args[this.args.indexOf('-i') + 1].split(',')
    }
    this.stypeNamesToExclude = []
    if(this.args.indexOf('-e') != -1) {
      this.stypeNamesToExclude = this.args[this.args.indexOf('-e') + 1].split(',')
    }
    this.consoleOut = false
    if(this.args.indexOf('-c') != -1) {
      this.consoleOut = true
    }
    this.filterNamespaced = false
    if(this.args.indexOf('-s') != -1) {
      this.filterNamespaced = true
    }
    this.settings = settings || {}
    this.log = new Logit(this.settings)
    this.settings.maxBufferMBs = 10
    if(this.args.indexOf('-m') != -1) {
      this.settings.maxBufferMBs = this.args[this.args.indexOf('-m') + 1].split(',')
    }
    this.stypes = []
    this.stypeNames = []
    this.stypeNamesToList = []
    this.packageXMLPrefix = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"
      + "\n<Package xmlns=\"http://soap.sforce.com/2006/04/metadata\">"
    this.packageXMLSuffix = "\n    <version>" + this.apiVersion + "</version>\n</Package>"
  }
  getStypes() {
    this.log.it('[+] Checking current metadata api version')
    this.apiVersion = JSON.parse(child.execSync(this.apiVersionCommand)).result.apiVersion || '53.0'
    this.log.it('[+] using metadata api version ' + this.apiVersion)
    this.log.it('[+] describing metadata types')
    child.exec(this.describeCommand, this.handleDescribeResult.bind(this))
  }
  handleDescribeResult(error, stdout, stderr) {
    if(error || stderr) {
      this.handleDescribeError(error, stderr)
      return
    }
    let resp = JSON.parse(stdout)
    if(this.isResponseGood(resp)) {
      resp.result.metadataObjects.forEach(type => {
        if(this.includeType(type)) {
          this.stypes.push(new Stype(type, this.filterNamespaced, this.settings))
          this.stypeNames.push(type.xmlName)
        }
      })
      this.stypeNamesToList = this.stypeNames
      this.stypes.forEach(type => {
        this.log.it('[+] listing type ' + type.name)
        type.processXML(() => {
          this.log.it('[+] listing type ' + type.name + ' complete')
          this.stypeNamesToList.splice(this.stypeNamesToList.indexOf(type.name), 1)
          if(!this.stypeNamesToList.length) {
            this.log.it('[+] type listing complete')
            this.writeXML()
          } else {
            this.log.it('[!] still ' + this.stypeNamesToList.length + ' types to go')
          }
        })
      })
    }
  }
  includeType(type) {
    return (!type.inFolder || !this.filterFoldered)
      && (!this.stypeNamesToInclude.length || this.stypeNamesToInclude.indexOf(type.xmlName) != -1)
      && (!this.stypeNamesToExclude.length || this.stypeNamesToExclude.indexOf(type.xmlName) == -1)
  }
  handleDescribeError(error, stderr) {
    this.log.it('[-] oh rasberries type describe has failed')
    this.log.it('[-] describe error: ')
    this.log.it(error)
    this.log.it('[-] describe stderr: ')
    this.log.it(stderr)
  }
  isResponseGood(resp) {
    return resp
      && resp.result
      && resp.result.metadataObjects
      && Array.isArray(resp.result.metadataObjects)
  }
  getSmembers(callback) {
    if(!this.stypes.length) throw '[X] no types whoops!'
    this.stypes.forEach(type => {
      type.getSmembers(callback)
    })
  }
  sortTypes(a, b) {
    if(a.name < b.name) {
      return -1
    }
    if(a.name > b.name) {
      return 1
    }
    return 0
  }
  writeXML() {
    this.log.it('[+] building xml')
    let xmlString = this.packageXMLPrefix
    this.stypes.sort(this.sortTypes)
    this.stypes.forEach(type => {
      xmlString += type.getXML()
    })
    xmlString += this.packageXMLSuffix
    if(this.consoleOut) {
      console.log(xmlString)
    } else {
      let outfile = './package.xml'
      if(this.args.indexOf('-f') != -1) outfile = this.args[this.args.indexOf('-f') + 1]
      this.log.it('[+] writing xml to ' + outfile)
      fs.writeFileSync(outfile, xmlString)
    }
  }
}
