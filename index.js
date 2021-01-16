// const crypto = require("crypto");
const express = require("express");
const { createServer } = require("http");
const WebSocket = require("ws");

const port =  process.env.PORT || 8080
const host = server.address().address;


const unityClient = "unity-client";
const webClient = "web-client";
const wsClientsMap = new Map();
// const url ="https://vrusty-server.herokuapp.com/"  // url where nodejs app is hosted

const app = express();

const server = createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", function (ws) {
  console.log("client joined.");
  /* console.log(url) */
  console.log("server is listening at http://%s:%s", host, port);

  ws.on("message", function (data) {
    if (typeof data === "string") {
      if (data === "web") {
        wsClientsMap.set(webClient, ws);
      } else if (data === "unity") {
        wsClientsMap.set(unityClient, ws);
      }
    }
  });

  // send random bytes interval
  /*   const binaryInterval = setInterval(
    () => ws.send(crypto.randomBytes(8).buffer),
    11000
  ); */

  ws.on("message", function (data) {
    if (typeof data === "string") {
      if (wsClientsMap.get(webClient) == ws && data != "web") {
        console.log(data);
        wsClientsMap.get(unityClient).send(data);
      } else if (wsClientsMap.get(unityClient) == ws) {
        console.log(data);
        //wsClientsMap.get(webClient).send(data);
      }
    }
  });

  ws.on("close", function () {
    console.log("client left.");
    //clearInterval(textSending);
    //clearInterval(binaryInterval);
  });
});

server.listen(port, function () {
  // console.log("Listening on http://localhost:8080");
  console.log("Listening on ", port);
});
