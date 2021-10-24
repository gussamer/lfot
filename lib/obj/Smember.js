#!/usr/bin/env node
'use strict'
/**
 * Stype encompasses a metadata api package.xml manifest type
 * maintains a list of Smembers and has a metadata type name 
 */
 module.exports = class Smember{
    constructor(memberJSON){
        this.memberJSON = memberJSON || {}
        this.name = this.memberJSON.fullName
        this.type = this.memberJSON.type
        this.xml = '        <members>'+this.name+'</members>'
        this.listCommand = 'sfdx force:mdapi:listmetadata --json -m '+this.name
        this.childSmembers = []
    }
    getChildSmembers(callback){
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
      if(!this.childSmembers.length)  return this.xml
      let xmlString = this.xml
      this.childSmembers.forEach(memeber => {
          xmlString += "\n"+memeber.getXML()
      })
      return xmlString
    }
}
