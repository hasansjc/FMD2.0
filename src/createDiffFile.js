"use strict";
const fs = require("fs");
const { modifyDiffViewForFile } = require("./utils");
const jsonDiff = require("json-diff");

function createDiffFile(message1, message2, jsonmsg1, jsonmsg2, missingmessages) {
  if(missingmessages)
    fs.appendFileSync(
    "diff.txt", missingmessages+ "\n ------------------------------------------------------\n ","utf8");
  if(message1 && message2 && jsonmsg1 && jsonmsg2){
    fs.appendFileSync(
      "diff.txt",
      message1[0].messageString.substring(
        message1[0].messageString.indexOf("58=") + 3,
        message1[0].messageString.indexOf(
          "\x01",
          message1[0].messageString.indexOf("58=")
        )
      ) + " -> ",
      "utf8"
    );
    fs.appendFileSync(
      "diff.txt",
      message1[0].messageString.replaceAll("\x01", "  ")+"\n\n",
      "utf8"
    );
  
    fs.appendFileSync(
      "diff.txt",
      message2[0].messageString.substring(
        message2[0].messageString.indexOf("58=") + 3,
        message2[0].messageString.indexOf(
          "\x01",
          message2[0].messageString.indexOf("58=")
        )
      ) + " -> ",
      "utf8"
    );
    fs.appendFileSync(
      "diff.txt",
      message2[0].messageString.replaceAll("\x01", " "),
      "utf8"
    );
    fs.appendFileSync(
      "diff.txt",
      modifyDiffViewForFile(
        JSON.stringify(jsonDiff.diff(jsonmsg1, jsonmsg2)),
        message1,
        message2
      )+ "--------------------------------------------------------------\n ",
      "utf-8"
    );
  }
  
}
exports.createDiffFile = createDiffFile;
