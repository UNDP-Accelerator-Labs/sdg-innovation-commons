# Anti-Bot Protection Testing Guide

## Overview
This document describes the anti-bot protection measures implemented in the SDG Commons platform and how to test them.

## Implementation Details

### Protection Mechanisms

#### 1. Honeypot Field Protection
A hidden `website` field is added to both Contact Us and Registration forms:
- **Hidden from humans**: Positioned off-screen using CSS (absolute position with left: -9999px)
- **Visible to bots**: HTML structure is intact, bots typically fill all fields
- **Validation**: If the field contains any value, the submission is rejected silently

#### 2. Time-Based Validation
A timestamp is recorded when the form loads:
- **Contact Form**: Minimum 3 seconds required before submission
- **Registration Form**: Minimum 5 seconds required before submission
- **Rationale**: Bots typically submit forms instantly; humans need time to read and fill forms

### Files Modified

1. **app/lib/data/contact-us.ts**
   - Added honeypot and timestamp fields to Zod schema
   - Validation logic checks honeypot field
   - Time-based validation (3 second minimum)

2. **app/ui/components/Contact/index.tsx**
   - Added hidden honeypot field (`website`)
   - Added hidden timestamp field (`formLoadTime`)
   - Timestamp recorded on component mount

3. **app/lib/data/platform-api.ts**
   - Added bot detection logic in `registerContributor()` function
   - Checks honeypot field
   - Time-based validation (5 second minimum)

4. **app/ui/components/Register/index.tsx**
   - Added hidden honeypot field with onChange handler
   - Added timestamp tracking
   - Honeypot value added to form state

## Testing Instructions

### Manual Testing

#### Test 1: Normal User Submission (Should Pass)
**Contact Form:**
1. Navigate to the Contact Us page
2. Wait at least 3 seconds
3. Fill in all required fields with valid data
4. Submit the form
5. **Expected**: Success message displayed, emails sent to admin and user

**Registration Form:**
1. Navigate to the Registration page
2. Wait at least 5 seconds
3. Fill in all required fields with valid data
4. Submit the form
5. **Expected**: Success message, redirect to login page, admin notified

#### Test 2: Bot Detection - Honeypot Field (Should Fail)
**Contact Form:**
1. Open browser developer tools
2. Navigate to Contact Us page
3. In console, execute:
   ```javascript
   document.querySelector('input[name="website"]').value = 'http://spam.com';
   ```
4. Fill in form normally and submit
5. **Expected**: Generic error message, no email sent

**Registration Form:**
1. Open browser developer tools
2. Navigate to Registration page
3. In console, execute:
   ```javascript
   document.querySelector('input[name="website"]').value = 'http://bot.com';
   ```
4. Fill in form normally and submit
5. **Expected**: Error message, registration fails, no email sent

#### Test 3: Bot Detection - Time-Based (Should Fail)
**Contact Form:**
1. Navigate to Contact Us page
2. **Immediately** (within 3 seconds) fill in the form with valid data
3. Submit immediately
4. **Expected**: Generic error message, no email sent

**Registration Form:**
1. Navigate to Registration page
2. **Immediately** (within 5 seconds) fill in the form with valid data
3. Submit immediately
4. **Expected**: Error message, registration fails

### Automated Bot Testing

#### Simulating a Basic Bot
```javascript
// This would be blocked by the honeypot protection
async function botSubmitContact() {
  const form = document.querySelector('form');
  const data = new FormData(form);
  
  // Bot fills all fields including honeypot
  data.set('name', 'Bot Name');
  data.set('surname', 'Bot Surname');
  data.set('email', 'bot@example.com');
  data.set('org', 'Bot Organization');
  data.set('reason', 'Other');
  data.set('message', 'Spam message');
  data.set('website', 'http://spam.com'); // Honeypot filled
  
  // Submit - should be blocked
  form.submit();
}
```

#### Simulating a Fast Bot
```javascript
// This would be blocked by time-based validation
async function fastBotSubmit() {
  // Load form and submit immediately
  const form = document.querySelector('form');
  const data = new FormData(form);
  
  data.set('name', 'Fast Bot');
  data.set('surname', 'Quick');
  data.set('email', 'fastbot@example.com');
  data.set('org', 'Spam Inc');
  data.set('reason', 'Other');
  data.set('message', 'Quick spam');
  // Don't fill honeypot
  
  // Submit within 1 second - should be blocked
  form.submit();
}
```

## Monitoring & Logging

Bot detection attempts are logged to the console:
- `"Bot detected: honeypot field filled"` - Honeypot triggered
- `"Bot detected: form submitted too quickly"` - Time validation triggered

In production, monitor server logs for these warnings to track bot activity.

## Limitations & Future Enhancements

### Current Limitations
1. **Sophisticated Bots**: Advanced bots that analyze CSS and wait appropriate times may bypass these protections
2. **JavaScript Disabled**: Users with JavaScript disabled won't be affected by time validation (form will submit normally)
3. **No Rate Limiting**: Same IP can make multiple attempts

### Recommended Future Enhancements
1. **Rate Limiting**: Add IP-based rate limiting
2. **CAPTCHA Fallback**: Add CAPTCHA for suspected bot behavior
3. **Cloudflare Turnstile**: Consider adding Cloudflare Turnstile for advanced protection
4. **Analytics**: Track and analyze bot detection rates
5. **Email Verification**: Require email verification for registrations

## Rollback Plan

If bot protection causes issues with legitimate users:

1. **Quick Fix**: Reduce time thresholds:
   - Contact form: 3s → 1s
   - Registration: 5s → 2s

2. **Disable Protection**: Comment out validation blocks in:
   - `app/lib/data/contact-us.ts` (lines 54-88)
   - `app/lib/data/platform-api.ts` (lines 414-437)

3. **Remove Fields**: Remove honeypot fields from UI components if needed

## Success Metrics

Monitor these metrics to evaluate effectiveness:
1. **Reduction in spam submissions** (compare before/after)
2. **False positives** (legitimate users blocked)
3. **Bot detection rate** (check server logs)
4. **User complaints** (any reports of submission issues)

## Support

For issues or questions:
1. Check server logs for error messages
2. Review browser console for JavaScript errors
3. Verify form submission timing with user
4. Check if honeypot field is somehow visible to users
