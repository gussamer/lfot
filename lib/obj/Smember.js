#!/usr/bin/env node
'use strict'
/**
 * Stype encompasses a metadata api package.xml manifest type
 * maintains a list of Smembers and has a metadata type name 
 */
class Smember{
    constructor(initName){
        this.name = initName || ''
    }
}
module.exports = Smember