import WebSocket from "ws";
//import express from 'express';
//import Promise from 'bluebird';
import sqlite from 'sqlite';

export function receiver() {
    const dbPromise = sqlite.open('./database.sqlite');

    const wss = new WebSocket.Server({
        port: 8085,
        perMessageDeflate: {
            zlibDeflateOptions: {
                // See zlib defaults.
                chunkSize: 1024,
                memLevel: 7,
                level: 3
            },
            zlibInflateOptions: {
                chunkSize: 10 * 1024
            },
            // Other options settable:
            clientNoContextTakeover: true, // Defaults to negotiated value.
            serverNoContextTakeover: true, // Defaults to negotiated value.
            serverMaxWindowBits: 10, // Defaults to negotiated value.
            // Below options specified as default values.
            concurrencyLimit: 10, // Limits zlib concurrency for perf.
            threshold: 1024 // Size (in bytes) below which messages
            // should not be compressed.
        }
    });

    ws.on('open', function open() {
        ws.send(JSON.stringify({
            status: "open",
        }));
    });

    ws.on('message',async function incoming(data) {
        console.log(typeof (data), data);

        const db = await dbPromise;
        const [post, categories] = await Promise.all([
            db.get('SELECT * FROM Post WHERE id = ?', req.params.id),
            db.all('SELECT * FROM Category')
        ]);
    });
}