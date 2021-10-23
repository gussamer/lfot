#!/usr/bin/env node
'use strict'
/**
 * Smanifest encompasses a metadata api package.xml manifest
 * maintains a list of Stypes, has a change set name/description and metadata api version
 */
const Stype = require('./Stype.js')
const exec = require('child_process').exec
const fs = require('fs')
module.exports = class Smanifest{
    constructor(){
        this.apiVersion = '51.0'
        this.name = ''
        this.description = ''
        this.describeCommand = 'sfdx force:mdapi:describemetadata --json'
        this.stypes = []
        this.packageXMLPrefix = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"
            +"\n<Package xmlns=\"http://soap.sforce.com/2006/04/metadata\">"
        this.packageXMLSuffix = "    <version>"+this.apiVersion+"</version>\n</Package>"
    }
    getStypes(){
        exec(this.describeCommand,(error,stdout,stderr) => {
            if(error) throw error
            if(stderr){
                console.log(stderr)
                return
            }
            let resp = JSON.parse(stdout)
            if(resp&&resp.result&&resp.result.metadataObjects){
                resp.result.metadataObjects.forEach(type => {
                    this.stypes.push(new Stype(type))
                });
                console.log(this.stypes)
                this.stypes.forEach(type => {
                    type.getMembers()
                });
                let xmlString = this.packageXMLPrefix
                this.stypes.forEach(type => {
                    xmlString += type.getXML()
                })
                xmlString += this.packageXMLSuffix
                fs.writeFileSync('./package.xml',xmlString)
            }
        })
    }
    getMembers(){
        if(!this.stypes.length) throw '[X] no types whoops!'
        this.stypes.forEach(type => {
            type.getMembers()
        });
        this.writeXML()
    }
    writeXML(){
        let xmlString = this.packageXMLPrefix
        this.stypes.forEach(type => {
            xmlString += type.getXML()
        })
        xmlString += this.packageXMLSuffix
        fs.writeFileSync('./package.xml',xmlString)
    }
}
