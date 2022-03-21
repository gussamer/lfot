#!/usr/bin/env node
'use strict'
/**
 * Stype encompasses a metadata api package.xml manifest type
 * maintains a list of Smembers and has a metadata type name 
 */
const Smember = require('./Smember.js')
module.exports = class Sfolder extends Smember {
  constructor(folderJSON,stype) {
    super(folderJSON)
    this.stype = stype || {}
    this.smembers = smembers || []
    this.listCommandSuffix = ' --folder '
    this.folderedListCommand = this.stype.listCommand+this.listCommandSuffix+this.name
    this.hasError = false
    this.error = null
    this.stderr = null
    this.filterNamespaced = this.stype.filterNamespaced || false
    this.settings = this.stype.settings || {}
    this.log = new Logit(this.settings)
    this.settings.maxBufferMBs = this.settings.maxBufferMBs || 10
  }
  getSmembers(callback) {
    exec(this.listCommand, {maxBuffer: (1024 * 1024 * this.settings.maxBufferMBs)}, (error, stdout, stderr) => {
      this.hasError = this.handleListError(error, stderr)
      if(!this.hasError) {
        let resp = JSON.parse(stdout)
        if(this.stype.isResultArray(resp)) {
          resp.result.forEach(member => {
            let newMember = new Smember(member)
            if(!this.filterNamespaced
              || (this.filterNamespaced && !newMember.isNamespaced())) {
              this.smembers.push(newMember)
            }
          })
          this.smembers.sort(this.stype.sortSmembers)
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
      this.log.it('[-] oh rasberries folder ' + this.name + ' has failed listing')
      this.log.it('[-] type ' + this.name + ' error: ')
      this.log.it(this.error)
      this.log.it('[-] type ' + this.name + ' stderr: ')
      this.log.it(this.stderr)
    }
    return hasError
  }
  getXML() {
    if(this.smembers.length) {
      this.smembers.forEach(memeber => {
        this.xml += memeber.xml
      })
    }
    return this.xml
  }
}
