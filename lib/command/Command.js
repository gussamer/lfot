#!/usr/bin/env node
'use strict'
const Logit = require('../obj/Logit.js')
class Command{
    constructor(name,lfot){
        this.name = name
        this.lfot = lfot
        this.log = this.lfot.log
    }
    run(args){
        this.log.it(args)
    }
}
module.exports = Command