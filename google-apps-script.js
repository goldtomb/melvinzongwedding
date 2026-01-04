function doPost(e) {
  try {
    var spreadsheet = SpreadsheetApp.openById('1J79a68jGtJOpT4UqIui2xQ05Y_G1U20wFVH4vi1RKtQ');
    var data = e.parameter;
    var formType = data.form_type || 'wedding';
    
    // Create or get the appropriate sheet based on form type
    var sheetName = formType === 'after_party' ? 'After Party RSVPs' : 'Wedding RSVPs';
    var sheet = getOrCreateSheet(spreadsheet, sheetName, formType);
    
    if (formType === 'wedding') {
      // Handle Wedding RSVP
      var row = [
        new Date(), // Timestamp
        data.primary_name || '',
        data.attendance || ''
      ];
      
      // Add separate columns for adults and children
      var adultCount = parseInt(data.adults || 0);
      var childrenCount = parseInt(data.children || 0);
      row.push(adultCount);
      row.push(childrenCount);
      
      // Add individual adult names in separate columns (up to 10 columns)
      for (var i = 1; i <= 10; i++) {
        var adultName = data['adult_' + i] || '';
        row.push(adultName);
      }
      
      sheet.appendRow(row);
      
    } else if (formType === 'after_party') {
      // Handle After Party RSVP
      var row = [
        new Date(), // Timestamp
        data.primary_name || '',
        data.after_party_attendance || ''
      ];
      
      // Add separate columns for adults (after party is 21+, so no children)
      var adultCount = parseInt(data.after_party_adults || 0);
      row.push(adultCount);
      
      // Add individual adult names in separate columns (up to 10 columns)
      for (var i = 1; i <= 10; i++) {
        var adultName = data['after_party_guest_' + i] || '';
        row.push(adultName);
      }
      
      sheet.appendRow(row);
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: true, formType: formType}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet(spreadsheet, sheetName, formType) {
  var sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    // Create new sheet
    sheet = spreadsheet.insertSheet(sheetName);
    
    // Set up headers based on form type
    if (formType === 'wedding') {
      // Create headers with individual columns for adults and children
      var headers = [
        'Timestamp',
        'Primary Name', 
        'Attendance',
        'Adults Count',
        'Children Count'
      ];
      
      // Add individual adult columns (up to 10 adults)
      for (var i = 1; i <= 10; i++) {
        headers.push('Adult Guest ' + i);
      }
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
    } else if (formType === 'after_party') {
      var headers = [
        'Timestamp',
        'Primary Name',
        'After Party Attendance',
        'Adults 21+ Count'
      ];
      
      // Add individual after party guest columns (up to 10 guests)
      for (var i = 1; i <= 10; i++) {
        headers.push('Guest ' + i);
      }
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    // Format headers
    var headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, sheet.getLastColumn());
  }
  
  return sheet;
}