/**
 *  Legt eine _cache.json im filesystem an.
 *  Kann zum _cachen benutzt werden.
 * 
 *  @author Michael Töpfer
 *  @copyright 2018 Michael Töpfer
 */

// Use Strict mode ECMA Script 5+
"use_strict";

module.exports = class cache {
    constructor(path){
        this.fs = require('fs');
        this.findRoot = require('find-root');
        this.time = Math.floor(new Date().getTime()/1000);
        this.fileName = "/_cache.json";
        this.path = path||this.findRoot(__dirname);
        this._cache = {
            "alive" :0,
            "data" : {}
        };
        try {
            if (this.fs.existsSync(this.path+this.fileName)) {
                try{
                    var tmp = this.fs.readFileSync(this.path+this.fileName, 'utf-8');
                    if(tmp){
                        this._cache = JSON.parse(tmp);
                    }
                } catch(e){
                    //this.setAlive();
                }
            } else {
                if (this.fs.existsSync(this.path)){
                    this.fs.writeFile(this.path+this.fileName, "", (err) => {
                        if (err) throw err;
                    });
                } else {
                    throw "Unable to create cache.json in: "+this.path+". Error in cache.js::constructor()";
                }
            }
            if(!this.isAlive()){
                this.destroy();
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
        this._cache.data[key] = value;
        this._writecache();
    }
    /**
     * 
     * @param {Integer} timestampInSecs 
     * Legt fest, wann der Cache gelöscht wird.
     * (PHP/Unixtimestamp in Sekunden)
     */
    setAlive(timestampInSecs){
        this._cache.alive = parseInt(this.time+timestampInSecs)||0;
        this._writecache();
    }
    /**
     * @return {Integer} 
     * Gibt zurück, bis wann der Cache gültig ist
     * Unix-Timestamp in Sekunden
     */
    getAlive(){
        return this._cache.alive;
    }
    /**
     * @return {boolean}
     * Ist der Cache noch am Leben?
     */
    isAlive() {
        return this._cache.alive > this.time ? true : false;
    }
    /**
     * 
     * @param {String} key
     * @return {Object}
     * Gibt einen Value aus dem Cache zurück 
     */
    get (key){
        if(key && this._cache.data[key]){
            return this._cache.data[key];
        }
        if(key === null || typeof(key)=="undefined"){
            return this._cache.data;
        }
        return "";
    }
    /**
     * 
     * @param {String} key
     * Löscht einen Key + Value aus dem Cache 
     */
    remove(key){
        if(key && this._cache.data[key]){
            delete this._cache.data[key];
            this._writecache();
        }
    }
    /**
     * Löscht den gesamten Cache
     */
    destroy(){
       delete this._cache;
        this._cache = {
            "alive" : 0,
            "data" : {}
        };
        this._writecache();
    }
    _writecache(){
        try {
            this.fs.writeFile(this.path+this.fileName, JSON.stringify(this._cache), (err) => {
                if (err) throw err;
            });
        } catch (e) {
            console.log('Error: '+this.path+this.fileName+" is not writeable");
        }
        
    }
}
