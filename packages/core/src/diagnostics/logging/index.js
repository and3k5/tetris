
//import { LogFile } from "./log-file.js";

export function transmitter() {
    throw new Error("Not implemented");
    /*
    if (global.browser === true) {
        let socket = new WebSocket("ws://" + location.hostname + ":" + 8085);
        socket.addEventListener("open", function () {
            console.log("socket open");
        });
        socket.addEventListener("message", function () {
            console.log("got message");
        });
        socket.addEventListener("close", function () {
            console.log("close");
        });
        socket.addEventListener("error", function () {
            console.log("error");
        });

        return socket;
    } else {
        const WebSocket = require("ws");
        var socket = new WebSocket("ws://127.0.0.1:8085", {});
        socket.on("open", function () {
            console.log("socket open");
            socket.send(JSON.stringify({
                action: "log",
                time: new Date().getTime(),
                gameGuid: 1337,
                data: {
                    text: "foo",
                }
            }));
        });
        socket.on("message", function () {
            console.log("got message");
        });
        socket.on("close", function () {
            console.log("close");
        });
        socket.on("error", function () {
            console.log("error");
        });
    }
    */
}

export function receiver() {
    throw new Error("Not implemented");
    /*
    //const db = new sqlite3.Database('./database.sqlite');
    const LogFile = require("./log-file.js").LogFile;
    const logFile = new LogFile({ path: "./log.json", init: () => [] });

    const WebSocket = require("ws");

    console.log("init");

    const wss = new WebSocket.Server({
        port: 8085,
    });

    wss.on("connection", function (ws) {
        console.log("connection");

        ws.on('message', function (data) {
            try {
                data = JSON.parse(data);
            }
            catch (e) {
                ws.close();
                console.error(e);
                return;
            }

            if (typeof (data) !== "object" || data == null || Array.isArray(data)) {
                ws.close();
                return;
            }

            if (data.action === "log") {
                // TODO log
                var game = logFile.json.filter(g => g != null && g.gameGuid === data.data.gameGuid)[0];
                if (game == null) {
                    game = {};
                    game.gameGuid = data.data.gameGuid;
                    game.events = [];
                    logFile.json.push(game);
                }

                game.events.push({
                    data: data.data,
                    time: data.time,
                });

                //console.log(game.events.length);

                return;
            }

        });
    })


    */
}