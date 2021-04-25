#!/usr/bin/env node
'use strict'
/**
 * Stype encompasses a metadata api package.xml manifest type
 * maintains a list of Smembers and has a metadata type name 
 */
class Stype{    
    constructor(initSmembers,initName){
        this.smembers = initSmembers || []
        this.name = initName || ''
    }
    getSmembers(){}
    setSmembers(){}
}
module.exports = Stype