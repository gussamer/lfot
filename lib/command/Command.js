#!/usr/bin/env node
'use strict'
class Command{
    constructor(name){
        this.name = name
    }
    doCommand(args){
        console.log(args)
    }
    run(args){
        try{
            this.doCommand(args)
        }catch(ex){        
            console.log(ex)
        }
    }
}
module.exports = Command