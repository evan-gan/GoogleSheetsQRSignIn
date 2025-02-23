function doGet(e) {
  // Get the search id from the URL parameter "id"
  var searchId = e.parameter.id;
  if (!searchId) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Missing parameter: id" }))
                         .setMimeType(ContentService.MimeType.JSON);
  }

  // Open the spreadsheet: if sheetId is provided, use it; otherwise, use the active spreadsheet.
  var sheet;
  if (e.parameter.sheetId) {
    try {
      var ss = SpreadsheetApp.openById(e.parameter.sheetId);
      sheet = ss.getActiveSheet();
    } catch (error) {
      return ContentService.createTextOutput(JSON.stringify({ error: "Invalid sheetId" }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
  } else {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  }

  // Read header row to determine column indices by header names
  var headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  var headers = headerRange.getValues()[0];
  var headerMap = {};
  for (var i = 0; i < headers.length; i++) {
    headerMap[headers[i]] = i;
  }

  // Ensure required columns exist
  var requiredCols = ["ID", "Legal Name", "Name", "Arrived?", "Forms?", "Email", "Reminder email sent?"];
  for (var j = 0; j < requiredCols.length; j++) {
    if (headerMap[requiredCols[j]] === undefined) {
      return ContentService.createTextOutput(JSON.stringify({ error: "Missing required column: " + requiredCols[j] }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Get all data rows (starting from row 2)
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return ContentService.createTextOutput(JSON.stringify({ error: "No data found" }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
  var dataRange = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn());
  var data = dataRange.getValues();

  var found = false;
  var result;
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    // Compare the "ID" column (using headerMap for its index)
    if (String(row[headerMap["ID"]]) === String(searchId)) {
      found = true;
      // Update the "Arrived?" column to true
      var arrivedCol = headerMap["Arrived?"] + 1;
      sheet.getRange(i + 2, arrivedCol).setValue(true);

      // If "Forms?" is false (or "false") and a reminder hasn't been sent yet, send the email reminder.
      var formsVal = row[headerMap["Forms?"]];
      var reminderSent = row[headerMap["Reminder email sent?"]];
      var reminderSentUpdated = reminderSent; // Preserve original value

      if ((formsVal === false || String(formsVal).toLowerCase() === "false") &&
          !(reminderSent === true || String(reminderSent).toLowerCase() === "true")) {
        var recipientEmail = row[headerMap["Email"]];
        sendFormReminder(row[headerMap["Legal Name"]], recipientEmail);

        // Update "Reminder email sent?" to true
        var reminderCol = headerMap["Reminder email sent?"] + 1;
        sheet.getRange(i + 2, reminderCol).setValue(true);
        reminderSentUpdated = true;
      }

      // Prepare the result JSON using updated values
      result = {
        id: row[headerMap["ID"]],
        name: row[headerMap["Name"]],
        arrived: true,
        forms: row[headerMap["Forms?"]],
        email: row[headerMap["Email"]],
        reminderEmailSent: reminderSentUpdated // Ensures updated status is reflected in response
      };
      break;
    }
  }

  if (!found) {
    return ContentService.createTextOutput(JSON.stringify({ error: "ID not found" }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify(result))
                       .setMimeType(ContentService.MimeType.JSON);
}

function sendFormReminder(name, email) {
  var subject = "Scrapyard Boston Liability Form";
  var body = "Hi " + name + ",<br><br>" +
             "We just checked you in and we don't have your liability and media release form in our system.<br><br>" +
             "If you have not filled out the waiver and are:<br>" +
             "- Under 18 forward/text this email to a parent and have them fill it out <a href='https://examplelink.com'>here</a> & reply to this email with the filled out form attached.<br>" +
             "- Above 18 fill it out <a href='https://examplelink.com'>here</a> & reply to this email with the filled out form attached.<br><br>" +
             "If you have filled out the waiver:<br>" +
             "- Please reply to this email with your filled out copy attached<br><br>" +
             "Once you have replied with your completed form, please find a orginizer and get checked in.<br><br>" +
             "Best,<br>" +
             "The Scrapyard Boston Team.";
  
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: body
  });
}

/**
 * Generates a 25-character UUID from the given input, using uppercase letters and numbers.
 *
 * @param {string|number} input The input value from the cell.
 * @return {string} The 25-character UUID.
 * @customfunction
 */
function MAKE_UUID(input) {
  // Ensure the input is a string
  input = input.toString();
  
  // Compute the MD5 digest of the input
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, input);
  
  // Convert the digest (byte array) to a hex string
  var hex = digest.map(function(byte) {
    // Handle negative bytes and ensure two-digit hex values
    var val = (byte < 0 ? byte + 256 : byte).toString(16);
    return (val.length === 1 ? "0" + val : val);
  }).join("");
  
  // Convert the hex string to a BigInt
  var bigIntValue = BigInt("0x" + hex);
  
  // Convert the BigInt to a base36 string and then to uppercase
  var base36 = bigIntValue.toString(36).toUpperCase();
  
  // Ensure the UUID is exactly 25 characters:
  // If it's too short, pad with leading zeros; if it's too long, trim it.
  if (base36.length < 25) {
    base36 = base36.padStart(25, "0");
  } else if (base36.length > 25) {
    base36 = base36.substr(0, 25);
  }
  
  return base36;
}

