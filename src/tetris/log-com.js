
//import { LogFile } from "./log-file.js";

export function transmitter() {
    //if (global.browser === true) 
    {
        let socket = new WebSocket("ws://"+location.hostname+":"+8085);
        socket.addEventListener("open",function () {
            console.log("socket open");
        });
        socket.addEventListener("message",function () {
            console.log("got message");
        });
        socket.addEventListener("close",function () {
            console.log("close");
        });
        socket.addEventListener("error",function () {
            console.log("error");
        });

        return socket;
    }
}

export function receiver() {
    //const db = new sqlite3.Database('./database.sqlite');
    const LogFile = require("./log-file.js").LogFile;
    const logFile = new LogFile({path:"./log.json",init: () => []});

    const WebSocket = require("ws");

    console.log("init");

    const wss = new WebSocket.Server({
        port: 8085,
    });

    wss.on("connection",function (ws) {
        console.log("connection");
    
        ws.on('message',function (data) {
            try {
                data = JSON.parse(data);
            }
            catch (e) {
                ws.close();
                console.error(e);
                return;
            }

            if (typeof(data) !== "object" || data == null || Array.isArray(data)) {
                ws.close();
                return;
            }
            
            if (data.action === "log") {
                // TODO log
                console.log("LOG ACTION");
                return;
            }
    
        });
    })

    
    
}