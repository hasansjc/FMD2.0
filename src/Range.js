const { FIXParser } = require("fixparser");
const fs = require("fs");
const fixParser = new FIXParser();

function isValidRange(originalFile, range_from, range_to) {
  let maxRange = getMaxRange(originalFile)
  if (range_from > maxRange || range_to > maxRange) 
    return false
   else 
    return true
}

function getMaxRange(originalFile) {
  const org_messages = originalFile.split("\n");
  let maxRange = 1;
  const messages = org_messages.slice(0, org_messages.length - 1);

  for (let i = 0; i < messages.length; i++) {
    let message = fixParser.parse(messages[i]);
    let jsonmsg;
    try {
      jsonmsg = message[0].toFIXJSON();
    } catch (error) {
      if (message.length == 0)
        console.log(
          "There are blank lines in the log file, please remove the blank lines at line no ",
          i + 1
        );
      process.exit(0);
    }
    if (jsonmsg.Body.Text) {
      if (
        jsonmsg.Body.Text.indexOf("TORA") != -1 ||
        jsonmsg.Body.Text.indexOf("REDI") != -1
      )
        maxRange = jsonmsg.Body.Text.substr(4);
    }
  }
  return maxRange;
}
exports.isValidRange = isValidRange;
exports.getMaxRange = getMaxRange;
