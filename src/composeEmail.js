
function composeEmail(message, message2, diff) {
    let email = 
      "<p>" +
      "<strong>" +
      message[0].messageString.substring(
        message[0].messageString.indexOf("58=") + 3,
        message[0].messageString.indexOf("\x01",message[0].messageString.indexOf("58="))
      ) +
      "  Msg Type "+
      message[0].messageString.substring(
        message[0].messageString.indexOf("35=") + 3,
        message[0].messageString.indexOf("\x01",message[0].messageString.indexOf("35="))
      ) +
      "</strong>" +
      "  -  " +
      message[0].messageString.replaceAll("\x01", "  ") +
      "</p>" +
      "<br>" +
      "<p>" +
      "<strong>" +
      message2[0].messageString.substring(
        message2[0].messageString.indexOf("58=") + 3,
        message2[0].messageString.indexOf("\x01",message[0].messageString.indexOf("58="))
      ) +
      "  Msg Type "+
      message2[0].messageString.substring(
        message2[0].messageString.indexOf("35=") + 3,
        message2[0].messageString.indexOf("\x01",message2[0].messageString.indexOf("35="))
      ) +
      "</strong>" +
      "  -  " +
      message2[0].messageString.replaceAll("\x01", " ") +
      "</p>" +
      "<br>" +
      diff +
      "<br><hr style=`border-top: 1px solid #000`>";

      return email;
  }

  module.exports = composeEmail