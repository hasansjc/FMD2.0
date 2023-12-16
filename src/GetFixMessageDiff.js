"use strict";
const { FIXParser } = require("fixparser");
const fs = require("fs");
const { deleteUnwantedTags, modifyDiffViewForMail } = require("./utils");
const composeEmail = require("./composeEmail");
// const csvFilePath = process.argv[2];
// const range_from = process.argv[3] || 1;
// const range_to = process.argv[4] || 100000;
const jsonDiff = require("json-diff");
const { createDiffFile } = require("./createDiffFile");
// let originalFile = fs.readFileSync(csvFilePath, "utf8");
// exports.originalFile = originalFile;
const fixParser = new FIXParser();
exports.fixParser = fixParser;
fs.writeFileSync("diff.txt", "", "utf8");

let email = "";
let already_found = []
let missingmessages = '';
let missingmessagesforfile = '';

function getFixMessageDiff(originalFile,range_from,range_to) {
  const org_messages = originalFile.split("\n");
  const messages = org_messages.slice(0, org_messages.length - 1);
  for (let i = 0; i < messages.length - 1; i++) {
    let message1 = fixParser.parse(messages[i]);
    const jsonmsg1 = message1[0].toFIXJSON();

    if (jsonmsg1.Body.Text) {
      if (
        jsonmsg1.Body.Text.indexOf("TORA") != -1 ||
        jsonmsg1.Body.Text.indexOf("REDI") != -1
      ) {
        let corresponding_msg_found = false;   
        let msgType = jsonmsg1.Header.MsgType;    
        let tag58 = jsonmsg1.Body.Text;  
        let msgIndex = tag58.substring(4)   
        let toSearchtag58 = tag58.substring(0,4)== `TORA`?`REDI${msgIndex}`:`TORA${msgIndex}`;  
        const msgNo = jsonmsg1.Body.Text.substr(4);

        for (let j = i + 1; j < messages.length; j++) {
          let message2 = fixParser.parse(messages[j]);
          const jsonmsg2 = message2[0].toFIXJSON();
          if (jsonmsg2.Body.Text) {

            if(jsonmsg2.Header.MsgType == msgType && jsonmsg2.Body.Text == toSearchtag58){    
                corresponding_msg_found = true; 
                already_found.push({
                    sender : toSearchtag58.substring(0,4) ==`TORA`? `REDI${msgIndex}`: `TORA${msgIndex}`,
                    msgType
                })          
            }  
            let found = already_found.find(element => element.sender == toSearchtag58 &&  element.msgType == msgType)
            if(found)
                corresponding_msg_found = true; 

            if (
              jsonmsg2.Header.MsgType == msgType &&
              (msgType == "D" || msgType == "G" || msgType == "F") &&
              jsonmsg2.Body.Text.substr(4) == msgNo &&
              msgNo >= range_from &&
              msgNo <= range_to
            ) {
              deleteUnwantedTags(jsonmsg1, jsonmsg2);

              let diff = jsonDiff.diff(jsonmsg1, jsonmsg2);
              if (diff) {
                let source = message1[0].messageString.substring(
                  message1[0].messageString.indexOf("58=") + 3,
                  message1[0].messageString.indexOf("58=") + 7
                );
                let diffkeys = Object.keys(diff.Body);
                handleDeletedAddedTags(diffkeys, source, diff);
                diff = JSON.stringify(diff);
                diff = modifyDiffViewForMail(diff, message1, message2);
                email = email + composeEmail(message1, message2, diff);
                console.log(message1[0].messageString.replaceAll("\x01", " | "));
                console.log(message2[0].messageString.replaceAll("\x01", " | "));
                console.log(
                    jsonDiff.diffString(jsonmsg1, jsonmsg2, { color: true })
                );
                createDiffFile(message1, message2, jsonmsg1, jsonmsg2,null);
              }
            }
          }
        }
        if (corresponding_msg_found == false){   
            console.log(tag58," ","35 =",msgType, " corresponding message not found");  
            missingmessages = missingmessages + tag58+" 35 = "+msgType+ "  Corresponding message not found<br>"
            missingmessagesforfile = missingmessagesforfile + tag58+" 35 = "+msgType+ "  Corresponding message not found \n"
        }
      }
    }
  }
  email =  "<strong>Missing meesages</strong><br>" + missingmessages + email;
  createDiffFile(null, null, null, null,missingmessagesforfile);
  return email;
}

function handleDeletedAddedTags(diffkeys, source, diff) {
  diffkeys.forEach((key) => {
    if (key.indexOf("__deleted") != -1) {
      let key_name = key.substring(0, key.indexOf("__deleted"));
      diff.Body[key_name] =
        source === "REDI"
          ? { REDI: diff.Body[key], TORA: "<b>TAG NOT PRESENT</b>" }
          : { TORA: diff.Body[key], REDI: "<b>TAG NOT PRESENT</b>" };
    }
    if (key.indexOf("__added") != -1) {
      let key_name = key.substring(0, key.indexOf("__added"));
      diff.Body[key_name] =
        source === "REDI"
          ? { REDI: "<b>TAG NOT PRESENT</b>", TORA: diff.Body[key] }
          : { TORA: "<b>TAG NOT PRESENT</b>", REDI: diff.Body[key] };
    }
  });
  diffkeys.forEach((key) => {
    if (key.indexOf("__deleted") != -1 || key.indexOf("__added") != -1)
      delete diff.Body[key];
  });
}

module.exports = getFixMessageDiff;
