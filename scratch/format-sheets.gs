/**
 * SattaDarshan - Modern Calm Inbox Theme for Google Sheets
 * 
 * Instructions:
 * 1. Open your private Google Spreadsheet.
 * 2. Click Extensions > Apps Script.
 * 3. Add this function to your existing Code.gs (or in a new file 'Theme.gs').
 * 4. In the function dropdown at the top, select 'formatSubmissionsSheet' and click 'Run'.
 * 5. Both 'Corrections' and 'Contact' tabs will be immediately formatted into a modern,
 *    clean, eye-friendly admin inbox!
 * 
 * Note: This touches ONLY formatting, styling, widths, and colors.
 * It NEVER modifies, deletes, or alters any existing submission data.
 */

function formatSubmissionsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var correctionsSheet = ss.getSheetByName("Corrections");
  if (correctionsSheet) {
    applyCorrectionsStyling(correctionsSheet);
  }
  
  var contactSheet = ss.getSheetByName("Contact");
  if (contactSheet) {
    applyContactStyling(contactSheet);
  }
  
  SpreadsheetApp.getActiveSpreadsheet().toast(
    "SattaDarshan modern inbox theme applied successfully!", 
    "Formatting Complete", 
    5
  );
}

/**
 * Formats the 'Corrections' tab into a clean, calm reading layout.
 */
function applyCorrectionsStyling(sheet) {
  var lastRow = Math.max(sheet.getLastRow(), 2);
  var maxRows = sheet.getMaxRows();
  var totalCols = 9; // A to I

  // 1. Freeze Header Row
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(0);

  // 2. Set Header Row Height & Data Row Heights
  sheet.setRowHeight(1, 46);
  for (var r = 2; r <= Math.min(lastRow, 100); r++) {
    sheet.setRowHeight(r, 44);
  }

  // 3. Header Formatting (Soft Calm Slate #F1F5F9, text #0F172A)
  var headerRange = sheet.getRange(1, 1, 1, totalCols);
  headerRange
    .setFontFamily("Roboto")
    .setFontSize(10)
    .setFontWeight("bold")
    .setFontColor("#0F172A")
    .setBackground("#F1F5F9")
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("left");

  // Center align the Status header
  sheet.getRange(1, 9).setHorizontalAlignment("center");

  // 4. Subtle Bottom Border under Header
  headerRange.setBorder(
    null, null, true, null, null, null, 
    "#CBD5E1", 
    SpreadsheetApp.BorderStyle.SOLID_MEDIUM
  );

  // 5. Global Data Range Font & Color (#334155 soft charcoal, avoids pitch black contrast)
  var fullDataRange = sheet.getRange(2, 1, maxRows - 1, totalCols);
  fullDataRange
    .setFontFamily("Roboto")
    .setFontSize(10)
    .setFontWeight("normal")
    .setFontColor("#334155");

  // 6. Column Widths & Specific Alignments (Calibrated for scannability)
  // Col 1: submittedAt
  sheet.setColumnWidth(1, 165);
  sheet.getRange(2, 1, maxRows - 1, 1)
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("left")
    .setFontColor("#64748B"); // Muted timestamp

  // Col 2: correctionType
  sheet.setColumnWidth(2, 160);
  sheet.getRange(2, 2, maxRows - 1, 1)
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("left");

  // Col 3: entityType
  sheet.setColumnWidth(3, 125);
  sheet.getRange(2, 3, maxRows - 1, 1)
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("left");

  // Col 4: entitySlug
  sheet.setColumnWidth(4, 160);
  sheet.getRange(2, 4, maxRows - 1, 1)
    .setVerticalAlignment("middle")
    .setFontWeight("bold")
    .setFontColor("#1E293B");

  // Col 5: description (Long text -> WRAP + TOP alignment for comfortable reading)
  sheet.setColumnWidth(5, 380);
  sheet.getRange(2, 5, maxRows - 1, 1)
    .setWrap(true)
    .setVerticalAlignment("top")
    .setHorizontalAlignment("left");

  // Col 6: proposedCorrection (Long text -> WRAP + TOP alignment)
  sheet.setColumnWidth(6, 380);
  sheet.getRange(2, 6, maxRows - 1, 1)
    .setWrap(true)
    .setVerticalAlignment("top")
    .setHorizontalAlignment("left");

  // Col 7: sourceUrl
  sheet.setColumnWidth(7, 180);
  sheet.getRange(2, 7, maxRows - 1, 1)
    .setWrap(false)
    .setVerticalAlignment("middle")
    .setFontColor("#2563EB");

  // Col 8: userEmail
  sheet.setColumnWidth(8, 210);
  sheet.getRange(2, 8, maxRows - 1, 1)
    .setVerticalAlignment("middle")
    .setFontColor("#475569");

  // Col 9: status (Centered badge column)
  sheet.setColumnWidth(9, 115);
  sheet.getRange(2, 9, maxRows - 1, 1)
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("center")
    .setFontWeight("bold");

  // 7. Alternating Row Colors (Zebra Striping: Pure White & Ultra-Soft Slate #F8FAFC)
  var allBandings = sheet.getBandings();
  for (var b = 0; b < allBandings.length; b++) {
    allBandings[b].remove();
  }
  var dataAndHeaderRange = sheet.getRange(1, 1, maxRows, totalCols);
  var banding = dataAndHeaderRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
  banding
    .setHeaderRowColor("#F1F5F9")
    .setFirstRowColor("#FFFFFF")
    .setSecondRowColor("#F8FAFC");

  // 8. Status Badges via Gentle Pastel Conditional Formatting
  var statusRange = sheet.getRange(2, 9, maxRows - 1, 1);
  var rules = [];

  // "Pending" -> Soft Warm Amber
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Pending")
      .setBackground("#FEF3C7")
      .setFontColor("#92400E")
      .setRanges([statusRange])
      .build()
  );

  // "Reviewed" -> Soft Sky Blue
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Reviewed")
      .setBackground("#E0F2FE")
      .setFontColor("#0369A1")
      .setRanges([statusRange])
      .build()
  );

  // "Resolved" or "Approved" -> Soft Mint Green
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Resolved")
      .setBackground("#DCFCE7")
      .setFontColor("#166534")
      .setRanges([statusRange])
      .build()
  );
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Approved")
      .setBackground("#DCFCE7")
      .setFontColor("#166534")
      .setRanges([statusRange])
      .build()
  );

  // "Rejected" -> Soft Muted Rose
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Rejected")
      .setBackground("#FEE2E2")
      .setFontColor("#991B1B")
      .setRanges([statusRange])
      .build()
  );

  sheet.setConditionalFormatRules(rules);

  // 9. Enable Filter View if not already present
  if (!sheet.getFilter()) {
    try {
      sheet.getRange(1, 1, lastRow, totalCols).createFilter();
    } catch (e) {
      // Filter creation is optional
    }
  }
}

