function doPost(e) {
  console.log('=== SCRIPT EXECUTION STARTED ===');
  console.log('Request received at:', new Date().toISOString());
  
  try {
    console.log('Raw parameters received:', JSON.stringify(e.parameter));
    
    var spreadsheet = SpreadsheetApp.openById('1J79a68jGtJOpT4UqIui2xQ05Y_G1U20wFVH4vi1RKtQ');
    var data = e.parameter;
    var formType = data.form_type || 'wedding';
    
    console.log('Form type determined:', formType);
    console.log('Primary name:', data.primary_name || 'NOT PROVIDED');
    
    // Bot protection: Check honeypot field
    console.log('Checking honeypot field. botcheck value:', data.botcheck);
    if (data.botcheck && data.botcheck !== '') {
      console.log('Bot detected: honeypot field filled');
      return ContentService.createTextOutput(JSON.stringify({success: false, error: 'Submission rejected'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    console.log('Honeypot check passed');
    
    // Rate limiting: Check for rapid submissions from same name
    var primaryName = data.primary_name || '';
    console.log('Checking rate limiting for:', primaryName);
    if (primaryName && isRapidSubmission(spreadsheet, primaryName, formType)) {
      console.log('Rate limit exceeded for: ' + primaryName);
      return ContentService.createTextOutput(JSON.stringify({success: false, error: 'Please wait before submitting again'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    console.log('Rate limiting check passed');
    
    // Create or get the appropriate sheet based on form type
    var sheetName = formType === 'after_party' ? 'After Party RSVPs' : 'Wedding RSVPs';
    var sheet = getOrCreateSheet(spreadsheet, sheetName, formType);
    
    if (formType === 'wedding') {
      console.log('Processing WEDDING RSVP');
      // Handle Wedding RSVP
      var row = [
        new Date(), // Timestamp
        data.primary_name || '',
        data.attendance || ''
      ];
      
      // Add separate columns for adults and children counts
      var adultCount = parseInt(data.adults || 0);
      var childrenUnder5 = parseInt(data.children_under_5 || 0);
      var children5Plus = parseInt(data.children_5_plus || 0);
      
      row.push(adultCount);
      row.push(childrenUnder5);
      row.push(children5Plus);
      
      // Calculate total guest count
      var totalGuests = adultCount + childrenUnder5 + children5Plus;
      row.push(totalGuests);
      
      // Collect all adult names and combine into one column
      var adultNames = [];
      for (var i = 1; i <= 10; i++) {
        var adultName = data['adult_' + i] || '';
        if (adultName) {
          adultNames.push(adultName);
        }
      }
      row.push(adultNames.join(', '));
      
      sheet.appendRow(row);
      console.log('Wedding RSVP data saved to sheet');
      
      // Send immediate wedding RSVP email notification
      console.log('About to send wedding RSVP email...');
      sendEmailNotification('wedding', data);
      console.log('Wedding email notification function called');
      
    } else if (formType === 'after_party') {
      console.log('Processing AFTER PARTY RSVP');
      // Handle After Party RSVP
      var row = [
        new Date(), // Timestamp
        data.primary_name || '',
        data.after_party_attendance || ''
      ];
      
      // Add separate columns for adults (after party is 21+, so no children)
      var adultCount = parseInt(data.after_party_adults || 0);
      row.push(adultCount);
      
      // Collect all guest names and combine into one column
      var guestNames = [];
      for (var i = 1; i <= 10; i++) {
        var guestName = data['after_party_guest_' + i] || '';
        if (guestName) {
          guestNames.push(guestName);
        }
      }
      row.push(guestNames.join(', '));
      
      sheet.appendRow(row);
      console.log('After party RSVP data saved to sheet');
      
      // Send immediate after-party RSVP email notification
      console.log('About to send after-party RSVP email...');
      sendEmailNotification('after_party', data);
      console.log('After-party email notification function called');
    } else {
      console.log('Unknown form type:', formType);
    }
    
    console.log('Preparing response...');
    var response = ContentService.createTextOutput(JSON.stringify({success: true, formType: formType}))
      .setMimeType(ContentService.MimeType.JSON);
    console.log('=== SCRIPT EXECUTION COMPLETED SUCCESSFULLY ===');
    return response;
      
  } catch (error) {
    console.error('=== SCRIPT EXECUTION FAILED ===');
    console.error('Error details:', error.toString());
    console.error('Stack trace:', error.stack);
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
      // Create headers with separate columns for different age groups
      var headers = [
        'Timestamp',
        'Primary Name', 
        'Attendance',
        'Adults Count',
        'Children Under 5 (No Seat)',
        'Children 5+ (Seat Provided)', 
        'Total Guests',
        'Adult Names'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
    } else if (formType === 'after_party') {
      var headers = [
        'Timestamp',
        'Primary Name',
        'After Party Attendance',
        'Adults 21+ Count',
        'Guest Names'
      ];
      
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

function isRapidSubmission(spreadsheet, primaryName, formType) {
  try {
    var sheetName = formType === 'after_party' ? 'After Party RSVPs' : 'Wedding RSVPs';
    var sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) return false;
    
    var now = new Date();
    var fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes ago
    
    var data = sheet.getDataRange().getValues();
    var recentSubmissions = 0;
    
    // Skip header row, check last 20 rows for performance
    var startRow = Math.max(1, data.length - 20);
    
    for (var i = startRow; i < data.length; i++) {
      var timestamp = data[i][0];
      var name = data[i][1];
      
      if (timestamp instanceof Date && 
          timestamp > fiveMinutesAgo && 
          name === primaryName) {
        recentSubmissions++;
        if (recentSubmissions >= 2) {
          return true; // More than 1 submission in 5 minutes
        }
      }
    }
    
    return false;
  } catch (error) {
    console.log('Rate limiting check failed: ' + error.toString());
    return false; // Don't block on error
  }
}

function sendCombinedEmailNotification(spreadsheet, primaryName) {
  try {
    console.log('Starting email notification for: ' + primaryName);
    
    // Configure your notification email here
    var notificationEmail = 'melvin.abzun.dev@gmail.com';
    console.log('Notification email: ' + notificationEmail);
    
    // Get both wedding and after-party data
    var weddingData = getLatestSubmission(spreadsheet, 'Wedding RSVPs', primaryName);
    var afterPartyData = getLatestSubmission(spreadsheet, 'After Party RSVPs', primaryName);
    
    console.log('Wedding data found: ' + (weddingData ? 'Yes' : 'No'));
    console.log('After party data found: ' + (afterPartyData ? 'Yes' : 'No'));
    
    var subject = '💒🎉 Complete RSVP Received - ' + primaryName;
    
    var body = 'Complete RSVP Response Received!\n\n';
    body += '👤 Guest: ' + primaryName + '\n';
    body += '📅 Completed: ' + new Date().toLocaleString() + '\n\n';
    
    // Wedding RSVP Section
    if (weddingData) {
      body += '💒 WEDDING RSVP\n';
      body += '═══════════════════\n';
      body += '✅ Attendance: ' + (weddingData.attendance || 'Not specified') + '\n';
      
      if (weddingData.attendance && weddingData.attendance.toLowerCase() === 'yes') {
        var totalGuests = parseInt(weddingData.adults || 0) + parseInt(weddingData.children_under_5 || 0) + parseInt(weddingData.children_5_plus || 0);
        body += '👥 Total Guests: ' + totalGuests + '\n';
        body += '   - Adults: ' + (weddingData.adults || '0') + '\n';
        body += '   - Children Under 5: ' + (weddingData.children_under_5 || '0') + '\n';
        body += '   - Children 5+: ' + (weddingData.children_5_plus || '0') + '\n';
        
        // Add adult names if provided
        var adultNames = [];
        for (var i = 1; i <= 10; i++) {
          var adultName = weddingData['adult_' + i] || '';
          if (adultName) {
            adultNames.push(adultName);
          }
        }
        if (adultNames.length > 0) {
          body += '📝 Adult Names: ' + adultNames.join(', ') + '\n';
        }
      }
    } else {
      body += '💒 WEDDING RSVP: Not found\n';
    }
    
    body += '\n';
    
    // After Party Section
    if (afterPartyData) {
      body += '🎉 AFTER PARTY RSVP\n';
      body += '═══════════════════\n';
      body += '🎊 Attendance: ' + (afterPartyData.after_party_attendance || 'Not specified') + '\n';
      
      if (afterPartyData.after_party_attendance && afterPartyData.after_party_attendance.toLowerCase() === 'yes') {
        body += '👥 Adults 21+: ' + (afterPartyData.after_party_adults || '0') + '\n';
        
        // Add guest names if provided
        var guestNames = [];
        for (var i = 1; i <= 10; i++) {
          var guestName = afterPartyData['after_party_guest_' + i] || '';
          if (guestName) {
            guestNames.push(guestName);
          }
        }
        if (guestNames.length > 0) {
          body += '📝 Guest Names: ' + guestNames.join(', ') + '\n';
        }
      }
    } else {
      body += '🎉 AFTER PARTY RSVP: Not found\n';
    }
    
    body += '\n📊 View all responses: https://docs.google.com/spreadsheets/d/1J79a68jGtJOpT4UqIui2xQ05Y_G1U20wFVH4vi1RKtQ';
    
    console.log('About to send email with subject: ' + subject);
    console.log('Email body length: ' + body.length);
    
    GmailApp.sendEmail(notificationEmail, subject, body);
    
    console.log('Email sent successfully');
    
  } catch (error) {
    console.error('Email notification failed: ' + error.toString());
    console.error('Stack trace: ' + error.stack);
    // Don't throw error - submission should still succeed even if email fails
  }
}

function getLatestSubmission(spreadsheet, sheetName, primaryName) {
  try {
    var sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) return null;
    
    var data = sheet.getDataRange().getValues();
    
    // Search from bottom up for latest submission from this person
    for (var i = data.length - 1; i > 0; i--) { // Start from last row, skip header
      var name = data[i][1]; // Primary name is in column B (index 1)
      if (name === primaryName) {
        // Found the submission, convert row to object
        var headers = data[0];
        var submission = {};
        
        // Map basic fields
        submission.timestamp = data[i][0];
        submission.primary_name = data[i][1];
        
        if (sheetName === 'Wedding RSVPs') {
          submission.attendance = data[i][2];
          submission.adults = data[i][3];
          submission.children_under_5 = data[i][4];
          submission.children_5_plus = data[i][5];
          // Adult names are in the last column as a string
          var adultNamesString = data[i][7] || '';
          var adultNamesArray = adultNamesString.split(', ').filter(function(name) { return name.trim() !== ''; });
          for (var j = 0; j < adultNamesArray.length && j < 10; j++) {
            submission['adult_' + (j + 1)] = adultNamesArray[j];
          }
        } else if (sheetName === 'After Party RSVPs') {
          submission.after_party_attendance = data[i][2];
          submission.after_party_adults = data[i][3];
          // Guest names are in the last column as a string
          var guestNamesString = data[i][4] || '';
          var guestNamesArray = guestNamesString.split(', ').filter(function(name) { return name.trim() !== ''; });
          for (var j = 0; j < guestNamesArray.length && j < 10; j++) {
            submission['after_party_guest_' + (j + 1)] = guestNamesArray[j];
          }
        }
        
        return submission;
      }
    }
    
    return null;
  } catch (error) {
    console.log('Error getting latest submission: ' + error.toString());
    return null;
  }
}

function sendEmailNotification(formType, data) {
  try {
    console.log('Starting ' + formType + ' email notification');
    console.log('Email data received:', JSON.stringify(data));
    
    // Configure your notification email here
    var notificationEmail = 'jesus.barragan.dev@gmail.com';
    console.log('Sending to:', notificationEmail);
    
    var subject = formType === 'after_party' 
      ? 'After Party RSVP - ' + (data.primary_name || 'Unknown')
      : 'Wedding RSVP - ' + (data.primary_name || 'Unknown');
    
    var body = '';
    
    if (formType === 'wedding') {
      console.log('Preparing wedding email body...');
      var totalGuests = parseInt(data.adults || 0) + parseInt(data.children_under_5 || 0) + parseInt(data.children_5_plus || 0);
      
      body = 'New Wedding RSVP Received!\n\n' +
             'Primary Name: ' + (data.primary_name || 'Not provided') + '\n' +
             'Attendance: ' + (data.attendance || 'Not specified') + '\n' +
             'Total Guests: ' + totalGuests + '\n' +
             '   - Adults: ' + (data.adults || '0') + '\n' +
             '   - Children Under 5: ' + (data.children_under_5 || '0') + '\n' +
             '   - Children 5+: ' + (data.children_5_plus || '0') + '\n\n';
      
      // Add adult names if provided
      var adultNames = [];
      for (var i = 1; i <= 10; i++) {
        var adultName = data['adult_' + i] || '';
        if (adultName) {
          adultNames.push(adultName);
        }
      }
      if (adultNames.length > 0) {
        body += 'Adult Names: ' + adultNames.join(', ') + '\n';
      }
      
    } else if (formType === 'after_party') {
      console.log('Preparing after-party email body...');
      body = 'New After Party RSVP Received!\n\n' +
             'Primary Name: ' + (data.primary_name || 'Not provided') + '\n' +
             'After Party Attendance: ' + (data.after_party_attendance || 'Not specified') + '\n' +
             'Adults 21+: ' + (data.after_party_adults || '0') + '\n\n';
      
      // Add guest names if provided
      var guestNames = [];
      for (var i = 1; i <= 10; i++) {
        var guestName = data['after_party_guest_' + i] || '';
        if (guestName) {
          guestNames.push(guestName);
        }
      }
      if (guestNames.length > 0) {
        body += 'Guest Names: ' + guestNames.join(', ') + '\n';
      }
    }
    
    body += '\nSubmitted: ' + new Date().toLocaleString() + '\n' +
            'View responses: https://docs.google.com/spreadsheets/d/1J79a68jGtJOpT4UqIui2xQ05Y_G1U20wFVH4vi1RKtQ';
    
    console.log('About to send email with subject:', subject);
    console.log('Body length:', body.length);
    
    GmailApp.sendEmail(notificationEmail, subject, body);
    
    console.log('Email sent successfully for', formType);
    
  } catch (error) {
    console.error('Email notification failed for ' + formType + ':', error.toString());
    console.error('Stack trace:', error.stack);
    // Don't throw error - submission should still succeed even if email fails
  }
}