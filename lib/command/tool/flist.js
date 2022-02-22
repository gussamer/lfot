#!/usr/bin/env node
'use strict'
const Command = require('../Command')
const exec = require('child_process').exec
module.exports = class Flist extends Command{    
  constructor(name,settings){
    super(name || 'tool/flist',settings)
    this.schemaCommand = 'sfdx force:schema:sobject:describe'
  }
  run(args){
    this.log.it('[!] You wanna get fields?! Ha! Come on, lets get fields!')
    let comm = ''
    if(!args||!args.length) throw '[X] this command requires getting into arguments!\n[!] lfot tool flist -s Account'
    else{
      comm = this.schemaCommand
      let ignoreIndex = []
      args.forEach((arg,i,a)=>{
        if(arg=='-i'){
          this.include = JSON.parse(a[i+1])
          ignoreIndex.push(i+1)
        }else if(arg=='-e'){
          this.exclude = JSON.parse(a[i+1])
          ignoreIndex.push(i+1)
        }else if(ignoreIndex.indexOf(i)==-1){
          comm = comm+' '+arg
        }
      })
    }
    exec(comm,(err,stdout,stderr) => {
      this.log.it('[!] Hot fields commin through!')
      this.handleSchemaResult(err,stdout,stderr)
    })
  }
  handleSchemaResult(error,stdout,stderr){
    if(error||stderr){
      this.handleError(error,stderr)
      return
    }
    let schema = JSON.parse(stdout)
    let fieldList = ''
    if(this.isSchema(schema)){
      schema.fields.sort(this.sortTypes)
      schema.fields.forEach(field => {
        if(this.includeField(field,this.include)&&!this.excludeField(field,this.exclude)){
          fieldList += (fieldList=='' ? field.name : ','+field.name)
        }
      });
      console.log('')
      console.log(fieldList)
      console.log('')
    }
  }
  handleError(error,stderr){
    this.log.it('[-] oh rasberries type schema has failed');
    this.log.it('[-] schema error: ');
    this.log.it(error);
    this.log.it('[-] schema stderr: ');
    this.log.it(stderr);
  }
  isSchema(schema){
    return schema
          &&schema.fields
          &&Array.isArray(schema.fields)
  }
  includeField(field,include){
    if(!include) return true
    for(const att in include){
      if(typeof include[att]==='string'&&new RegExp(include[att]).test(field[att])){
        continue
      }else if(field[att]!==include[att]){
        return false
      }
    }
    return true
  }
  excludeField(field,exclude){
    if(!exclude) return false
    for(const att in exclude){
      if(typeof exclude[att]==='string'&&new RegExp(exclude[att]).test(field[att])){
        return true
      }else if(field[att]===exclude[att]){
        return true
      }
    }
    return false
  }
}