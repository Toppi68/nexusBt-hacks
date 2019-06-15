/**
 * Abrufen externer Daten via HTTP/JSON und
 * caching der Daten für einen Zeitraum von zwei Stunden
 * 
 * @autor Toppi
 */


 //Im Header des Scriptes zu instanzieren
const cache = require('./lib/cache.js');
const md5 = require('md5');

/**
 * md5 ist ein Modul, das nicht automatisch in nodeJS
 * verfügbar ist. Es ist also ersteinmal zu installieren.
 * 
 * Dafür verwendet man den Konsolenbefehl npm. Über npm (node package manager)
 * lassen sich alle möglichen Pakete installieren.
 * Es gibt nichts, was es nicht gibt. Einfach google fragen.
 * 
 * In diesem fall, um md5 zu installieren: Konsole->npm install md5 
 */



class BTNexusHook extends Hook { 
    /**
     * 1. Caching instanzieren 
     * 2. Caching-Zeitraum abfragen und aktivieren
     */
    onInit() { 
        this.cache = new cache(); 
        if(!this.cache.isAlive()){
            this.cache.setAlive(60*60*2); //zwei Stunden
        }
    }
    /**
     * 
     * Dein Hook-Code
     * 
     */
    irgendeineDeierfunktion(callback){

        this.apiCall("https://apidomain.com?apikey=xyz&q=bremen",(resp)=>{

            /**
             * Hier geths weiter, wenn der angefragte Server seine
             * Daten an die var resp übergeben hat. 
             * Das ist eine asychrone Funktion
             */
            
            if(resp){
                callback(resp);
            }

        });
    }
    /**
     * Das ist eine asynchrone Funktion
     * Es muss auf den Server am anderen Ende gewartet werden,
     * bis er geantwortet hat. Das wird gelsöt, indem eine sog.
     * Callback-Funktion (closure) verwendet wird.
     * 
     * 
     * @param {String} url https://apidomain.com?apikey=xyz&q=bremen
     * @param {function} callback Rückruffunktion
     * @returns {JSON} oder false
     */
    apiCall(url, callback){
        if(url && callback){
            var md5Url = md5(String(url));        
            if(this.cache.get(md5Url)){
                console.log("GET *Cached*: "+url);
                callback(this.cache.get(md5Url));
            } else {
                console.log("GET: "+url);
                this.request('GET', url, {}, (resp) => {
                    this.cache.set(md5Url,resp);
                    callback(resp);
                });
            }           
        } else {
           callback (false);
        }
    }
}
