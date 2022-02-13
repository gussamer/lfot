#!/usr/bin/env node
'use strict'
const Logit = require('../obj/Logit.js')
class Command{
    constructor(name,settings){
        this.name = name
        this.settings = settings
        this.log = new Logit(this.settings)
    }
    run(args){
        this.log.it(args)
    }
}
module.exports = Command