# Code Examples - Anti-Bot Protection Implementation

## Frontend Implementation

### Contact Form (app/ui/components/Contact/index.tsx)

```typescript
export default function Contact() {
    const [loading, setLoading] = useState<boolean>(false);
    // ↓ Capture form load timestamp
    const [formLoadTime] = useState<number>(Date.now());

    const initialState: ContactState = { message: null, errors: {}, isSubmited: false };
    const [state, formAction] = useActionState(createContact, initialState);
    
    // ... component code ...

    return (
        <form action={handleForm} className='lg:grid lg:grid-cols-2 lg:gap-[20px]'>
            {/* ↓ HONEYPOT FIELD - Invisible to users, visible to bots */}
            <input
                type='text'
                name='website'
                tabIndex={-1}
                autoComplete='off'
                style={{
                    position: 'absolute',
                    left: '-9999px',    // Off-screen positioning
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden'
                }}
                aria-hidden='true'      // Screen reader ignores
            />
            
            {/* ↓ TIMESTAMP FIELD - For time-based validation */}
            <input
                type='hidden'
                name='formLoadTime'
                value={formLoadTime}
            />
            
            {/* Normal form fields follow... */}
            <input type='text' name='name' placeholder='Name' />
            <input type='text' name='surname' placeholder='Surname' />
            <input type='email' name='email' placeholder='Email' />
            {/* ... */}
        </form>
    );
}
```

### Registration Form (app/ui/components/Register/index.tsx)

```typescript
export default function RegisterForm({ countries }: RegisterFormProps) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        organization: "",
        role: "",
        country: "",
        position: "",
        website: "", // ↓ Honeypot field in state
    })
    
    // ↓ Capture form load timestamp
    const [formLoadTime] = useState<number>(Date.now());

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const data = { 
            ...formData, 
            new_name: `${formData.firstName} ${formData.lastName}`, 
            // ... other fields ...
            formLoadTime: formLoadTime, // ↓ Send timestamp for validation
        };

        const response = await registerContributor({ ...data });
        // ... handle response ...
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* ↓ HONEYPOT FIELD - Hidden from view */}
            <input
                type='text'
                name='website'
                tabIndex={-1}
                autoComplete='off'
                style={{
                    position: 'absolute',
                    left: '-9999px',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden'
                }}
                aria-hidden='true'
                onChange={(e) => {
                    // ↓ If bot fills this, capture in state
                    setFormData((prev) => ({ ...prev, website: e.target.value }));
                }}
            />
            
            {/* Normal form fields follow... */}
            <input id="firstName" name="firstName" type="text" />
            <input id="lastName" name="lastName" type="text" />
            {/* ... */}
        </form>
    );
}
```

---

## Backend Implementation

### Contact Form Backend (app/lib/data/contact-us.ts)

```typescript
// ↓ Zod schema includes honeypot and timestamp (optional)
const ContactSchema = z.object({
  name: z.string().min(1, 'Please provide your name'),
  surname: z.string().min(1, 'Please provide your surname.'),
  email: z.string().email('Please provide a valid email.'),
  org: z.string().min(1, 'Please provide your organization.'),
  reason: z.string().min(1, 'Please select your reason for contact.'),
  message: z.string().min(1, 'Please provide your message.'),
  date: z.string().optional(),
  website: z.string().optional(),        // ↓ Honeypot field
  formLoadTime: z.string().optional(),   // ↓ Timestamp field
});

// ↓ Omit honeypot and timestamp from validation (checked separately)
const CreateContact = ContactSchema.omit({ 
  date: true, 
  website: true, 
  formLoadTime: true 
});

export async function createContact(
  prevState: ContactState, 
  formData: FormData
): Promise<ContactState> {
  
  let newState: ContactState = { ...prevState, isSubmited: false };

  // ========================================
  // ANTI-BOT PROTECTION: Check honeypot
  // ========================================
  const honeypot = formData.get('website');
  if (honeypot && honeypot !== '') {
    // ↓ Bot filled the honeypot field!
    console.warn('Bot detected: honeypot field filled');
    return {
      ...newState,
      isSubmited: false,
      success: false,
      message: 'Error: Failed to submit message.', // ↓ Generic error
    };
  }

  // ========================================
  // ANTI-BOT PROTECTION: Time validation
  // ========================================
  const formLoadTime = formData.get('formLoadTime');
  if (formLoadTime) {
    const loadTime = parseInt(formLoadTime as string, 10);
    const currentTime = Date.now();
    const timeDiff = currentTime - loadTime;
    
    // ↓ Form submitted in less than 3 seconds = likely bot
    if (timeDiff < 3000) {
      console.warn('Bot detected: form submitted too quickly');
      return {
        ...newState,
        isSubmited: false,
        success: false,
        message: 'Error: Failed to submit message.', // ↓ Generic error
      };
    }
  }

  // ========================================
  // Normal validation continues...
  // ========================================
  const validatedFields = CreateContact.safeParse({
    name: formData.get('name'),
    surname: formData.get('surname'),
    email: formData.get('email'),
    org: formData.get('org'),
    reason: formData.get('reason'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      ...newState,
      isSubmited: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to submit message.',
    };
  }

  // ↓ Process valid submission (send emails, etc.)
  // ...
}
```

### Registration Backend (app/lib/data/platform-api.ts)

