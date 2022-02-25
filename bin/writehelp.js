#!/usr/bin/env node

const exec = require("child_process").execSync
exec('bash ./node_modules/.bin/marked -o ./etc/help.html -i ./README.md --gfm')
const fs = require('fs') 
const orgiHelp = fs.readFileSync('./etc/help.html',options={encoding:"utf8"})
const help = '\n<!DOCTYPE html>'
            +'\n<html>'
            +'\n<head>'
            +'\n<title>I\'m helping!</title>'
            +'\n<style>'
            +'\n  pre{'
            +'\n    padding: 16px;'
            +'\n    overflow: auto;'
            +'\n    font-size: 115%;'
            +'\n    font-family:\'Courier New\', Courier, monospace;'
            +'\n    line-height: 1.45;'
            +'\n    background-color: var(--color-canvas-subtle);'
            +'\n    border-radius: 6px;'
            +'\n    border:#dddddd 0.1rem solid;'
            +'\n  }'
            +'\n</style>'
            +'\n</head>'
            +'\n<body></body>'
            +'\n'+orgiHelp
            +'</body>'
            +'\n</head>'
            +'\n</html>'
fs.writeFileSync('./etc/help.html',help)
exec('bash ./node_modules/.bin/html ./etc/help.html > ./etc/help.txt')



