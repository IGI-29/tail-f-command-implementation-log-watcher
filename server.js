const UpdateLog = require("./updateLog");
const writeFile = require("./test.js");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");
const port = 3000;

writeFile();

let log = new UpdateLog("file.log");
log.checklog();

app.get("/log", (req, rest) => {
  var options = {
    root: path.join(__dirname),
  };
  var fileName = "index.html";
  rest.sendFile(fileName, options, function (err) {
    console.log("file showed");
  });
});

io.on("connection", function (socket) {
  console.log("successfully connected");

  log.on("append", function process(data) {
    socket.emit("update-data", data);
  });

  let data = log.getUpdatedLogs();
  socket.emit("inital-data", data);

  console.log(data, "check update logs");
});

http.listen(port, function () {});
