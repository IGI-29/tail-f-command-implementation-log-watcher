const events = require("events");
const fs = require("fs");
const bf = require("buffer");
const buffer = new Buffer.alloc(bf.constants.MAX_STRING_LENGTH);
const lastLines = 10;

class UpdateLog extends events.EventEmitter {
  constructor(logFile) {
    super();
    this.logFile = logFile;
    this.arr = [];
  }
  getUpdatedLogs() {
    return this.arr;
  }

  checkUpdate(curr, prev) {
    const log = this;

    fs.open(this.logFile, (err, fd) => {
      let data = "";
      let logArr = [];
      fs.read(fd, buffer, 0, buffer.length, prev.size, (err, bytesRead) => {
        if (bytesRead > 0) {
          data = buffer.slice(0, bytesRead).toString();
          logArr = data.split("\n").slice(1);

          console.log("check logArr data" + logArr);

          if (logArr.length >= lastLines) {
            logArr.slice(-10).forEach((val) => this.arr.push(val));
          } else {
            logArr.forEach((val) => {
              if (this.arr.length === lastLines) {
                this.arr.shift();
              }
              this.arr.push(val);
            });
          }

          log.emit("append", logArr);
        }
      });
    });
  }

  checklog() {
    console.log("checklog executed");
    var log = this;
    fs.open(this.logFile, (err, fd) => {
      let data = "";
      let logArr = [];

      fs.read(fd, buffer, 0, buffer.length, 0, (err, bytesRead) => {
        if (bytesRead > 0) {
          data = buffer.slice(0, bytesRead).toString();
          logArr = data.split("\n");
          this.arr = [];
          logArr.slice(-10).forEach((val) => this.arr.push(val));
        }
        fs.close(fd);
      });
      fs.watchFile(this.logFile, { interval: 2000 }, function (curr, prev) {
        log.checkUpdate(curr, prev);
      });
    });
  }
}
module.exports = UpdateLog;
