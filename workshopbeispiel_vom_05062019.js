/**
 * Das wird ein Hook der was tolles macht - aber was weiß ich nicht jezt so
 * Date: 3.6.2019
 * 
 * @name
 * @author
 * @version
 */

// Use Strict mode ECMA Script 5+ 
"use_strict"; 

const Hook = require("btnexus-hook").Hook; 
const rp = require('request-promise');

class BTNexusHook extends Hook { 
    /**
        This function is called when the Hook was Initialized, after onInit, the Hook will connect to the btNexus.        
     */
    onInit(){ 
        // use the time to initialize your own variables
    } 

    /**
        Is called when the connecton to the btNexus was authenticated successfully.      
     */
    onReady(){ 
        console.log("Hook ready"); 
    } 

    /**
        Function is called every time the user engages in chat that involves this specific Hook.
        
        @param text, String with the original user phrasing
        @param intent, String with the name of the classified intent
        @param language, String Language tag of the language that the end-user is currently speaking in
        @param entities, Array of Objects that contain the name and the Value of each extracted entity: {name: "EntityName", value: "EntityValue"}
        @param slots, Array of Strings that contain all extracted slots
        @param branch, String, name of dialog branch that triggered the Hook
        @param peer, Object: btNexus Peer, used for responding to messages 
     */
    onMessage(text, intent, language, entities, slots, branch, peer){
        // Message received
        console.log("User Text: "+text);

        this.peer = peer;

        switch(String(intent).toLocaleLowerCase()){
            case "wetter":
                //hier Wetter
                this.onExit(this.getWetter("Bremen"));
                break;
            case "uhrzeit":
                //Hier Uhrzeit
                break;
            case "kurs":
                this.getAktienkurs(text,(resp)=>{
                    this.onExit("Kurs von "+text+"  ist "+resp["Global Quote"]["05. price"]);
                });
                break;
            default:
                //Einen Witz
        }
        // respond with echo
        this.say(peer, {
            answer: this.captions[language].sayHi
        });
    }
    getAktienkurs(symbol, callback){      
        var url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol="+symbol+".FRK&apikey=VZA0L7UNIS5IYN90";
        rp(url)
        .then(function (htmlString) {
           var resp = JSON.parse(htmlString, 'utf-8');
            callback(resp);
        })
    }
    /**
     * Schick eine Nachricht an die Nexus (Pepper)
     * @param {string} msg 
     */
    onExit(msg){
        this.say(this.peer, {
            answer: msg
        });       
    }
    getWetter(city){

        //api call openweathermap
        return "Wetter ist gut in "+city;

    }

    /**
        Gets called when the btNexus encounters an error
        
        @param error, String, contains the error message
        @param options, Object with more detal to the error        
     */
    onError(error, options){ 
        console.log("Error:"+error);
        console.dir(options); 
    }

    malZwei(nummer){
        return nummer*2;
    }

    /**
        Function for local testing, you can use this function if
        you just want to debug your code locally without actually
        connecting to the btNexus network.      
     */
    onTest(){
        
        this.onMessage("DBK", "kurs", "de-DE", [], [], "default");
    }

    /**
        Gets called when ever the Hook disconnects from the btNexus network     
     */
    onDisconnect(){ 
        console.log("Disconnected from btNexus"); 
        console.log("Trying to reconnect..."); 
        // it tries to reconnect every second 
        setTimeout(() => { 
                this.connectToBtNexus(); 
        }, 5000); 
    }
}

// Initializing the hook with the respective connection hash 
// The CONNECT_HASH env must remain for deployment!
var acronymsHook = new BTNexusHook(process.env.CONNECT_HASH); 
