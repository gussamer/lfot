#!/usr/bin/env node
'use strict'
const LightforceTools = require('./lib/LightforceTools')
const lft = new LightforceTools()
lft.run(process.argv)