/**
 *  Benutzt oder legt eine _config.json im filesystem an.
 *  Kann zum lesen/setzen von configdaten benutzt werden.
 * 
 *  @author Michael Töpfer
 *  @copyright 2019 Michael Töpfer
 */

// Use Strict mode ECMA Script 5+
"use_strict";

module.exports = class config {
    constructor(path){
        this.fs = require('fs');
        this.findRoot = require('find-root');
        this.fileName = "/_config.json";
        this.path = path||this.findRoot(__dirname);
        this.config = {};
        try {
            if (this.fs.existsSync(this.path+this.fileName)) {
                try{
                    this.config = JSON.parse(this.fs.readFileSync(this.path+this.fileName, 'utf-8'));
                } catch(e){
                    throw e;
                }
            } else {
                if (this.fs.existsSync(this.path)){
                    this.fs.writeFile(this.path+this.fileName, "{}", (err) => {
                        if (err) throw err;
                    });
                } else {
                    throw "Unable to create "+ this.fileName+" in: "+this.path+". Error in config.js::constructor()";
                }
            }
        } catch(e){
            throw e;
        }
    }
    /**
     * 
     * @param {String} key 
     * @param {obejct} value
     * cached unter einem Key ein Value
     */
    set(key, value){
        if(!key){
            return false;
        }
        value = value||"";
        this.config[key] = value;
        this._writeconfig();
    }
    /**
     * 
     * @param {String} key
     * @return {Object}
     * Gibt einen Value aus dem Cache zurück 
     */
    get (key){
        if(key && this.config[key]){
            return this.config[key];
        }
        if(key === null || typeof(key)=="undefined"){
            return this.config;
        }
        return "";
    }
    /**
     * 
     * @param {String} key
     * Löscht einen Key + Value aus dem Cache 
     */
    remove(key){
        if(key && this.config[key]){
            delete this.config[key];
            this._writeconfig();
        }
    }
    _writeconfig(){
        try {
            this.fs.writeFile(this.path+this.fileName, JSON.stringify(this.config,null,4), (err) => {
                if (err) throw err;
            });
        } catch (e) {
            console.log('Error: '+this.path+this.fileName+" is not writeable");
        }
    }
}
