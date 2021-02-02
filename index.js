// const crypto = require("crypto");
const express = require("express");
const { createServer } = require("http");
const WebSocket = require("ws");

const port =  process.env.PORT || 8080
const unityClient = "unity-client";
const webClient = "web-client";
const wsClientsMap = new Map();
// const url ="https://vrusty-server.herokuapp.com/"  // url where nodejs app is hosted

const app = express();

const server = createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", function (ws) {
  console.log("client joined.");
  // console.log(url)

  // first message to identify clients
  ws.on("message", function (data) {

    // so that only 2 clients can connect to the server - newer connections always overwrite the connection
    if(wsClientsMap.size<2){
      if (typeof data === "string") {
        if (data === "web") {
          wsClientsMap.set(webClient, ws);
        } else if (data === "unity") {
          wsClientsMap.set(unityClient, ws);
        }
      }
    }
  });

  ws.on("message", function (data) {
    if (typeof data === "string") {
      if(wsClientsMap.get(unityClient)==ws && wsClientsMap.get(webClient)!=null){
        console.log(data)
        wsClientsMap.get(webClient).send(data);
      }
      if(wsClientsMap.get(webClient)==ws && wsClientsMap.get(unityClient)!=null){
        console.log(data)
        wsClientsMap.get(unityClient).send(data);
      }
    }
  });

  ws.on("close", function () {
    console.log("client left.");

    // delete websocket connection and delete connection from clientsmap
    wsClientsMap.forEach((value, key, wsClientsMap)=>{
      if(value === ws){
        wsClientsMap.delete(key)
      }
    })

  });
});


server.listen(port, function () {
  // console.log("Listening on http://localhost:8080");
  console.log("Listening on ", port);
});
