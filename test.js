var fs = require("fs");
let count = 1;

function writeFile() {
  fs.appendFile("file.log", "Counter value: " + count.toString(), (err) => {
    if (err) throw err;
  });

  count++;

  setInterval(function () {
    fs.appendFile(
      "file.log",
      "\n Counter value: " + count.toString(),
      (err) => {
        if (err) throw err;
      }
    );
    count++;
  }, 2000);
}

module.exports = writeFile;
