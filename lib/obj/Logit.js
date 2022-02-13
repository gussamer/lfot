#!/usr/bin/env node
'use strict'
/**
 * Logit handles console logging with respect to global setting
 */
 module.exports = class Logit{
    constructor(settings){
      this.settings = settings || {}
      this.settings.logThings = typeof this.settings.logThings!==undefined ? this.settings.logThings : true
    }
    it(it){
      if(this.settings.logThings) console.log(it)
    }
}
