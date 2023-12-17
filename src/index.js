const fs = require("fs");
const { getPassword } = require("./utils.js");
const { sendMail } = require("./newmailservice.js");
const readlineSync = require("readline-sync");
const getFixMessageDiff = require("./GetFixMessageDiff.js");
const { isValidRange, getMaxRange } = require("./Range.js");

let File;
async function run() {
  try {
    let filePath = await getFilePath();
    File = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    console.log("Oops! No such file or directory exists.");
    process.exit(1);
  }
  if (File) {
    let [from, to] = await getRangeFromUser();
    if (isValidRange(File, from, to)) {
      const choice = await toSendEmailOrNot();
      if (choice == "Y" || choice == "y") {
        // const pass = await getPassword();
        const email = getFixMessageDiff(File, from, to);
        sendMail(email);
      } else getFixMessageDiff(File, from, to);
    } else {
      console.log(
        "Max Range exceeds the number of message in the log file, Max Range is",
        getMaxRange(File)
      );
      process.exit(0);
    }
  }
}

run();

async function toSendEmailOrNot() {
  let choice = readlineSync.question(
    "Do you want to send the email, Press y for yes, n for no : "
  );
  return choice;
}

async function getFilePath() {
  let filePath = readlineSync.question(
    "Please enter the absolute file path : "
  );
  return filePath;
}

async function getRangeFromUser() {
  let range = readlineSync.question(
    "-------------------------------------------------------\nPlease enter the range separted by hiphen(-) eg, 10-20 OR \nPress Enter to get the diff of entire file : "
  );
  if (range.length === 0) {
    let maxRange = getMaxRange(File);
    return [1, maxRange];
  }
  let rangeIsInvalid = true;
  while (rangeIsInvalid) {
    if (range.indexOf(" ") != -1 || range.indexOf("-") === -1) {
      console.log("Range is invalid, Please try again");
      range = readlineSync.question(
        "Please enter the range separted by hiphen(-) eg, 10-20 : "
      );
    } else {
      let from = parseInt(range.substring(0, range.indexOf("-")));
      let to = parseInt(range.substring(range.indexOf("-") + 1, range.length));
      if (isNaN(from) || isNaN(to)) {
        rangeIsInvalid = true;
        console.log("Please enter numeric values, Please try again");
        range = readlineSync.question(
          "Please enter the range separted by hiphen(-) eg, 10-20 : "
        );
      } else if (from > to) {
        rangeIsInvalid = true;
        console.log("Range (TO) is less than Range (FROM), Please try again");
        range = readlineSync.question(
          "Please enter the range separted by hiphen(-) eg, 10-20 : "
        );
      } else {
        rangeIsInvalid = false;
        return [from, to];
      }
    }
  }
}
