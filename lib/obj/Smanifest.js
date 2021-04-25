#!/usr/bin/env node
'use strict'
/**
 * Smanifest encompasses a metadata api package.xml manifest
 * maintains a list of Stypes, has a change set name/description and metadata api version
 */
class Smanifest{
    constructor(){
        this.fs = require('fs')
        this.stypes = []
        this.apiVersion = '51.0'
        this.name = ''
        this.description = ''
    }
    readXMLManifest(){}
    writeXMLManifest(){}
    getStypes(){}
    setStypes(){}
}
module.exports = Smanifest