/**
 * Formats the 'Contact' tab into a clean, calm reading layout.
 */
function applyContactStyling(sheet) {
  var lastRow = Math.max(sheet.getLastRow(), 2);
  var maxRows = sheet.getMaxRows();
  var totalCols = 5; // A to E

  // 1. Freeze Header Row
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(0);

  // 2. Set Row Heights
  sheet.setRowHeight(1, 46);
  for (var r = 2; r <= Math.min(lastRow, 100); r++) {
    sheet.setRowHeight(r, 48);
  }

  // 3. Header Formatting (#F1F5F9 slate, #0F172A text)
  var headerRange = sheet.getRange(1, 1, 1, totalCols);
  headerRange
    .setFontFamily("Roboto")
    .setFontSize(10)
    .setFontWeight("bold")
    .setFontColor("#0F172A")
    .setBackground("#F1F5F9")
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("left");

  // Center align Status header
  sheet.getRange(1, 5).setHorizontalAlignment("center");

  // 4. Header Bottom Border
  headerRange.setBorder(
    null, null, true, null, null, null, 
    "#CBD5E1", 
    SpreadsheetApp.BorderStyle.SOLID_MEDIUM
  );

  // 5. Global Data Font
  var fullDataRange = sheet.getRange(2, 1, maxRows - 1, totalCols);
  fullDataRange
    .setFontFamily("Roboto")
    .setFontSize(10)
    .setFontWeight("normal")
    .setFontColor("#334155");

  // 6. Column Widths & Alignments
  // Col 1: submittedAt
  sheet.setColumnWidth(1, 165);
  sheet.getRange(2, 1, maxRows - 1, 1)
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("left")
    .setFontColor("#64748B");

  // Col 2: subject (Semi-bold for instant recognition)
  sheet.setColumnWidth(2, 230);
  sheet.getRange(2, 2, maxRows - 1, 1)
    .setVerticalAlignment("top")
    .setFontWeight("bold")
    .setFontColor("#1E293B");

  // Col 3: message (Wide + WRAP + TOP alignment)
  sheet.setColumnWidth(3, 520);
  sheet.getRange(2, 3, maxRows - 1, 1)
    .setWrap(true)
    .setVerticalAlignment("top")
    .setHorizontalAlignment("left");

  // Col 4: userEmail
  sheet.setColumnWidth(4, 220);
  sheet.getRange(2, 4, maxRows - 1, 1)
    .setVerticalAlignment("middle")
    .setFontColor("#475569");

  // Col 5: status (Centered badge column)
  sheet.setColumnWidth(5, 115);
  sheet.getRange(2, 5, maxRows - 1, 1)
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("center")
    .setFontWeight("bold");

  // 7. Alternating Row Colors
  var allBandings = sheet.getBandings();
  for (var b = 0; b < allBandings.length; b++) {
    allBandings[b].remove();
  }
  var dataAndHeaderRange = sheet.getRange(1, 1, maxRows, totalCols);
  var banding = dataAndHeaderRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
  banding
    .setHeaderRowColor("#F1F5F9")
    .setFirstRowColor("#FFFFFF")
    .setSecondRowColor("#F8FAFC");

  // 8. Status Badges via Gentle Pastel Conditional Formatting
  var statusRange = sheet.getRange(2, 5, maxRows - 1, 1);
  var rules = [];

  // "Unread" -> Soft Gentle Indigo (distinct, calm, catches attention without harsh alarm)
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Unread")
      .setBackground("#EEF2FF")
      .setFontColor("#4338CA")
      .setRanges([statusRange])
      .build()
  );

  // "Replied" or "Reviewed" -> Soft Mint Green
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Replied")
      .setBackground("#DCFCE7")
      .setFontColor("#166534")
      .setRanges([statusRange])
      .build()
  );
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Reviewed")
      .setBackground("#DCFCE7")
      .setFontColor("#166534")
      .setRanges([statusRange])
      .build()
  );

  // "Archived" -> Soft Muted Neutral Slate
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Archived")
      .setBackground("#F1F5F9")
      .setFontColor("#64748B")
      .setRanges([statusRange])
      .build()
  );

  sheet.setConditionalFormatRules(rules);

  // 9. Enable Filter View
  if (!sheet.getFilter()) {
    try {
      sheet.getRange(1, 1, lastRow, totalCols).createFilter();
    } catch (e) {
      // Filter creation is optional
    }
  }
}
