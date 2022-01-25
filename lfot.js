#!/usr/bin/env node
'use strict'
const LightForceTools = require('./lib/LightForceTools.js')
const lft = new LightForceTools()
lft.run(process.argv)