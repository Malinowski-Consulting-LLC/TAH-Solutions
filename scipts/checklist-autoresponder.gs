/**
 * Malinowski Consulting, LLC - 2026
 * TAH Solutions — Checklist auto-responder
 * Triggered by every new Google Form submission. Emails the PDF
 * (TAH_Solutions_Protocol_Gap_Audit_Checklist_June26.pdf) to the
 * submitter using the email they entered in the form.
 *
 * ────────────────────────────────────────────────────────────────
 * INSTALLATION
 * ────────────────────────────────────────────────────────────────
 * 1. Open the linked Google Sheet for the checklist form
 * 2. Extensions → Apps Script
 * 3. Delete any existing code, paste this entire file
 * 4. Ctrl/Cmd+S to save (no Deploy needed for trigger scripts)
 * 5. Click the clock icon (⏰) on the left sidebar → Triggers
 * 6. + Add Trigger:
 *      Function:    onFormSubmit
 *      Deployment:  Head
 *      Event:       From spreadsheet → On form submit
 * 7. Save → authorize (Advanced → Go to project (unsafe) → Allow)
 *
 * ────────────────────────────────────────────────────────────────
 * SENDER SETUP (one-time, in Gmail)
 * ────────────────────────────────────────────────────────────────
 * MailApp uses whichever account owns this script. To send FROM
 * info@tahsolutions.com specifically:
 *
 *   1. Sign in to the Google account that owns this Sheet
 *   2. Gmail → Settings (⚙️) → See all settings → Accounts → "Send mail as"
 *   3. "Add another email address" → info@tahsolutions.com
 *   4. Choose "Send through Gmail" (easiest) or "Send through SMTP"
 *   5. Verify the address via the confirmation email
 *
 * Then update FROM_ADDRESS below to "info@tahsolutions.com".
 * Reply-To is set separately so recipients can reply to whichever
 * inbox you actually monitor.
 *
 * ────────────────────────────────────────────────────────────────
 * FORM FIELD NAMES (must match exactly)
 * ────────────────────────────────────────────────────────────────
 *   Full Name, Email, Agency Name, Role / Title
 */

const FROM_ADDRESS = ''; // Leave blank to use script owner. Set to "info@tahsolutions.com" after Gmail alias verification.
const REPLY_TO     = 'tanner@tahsolutions.com';

function onFormSubmit(e) {
  try {
    const values = e.namedValues || {};
    const name    = (values['Full Name']    && values['Full Name'][0])    || 'there';
    const email   =  values['Email']        && values['Email'][0];
    const agency  = (values['Agency Name']  && values['Agency Name'][0])  || '';
    const role    = (values['Role / Title'] && values['Role / Title'][0]) || '';

    if (!email) {
      Logger.log('No email provided; skipping send.');
      return;
    }

    // PDF — must be shared as "Anyone with the link can view"
    const pdfId = '1j3BAAATVYr4nSGrIHOjQ7JdPLx7Kvxwo';
    const pdfBlob = DriveApp.getFileById(pdfId).getBlob().copyBlob()
      .setName('TAH_Solutions_Protocol_Gap_Audit_Checklist.pdf');

    const subject = 'Your TAH Solutions Protocol Gap Audit Checklist';

    const body = [
      `Hi ${name},`,
      '',
      'Thanks for downloading the Protocol Gap Audit Checklist. Attached is your copy.',
      '',
      'The checklist takes about 10 minutes to complete. As you work through it, jot down any questions that come up. We can walk through your results together in a free 30-minute consultation:',
      'https://tahsolutions.com/contact',
      '',
      agency ? `Agency on file: ${agency}` : '',
      role   ? `Role on file: ${role}`     : '',
      '',
      '—',
      'Tanner Gurtner',
      'TAH Solutions',
      'tahsolutions.com',
    ].filter(Boolean).join('\n');

    // Plain text body for the email
    const htmlBody = body
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');

    const opts = {
      to: email,
      subject: subject,
      body: body,
      htmlBody: htmlBody,
      attachments: [pdfBlob],
      replyTo: REPLY_TO,
    };

    if (FROM_ADDRESS) {
      // Sends as the verified alias. Requires "Send mail as" to be set up in Gmail.
      opts.from = FROM_ADDRESS;
      opts.name = 'TAH Solutions';
    }

    MailApp.sendEmail(opts);
    Logger.log('Checklist emailed to: ' + email + ' (from: ' + (FROM_ADDRESS || Session.getActiveUser().getEmail()) + ')');
  } catch (err) {
    Logger.log('Error: ' + err.message + ' | Stack: ' + (err.stack || 'n/a'));
  }
}
