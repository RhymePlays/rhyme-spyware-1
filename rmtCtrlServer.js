// Imports
import { createRequire } from "module";const require = createRequire(import.meta.url);

import { Server } from "socket.io";
import clipboard from "clipboardy";
import { readFileSync, writeFile, writeFileSync, unlinkSync } from "fs";
const { exec } = require('child_process');
const screenshot = require('screenshot-desktop')

// Init Socket
const io = new Server(5051, {
    cors: {origin: "*", methods: ["GET", "POST"]}
});

io.on("connection", (socketObj)=>{
    socketObj.emit("connectionEstablished", true);

    socketObj.on("runCmd", (arg)=>{
        if (arg.cmd!=undefined && arg.cmd!=""){
            exec(arg.cmd, ((e, stdout, stdeer) => {
                socketObj.emit("returnCmd", {
                    id: arg.id,
                    command: arg.cmd,
                    return: {e: e, stdout: stdout, stdeer: stdeer}
                });
            }));
        }
    });

    socketObj.on("takeScreenshot", (arg)=>{
        screenshot({"format":"png"}).then((returnValue)=>{
            socketObj.emit("returnScreenshot", {
                id: arg.id,
                return: ("data:image/png;base64,"+returnValue.toString('base64'))
            });
        });
    });

    socketObj.on("getClipboard", (arg)=>{
        socketObj.emit("returnClipboard", {
            id: arg.id,
            return: clipboard.readSync()
        });
    });

    socketObj.on("copyToClipboard", (arg)=>{
        if (arg.hasOwnProperty("stringToCopy")){
            try{clipboard.writeSync(arg.stringToCopy)}catch(e){}
            socketObj.emit("returnCopyToClipboard", {
                id: arg.id,
                return: clipboard.readSync()
            });
        }
    });

    socketObj.on("writeFile", (arg)=>{
        if (arg.directory!=undefined && arg.directory!=""  && arg.bytesToWrite!=undefined){
            try{
                writeFile(arg.directory, arg.bytesToWrite, arg.encoding=="base64"? "base64":"utf-8", (err)=>{
                    if (err){
                        socketObj.emit("returnWriteFile", {
                            id: arg.id,
                            return: false
                        });
                    }else{
                        socketObj.emit("returnWriteFile", {
                            id: arg.id,
                            return: true
                        });
                    }
                });
            }catch(e){}
        }
    });

    socketObj.on("readFile", (arg)=>{
        if (arg.directory!=undefined && arg.directory!=""){
            let returnValue = false;
            try{returnValue = readFileSync(arg.directory, (arg.encoding=="base64"?"base64":"utf-8"))}catch(e){}
            socketObj.emit("returnReadFile", {
                id: arg.id,
                return: returnValue
            });
        }
    });

})