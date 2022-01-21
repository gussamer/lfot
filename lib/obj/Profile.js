#!/usr/bin/env node
'use strict'
/**
 * Profile handles the "special" nature of salesforce profile xml
 */
 module.exports = class Profile{
    constructor(args){
        this.memberJSON = memberJSON || {}
        this.name = this.memberJSON.fullName || ''
        this.type = this.memberJSON.type
        this.xml = '\n        <members>'+this.name+'</members>'
    }
    getXML(){
      return this.xml
    }
}
