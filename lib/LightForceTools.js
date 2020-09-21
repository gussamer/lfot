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
class LightForceTools{
  constructor(){
    this.commandPathPrefix = __dirname+'\\command\\'
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
  }
  log(msg){
    this.spinnerStop()
    console.log(msg)
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
    this.spinnerCharIndex = 0
    this.spinner = setInterval((function spinnerInterval(){
      process.stdout.write('\r    '+this.spinnerChars[this.spinnerIndex++]+'\r')
      this.spinnerIndex &= 3
    }).bind(this),250)
  }

  /**
   * 
   */
  spinnerStop(){
    if(this.spinner){
      clearInterval(this.spinner)
      this.spinner = null
      process.stdout.write('\r                         \r')
      console.log('')
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
    commandObj.originalName = commands.join('\\')
    return commandObj
  }
  /**
   * 
   * @param {*} commands 
   */
  getCommandObj(commands){
    let commandObj = {}
    let commandPath = commands.join('\\')
    commandObj.name = commandPath
    this.log('[!] You want '+commandPath+' to be done a did!')
    commandPath = this.commandPathPrefix+commandPath
    if(fs.existsSync(commandPath+'.js')) commandPath+='.js'
    if(fs.existsSync(commandPath)){
      let commandFileName = commands[commands.length-1]
      if(fs.lstatSync(commandPath).isDirectory()) commandPath = commandPath+'\\'+commandFileName+'.js'
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
    this.spinnerStop()
    if(commandObj.err){
      let theThing = commandObj.originalName=='help'||commandObj.originalName==null ? 'the thing' : commandObj.originalName
      console.log('[-] Oh heck can\'t do '+theThing+' a do!')
      console.log('[!] Cause '+commandObj.errMsg)
      console.log('[!] You need help!')
    }else{
      console.log('[+] Okay I\'m doing '+commandObj.name+' a do!')
      console.log('')
    }
    this.spinnerStart()
    const Command = require(commandObj.path)
    const comm = new Command()
    comm.run(commandObj.args ? commandObj.args : args.cargs)
    this.spinnerStop()
  }
  /**
   * 
   * @param {*} args 
   */
  run(args){
    try{
      this.spinnerStart()
      let parsedArgs = this.parseArgs(args)
      setTimeout(this.execute.bind(this), 3000, parsedArgs)
    }catch(ex){
      this.spinnerStop()
      console.log(ex)
      this.execute(this.helpArgs)
    }
  }
}
module.exports = LightForceTools