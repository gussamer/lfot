#!/usr/bin/env node
'use strict'
/**
 * @File Name          : LightForceTools.js
 * @Description        : the light force operator tools cli object
 * @Author             : angustalves@gmail.com
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    2020-01-18   angustalves@gmail.com     Initial Version
**/
const fs = require('fs')
const os = require('os')
const path = require('path')
const Logit = require('./obj/Logit.js')
module.exports = class LightForceTools{
  constructor(){
    this.pathDelimiter = path.normalize('/')
    this.commandPathPrefix = path.join(__dirname,'command'+this.pathDelimiter)
    this.spinnerChars = [
      '    ᕙ(⇀‸↼‶)ᕗ    '
      ,'  < ᕙ(⇀‸↼‶)ᕗ >  '
      ,' {< ᕙ(⇀‸↼‶)ᕗ >} '
      ,'{{< ᕙ(⇀‸↼‶)ᕗ >}}'
      ,' {< ᕙ(⇀‸↼‶)ᕗ >} '
      ,'  < ᕙ(⇀‸↼‶)ᕗ >  ']
    this.spinnerIndex = 0
    this.spinner = null
    this.helpArgs = {"commands":['help'],"cargs":null}
    this.settings = {}
    this.settings.showSpinnerDuration = 3000
    this.settings.showSpinner = true
    this.settings.logThings = true
    this.settings.alwaysHelp = true
    this.log = new Logit(this.settings)
  }
  logOverSpin(msg){
    this.spinnerStop()
    this.log.it(msg)
    this.spinnerStart()
  }
  /**
   * @description determines if a arg is flag if starts with a dash
   * or a declaration if it contains a = 
   * @param {*} arg a arguement passed from the command line
   */
  isArgFlagOrDeclare(arg){
    return (arg.charAt(0)=='-' || arg.includes('='))
  }
  /**
   * 
   * @param {*} args 
   */
  findArgsStart(args){
    if(args){
      return args.findIndex(this.isArgFlagOrDeclare)
    }
    return false
  }
  /**
   * 
   * @param {*} splitIndex 
   * @param {*} args 
   */
  splitArgs(splitIndex,args){
    var commands, cargs
    if(splitIndex>-1){
      commands = args.slice(0,splitIndex)
      cargs = args.slice(splitIndex)
    } else commands = args
    return {"commands":commands,"cargs":cargs}
  }
  /**
   * 
   * @param {*} args 
   */
  parseArgs(args){
    if(args){
      this.nodeLocation = args.shift()
      this.scriptLocation = args.shift()
      if(args.length>0){
        let argsStartIndex = this.findArgsStart(args)
        return this.splitArgs(argsStartIndex,args)
      }
    }
    return this.helpArgs
  }
  /**
   * 
   */
  spinnerStart(){
    if(this.settings.showSpinner){
      this.spinnerCharIndex = 0
      this.spinner = setInterval((function spinnerInterval(){
        process.stdout.write('\r    '+this.spinnerChars[this.spinnerIndex++]+'\r')
        this.spinnerIndex &= 3
      }).bind(this),250)
    }
  }
  /**
   * 
   */
  spinnerStop(){
    if(this.spinner){
      clearInterval(this.spinner)
      this.spinner = null
      process.stdout.write('\r                         \r')
      this.logOverSpin('')
    }
  }
  /**
   * 
   * @param {*} commands 
   */
  getHelpCommandObj(commands){
    let commandObj = {}
    commandObj.name = 'help'
    commandObj.path = this.commandPathPrefix+'help/help'
    commandObj.err = true
    commandObj.errMsg = 'that command path not doing an exist'
    commandObj.originalName = commands.join(this.pathDelimiter)
    return commandObj
  }
  /**
   * 
   * @param {*} commands 
   */
  getCommandObj(commands){
    let commandObj = {}
    let commandPath = commands.join(this.pathDelimiter)
    commandObj.name = commandPath
    commandPath = this.commandPathPrefix+commandPath
    if(fs.existsSync(commandPath+'.js')) commandPath+='.js'
    if(fs.existsSync(commandPath)){
      let commandFileName = commands[commands.length-1]
      if(fs.lstatSync(commandPath).isDirectory()) commandPath = path.join(commandPath,commandFileName+'.js')
      commandObj.path = commandPath
    }else{
      commandObj = this.getHelpCommandObj(commands)
    }
    return commandObj
  }
  /**
   * 
   * @param {*} args 
   */
  execute(args){
    const commandObj = this.getCommandObj(args.commands)
    this.logOverSpin('[!] You want '+commandObj.name+' to be done a did!')
    this.spinnerStop()
    if(commandObj.err){
      let theThing = commandObj.originalName=='help'||commandObj.originalName==null ? 'the thing' : commandObj.originalName
      this.logOverSpin('[-] Oh heck can\'t do '+theThing+' a do!')
      this.logOverSpin('[!] Cause '+commandObj.errMsg)
      this.logOverSpin('[!] You need help!')
    }else{
      this.logOverSpin('[+] Okay I\'m doing '+commandObj.name+' a do!')
      this.logOverSpin('')
    }
    this.spinnerStart()
    const Command = require(commandObj.path)
    let comm = new Command(commandObj.name,this.settings)
    try{
      comm.run(commandObj.args ? commandObj.args : args.cargs,this.settings)
    }catch(ex){
      let theThing = commandObj.originalName=='help'||commandObj.originalName==null ? 'the thing' : commandObj.originalName
      this.logOverSpin('[-] Oh heck can\'t do '+theThing+' a do!')
      this.logOverSpin('[!] Cause '+ex)
      this.logOverSpin('[!] You need help!')
      throw(ex)
    }
    this.spinnerStop()
  }  
  setSettings(){
    try{
      this.settings = require(os.homedir()+'/.lfot/settings.json')
      this.log = new Logit(this.settings)
    }catch(ex){
      //no settings go with defaults
    }
  }
  /**
   * 
   * @param {*} args 
   */
  run(args){
    try{
      this.setSettings()
      this.spinnerStart()
      let parsedArgs = this.parseArgs(args)
      if(this.settings.showSpinnerDuration){
        setTimeout(this.execute.bind(this),this.settings.showSpinnerDuration,parsedArgs)
      }else{
        this.execute(parsedArgs)
      }
    }catch(ex){
      this.spinnerStop()
      this.log.it(ex)
      if(this.settings.alwaysHelp) this.execute(this.helpArgs)
    }
  }
}