```typescript
export async function registerContributor(forms: Record<string, any>) {
  
  // ========================================
  // ANTI-BOT PROTECTION: Check honeypot
  // ========================================
  if (forms.website && forms.website !== '') {
    // ↓ Bot filled the honeypot field!
    console.warn('Bot detected: honeypot field filled');
    return {
      status: 400,
      message: 'Registration failed. Please try again.', // ↓ Generic error
    };
  }

  // ========================================
  // ANTI-BOT PROTECTION: Time validation
  // ========================================
  if (forms.formLoadTime) {
    const loadTime = parseInt(forms.formLoadTime, 10);
    const currentTime = Date.now();
    const timeDiff = currentTime - loadTime;
    
    // ↓ Form submitted in less than 5 seconds = likely bot
    if (timeDiff < 5000) {
      console.warn('Bot detected: form submitted too quickly');
      return {
        status: 400,
        message: 'Registration failed. Please try again.', // ↓ Generic error
      };
    }
  }

  // ========================================
  // Normal registration process continues...
  // ========================================
  const base_url = commonsPlatform.find((p) => p.key === 'login')?.url;
  
  const url = `${base_url}/save/contributor`;
  const body = {
    ...forms,
    fromBaseHost: true,
  };

  const data = await get({ url, method: 'POST', body });
  
  // ↓ Send admin notification email, etc.
  // ...
  
  return data;
}
```

---

## How Bot Detection Works

### Scenario 1: Legitimate User ✅

```
User Journey:
1. Loads form             → timestamp = 1000
2. Reads content (5s)     → ...
3. Fills visible fields   → ...
4. Submits form           → timestamp = 6000

Server Validation:
✓ honeypot empty?         → YES (user didn't see it)
✓ timeDiff >= 3000ms?     → YES (6000 - 1000 = 5000ms)
✓ fields valid?           → YES

Result: ✅ SUBMISSION ACCEPTED
```

### Scenario 2: Auto-Fill Bot ❌

```
Bot Journey:
1. Loads form             → timestamp = 1000
2. Auto-fills ALL fields  → website = "http://spam.com" ⚠️
3. Submits immediately    → timestamp = 1050

Server Validation:
✗ honeypot empty?         → NO (bot filled it) 🚨
→ Skip other checks

Result: ❌ BOT DETECTED → REJECTED
Log: "Bot detected: honeypot field filled"
```

### Scenario 3: Fast Bot (no honeypot fill) ❌

```
Bot Journey:
1. Loads form             → timestamp = 1000
2. Fills only visible     → ...
3. Submits immediately    → timestamp = 1500

Server Validation:
✓ honeypot empty?         → YES
✗ timeDiff >= 3000ms?     → NO (1500 - 1000 = 500ms) 🚨

Result: ❌ BOT DETECTED → REJECTED
Log: "Bot detected: form submitted too quickly"
```

---

## Testing Code Snippets

### Test 1: Verify Honeypot Field Exists

```javascript
// Open browser console on Contact form
const honeypot = document.querySelector('input[name="website"]');
console.log('Honeypot exists:', !!honeypot);
console.log('Honeypot visible:', honeypot.offsetParent !== null);
// Expected: exists=true, visible=false
```

### Test 2: Trigger Bot Detection (Honeypot)

```javascript
// Fill honeypot and submit - should be rejected
document.querySelector('input[name="website"]').value = 'http://test.com';
// Now fill form normally and submit
// Expected: Generic error message, no email sent
```

### Test 3: Trigger Bot Detection (Time)

```javascript
// Submit form immediately after load (< 3 seconds)
// Expected: Generic error message
```

### Test 4: Normal Submission

```javascript
// Wait 3+ seconds, fill form normally (don't touch honeypot), submit
// Expected: Success message, emails sent
```

---

## Key Design Decisions

### Why "website" as field name?
- Common honeypot name
- Bots expect it in forms
- Doesn't raise suspicion

### Why position: absolute; left: -9999px?
- Standard CSS technique for hiding
- Better than display:none (which bots might detect)
- More reliable than opacity: 0

### Why tabIndex={-1}?
- Removes from keyboard navigation
- Users can't accidentally tab into it
- Maintains form flow

### Why aria-hidden='true'?
- Screen readers ignore the field
- Maintains accessibility
- No confusion for assistive technology users

### Why generic error messages?
- Don't reveal detection method
- Security through obscurity (minor)
- Bot operators don't learn how they're detected

### Why 3 and 5 second thresholds?
- Long enough to catch most bots
- Short enough not to impact fast human users
- Different for different form complexity
- Can be adjusted based on monitoring

---

## Maintenance Code

### Check Bot Detection Rate

```bash
# In production logs, count bot detections
grep "Bot detected" server.log | wc -l

# Count by type
grep "honeypot field filled" server.log | wc -l
grep "submitted too quickly" server.log | wc -l
```

### Adjust Time Thresholds

```typescript
// If too many false positives, reduce:
if (timeDiff < 1000) { // Changed from 3000

// If too many bots getting through, increase:
if (timeDiff < 5000) { // Changed from 3000
```

### Temporarily Disable

```typescript
// Comment out entire validation blocks:
// if (honeypot && honeypot !== '') {
//   console.warn('Bot detected: honeypot field filled');
//   return { ...error };
// }
```

---

## File Summary

| File | Lines Added | Purpose |
|------|-------------|---------|
| `app/lib/data/contact-us.ts` | +37 | Contact form validation |
| `app/ui/components/Contact/index.tsx` | +22 | Contact form honeypot |
| `app/lib/data/platform-api.ts` | +25 | Registration validation |
| `app/ui/components/Register/index.tsx` | +24 | Registration honeypot |
| **Total** | **+108** | **Complete protection** |

---

**Simple. Effective. Invisible to users. Zero maintenance.**
