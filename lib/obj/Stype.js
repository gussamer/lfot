#!/usr/bin/env node
'use strict'
/**
 * Stype encompasses a metadata api package.xml manifest type
 * maintains a list of Smembers and has a metadata type name 
 */
const Logit = require('./Logit.js')
const Sfolder = require('./Sfolder.js')
const Smember = require('./Smember.js')
const exec = require('child_process').exec
module.exports = class Stype {
  constructor(typeJSON, filterNamespaced, settings) {
    this.typeJSON = typeJSON || {}
    this.name = this.typeJSON.xmlName || this.typeJSON.fullName
    this.inFolder = this.typeJSON.inFolder
    this.listCommandPrefix = 'sfdx force:mdapi:listmetadata --json -m '
    this.listCommand = this.listCommandPrefix + this.name
    this.listFolderCommand = this.listCommand + 'Folder'
    this.smembers = []
    this.sfolders = []
    this.sfolderNames = []
    this.sfolderNamesToList = []
    this.typeXMLPrefix = "\n    <types>\n        <name>" + this.name + "</name>"
    this.typeXMLSuffix = "\n    </types>"
    this.hasError = false
    this.error = null
    this.stderr = null
    this.filterNamespaced = filterNamespaced || false
    this.settings = settings || {}
    this.log = new Logit(this.settings)
    this.settings.maxBufferMBs = this.settings.maxBufferMBs || 10
  }
  processXML(callback) {
    if(this.inFolder) {
      this.getSfolders(callback)
    } else {
      this.getSmembers(callback)
    }
  }
  getSfolders(callback) {
    exec(this.listFolderCommand, {maxBuffer: (1024 * 1024 * this.settings.maxBufferMBs)}, (error, stdout, stderr) => {
      this.hasError = this.handleListError(error, stderr)
      if(!this.hasError) {
        let resp = JSON.parse(stdout)
        if(this.isResultArray(resp)) {
          resp.result.forEach(sfolder => {
            let tempSfolder = new Sfolder(sfolder, this)
            if(!this.filterNamespaced || (this.filterNamespaced && !tempSfolder.isNamespaced())) {
              this.sfolders.push(tempSfolder)
              this.sfolderNames.push(tempSfolder.name)
            }
          })
          this.sfolderNamesToList = this.sfolderNames
          if(this.sfolders.length) {
            this.sfolders.forEach(sfolder => {
              this.log.it('[+] listing ' + this.name + 'Folder ' + sfolder.name)
              sfolder.getSmembers(() => {
                this.log.it('[+] listing ' + this.name + 'Folder ' + sfolder.name + ' complete')
                this.sfolderNamesToList.splice(this.sfolderNamesToList.indexOf(sfolder.name), 1)
                if(!this.sfolderNamesToList.length) {
                  this.log.it('[+] listing ' + this.name + 'Folders ' + ' complete')
                  callback(this)
                } else {
                  this.log.it('[!] still ' + this.sfolderNamesToList.length + ' ' + this.name + 'Folders to go')
                }
              })
            })
          } else {
            this.hasError = true
            this.error = 'no ' + this.name + 'Folders found'
            callback(this)
          }
        } else {
          this.hasError = true
          this.error = 'no ' + this.name + 'Folders found'
          callback(this)
        }
      }
    })
  }
  getSmembers(callback) {
    exec(this.listCommand, {maxBuffer: (1024 * 1024 * this.settings.maxBufferMBs)}, (error, stdout, stderr) => {
      this.hasError = this.handleListError(error, stderr)
      if(!this.hasError) {
        let resp = JSON.parse(stdout)
        if(this.isResultArray(resp)) {
          resp.result.forEach(member => {
            let newMember = new Smember(member)
            if(!this.filterNamespaced
              || (this.filterNamespaced && !newMember.isNamespaced())) {
              this.smembers.push(newMember)
            }
          })
        }
      }
      callback(this)
    })
  }
  handleListError(error, stderr) {
    let hasError = false
    if(error) {
      hasError = true
      this.error = error
    }
    if(stderr) {
      hasError = true
      this.stderr = stderr
    }
    if(hasError) {
      this.log.it('[-] oh rasberries type ' + this.name + ' has failed listing')
      this.log.it('[-] type ' + this.name + ' error: ')
      this.log.it(this.error)
      this.log.it('[-] type ' + this.name + ' stderr: ')
      this.log.it(this.stderr)
    }
    return hasError
  }
  isResultArray(resp) {
    return resp && resp.result && Array.isArray(resp.result)
  }
  sortSmembers(a, b) {
    if(a.name < b.name) {
      return -1
    }
    if(a.name > b.name) {
      return 1
    }
    return 0
  }
  getXML() {
    if(!this.xml) {
      if(this.inFolder) {
        this.sfolders.sort(this.sortSmembers)
        this.getMemberXML(this.sfolders)
      } else {
        this.smembers.sort(this.sortSmembers)
        this.getMemberXML(this.smembers)
      }
    }
    return this.xml
  }
  getMemberXML(members) {
    this.xml = ''
    if(members.length && !this.hasError) {
      this.xml = this.typeXMLPrefix
      members.forEach(memeber => {
        this.xml += memeber.getXML()
      })
      this.xml += this.typeXMLSuffix
    }
  }
}
