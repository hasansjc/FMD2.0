
const readlineSync = require('readline-sync');

module.exports = {
    deleteUnwantedTags: function (jsonmsg1, jsonmsg2) {
      delete jsonmsg1.Header.BodyLength;
      delete jsonmsg1.Header.MsgSeqNum;
      delete jsonmsg1.Header.SendingTime;
      delete jsonmsg1.Body.ClOrdID;
      delete jsonmsg1.Body.OrigClOrdID;
      delete jsonmsg1.Body.Text;
      delete jsonmsg1.Body.TransactTime;
      delete jsonmsg1.Trailer.CheckSum;
      delete jsonmsg2.Header.BodyLength;
      delete jsonmsg2.Header.MsgSeqNum;
      delete jsonmsg2.Header.SendingTime;
      delete jsonmsg2.Body.ClOrdID;
      delete jsonmsg2.Body.OrigClOrdID;
      delete jsonmsg2.Body.Text;
      delete jsonmsg2.Body.TransactTime;
      delete jsonmsg2.Trailer.CheckSum;
    },
    modifyDiffViewForMail: function (diff, message, message2) {
      diff = diff.replaceAll(
        "__old",
        message[0].messageString.substring(
          message[0].messageString.indexOf("58=") + 3,
          message[0].messageString.indexOf("58=") + 7
        )
      );
      diff = diff.replaceAll(
        "__new",
        message2[0].messageString.substring(
          message2[0].messageString.indexOf("58=") + 3,
          message2[0].messageString.indexOf("58=") + 7
        )
      );
      diff = diff.replaceAll('"},', "<br>");
      diff = diff.replaceAll('{"Body":', "Differences   <br>");
      diff = diff.replaceAll('{"', "  ");
      diff = diff.replaceAll('":"', " = ");
      diff = diff.replaceAll('","', " | ");
      diff = diff.replaceAll('":', "  ->  ");
      diff = diff.replaceAll('"', "");
      diff = diff.replaceAll("}}}", "");
  
      return diff;
    },
    modifyDiffViewForFile: function (diff, message, message2) {
      diff = diff.replaceAll(
        "__old",
        message[0].messageString.substring(
          message[0].messageString.indexOf("58=") + 3,
          message[0].messageString.indexOf("58=") + 7
        )
      );
      diff = diff.replaceAll(
        "__new",
        message2[0].messageString.substring(
          message2[0].messageString.indexOf("58=") + 3,
          message2[0].messageString.indexOf("58=") + 7
        )
      );
      diff = diff.replaceAll('"},', "\n");
      diff = diff.replaceAll('{"Body":', "\n\nDiffernces:\n");
      diff = diff.replaceAll('{"', "");
      diff = diff.replaceAll('":"', " = ");
      diff = diff.replaceAll('","', " | ");
      diff = diff.replaceAll('":', "  -> ");
      diff = diff.replaceAll('"', "");
      diff = diff.replaceAll("}}}", "\n\n");
  
      return diff;
    },
    getPassword : async () =>{
          const password = readlineSync.question('Enter your email password: ', {
              hideEchoBack: true, // This option hides user input
          });
            return(password);
    } 
  };
  