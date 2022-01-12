#!/usr/bin/env node
'use strict'
/**
 * Stype encompasses a metadata api package.xml manifest type
 * maintains a list of Smembers and has a metadata type name 
 */
 module.exports = class Smember{
    constructor(memberJSON){
        this.memberJSON = memberJSON || {}
        this.name = this.memberJSON.fullName || ''
        this.type = this.memberJSON.type
        this.xml = '\n        <members>'+this.name+'</members>'
    }
    getXML(){
      return this.xml
    }
}
