/**
 * Data privacy and PII (Personally Identifiable Information) utilities
 * @module lib/utils/privacy
 */

/**
 * Scrub personally identifiable information from data
 * Used to protect user privacy in public-facing data
 * 
 * @param val - Value to scrub (can be object, array, or primitive)
 * @param shouldScrub - Whether to actually scrub the data
 * @param recordId - Optional record ID for logging
 * @returns Scrubbed value
 */
export function scrubPII(val: any, shouldScrub: boolean = true, recordId?: string | number): any {
  if (!shouldScrub) return val;
  if (!val) return val;
  // Handle arrays
  if (Array.isArray(val)) {
    return val.map((item) => scrubPII(item, shouldScrub, recordId));
  }

  // Handle objects
  if (typeof val === 'object') {
    const scrubbed: any = {};
    
    for (const [key, value] of Object.entries(val)) {
      // Fields that should be completely removed
      const removeFields = [
        'email',
        'phone',
        'telephone',
        'address',
        'ip_address',
        'password',
        'token',
        'api_key',
        'secret',
      ];
      
      if (removeFields.some((field) => key.toLowerCase().includes(field))) {
        continue; // Skip this field
      }
      
      // Fields that should be anonymized
      const anonymizeFields = ['name', 'username', 'author', 'creator', 'owner'];
      
      if (anonymizeFields.some((field) => key.toLowerCase().includes(field)) && typeof value === 'string') {
        scrubbed[key] = anonymizeString(value);
      } else {
        scrubbed[key] = scrubPII(value, shouldScrub, recordId);
      }
    }
    
    return scrubbed;
  }
  //scrub primitive values (strings, numbers, etc.)
  if (typeof val === 'string') {
    const uuidPattern = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i;
    if (uuidPattern.test(val)) {
      return maskUUID(val);
    }
    return val.includes('@') ? maskEmail(val) : val;
    return val.includes('@') ? maskEmail(val) : val;
  }

return val;
}

/**
 * Anonymize a string (typically a name)
 * 
 * @param str - String to anonymize
 * @returns Anonymized string
 */
function anonymizeString(str: string): string {
  if (!str || str.length === 0) return str;
  
  const words = str.split(' ');
  const anonymized = words.map((word) => {
    if (word.length <= 2) return word;
    return word[0] + '*'.repeat(word.length - 1);
  });
  
  return anonymized.join(' ');
}

/**
 * Mask email address
 * 
 * @param email - Email to mask
 * @returns Masked email
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  
  const [username, domain] = email.split('@');
  if (username.length <= 2) return email;
  
  const masked = username[0] + '*'.repeat(username.length - 2) + username[username.length - 1];
  return `${masked}@${domain}`;
}

/**
 * Mask UUID (show only first and last 4 characters)
 * 
 * @param uuid - UUID to mask
 * @returns Masked UUID
 */
export function maskUUID(uuid: string): string {
  if (!uuid || uuid.length < 12) return uuid;
  
  return `${uuid.substring(0, 4)}****-****-****-****${uuid.substring(uuid.length - 4)}`;
}

/**
 * Check if data contains PII
 * 
 * @param data - Data to check
 * @returns Boolean indicating if PII is detected
 */
export function containsPII(data: any): boolean {
  if (!data) return false;
  
  const piiFields = [
    'email',
    'phone',
    'telephone',
    'address',
    'ip_address',
    'password',
    'ssn',
    'credit_card',
  ];
  
  if (typeof data === 'object') {
    const keys = Object.keys(data).map((k) => k.toLowerCase());
    return piiFields.some((field) => keys.some((key) => key.includes(field)));
  }
  
  return false;
}

/**
 * Scrub PII from pad sections structure
 * @private
 */
function scrubPadSections(sections: any[], shouldScrub: boolean, recordId?: string | number): any[] {
  if (!shouldScrub || !Array.isArray(sections)) return sections;
  
  return sections.map(section => {
    const scrubbedSection = { ...section };
    
    // Scrub section title and lead
    if (scrubbedSection.title) {
      scrubbedSection.title = scrubPII(scrubbedSection.title, true, recordId);
    }
    if (scrubbedSection.lead) {
      scrubbedSection.lead = scrubPII(scrubbedSection.lead, true, recordId);
    }
    
    // Scrub items within sections
    if (Array.isArray(scrubbedSection.items)) {
      scrubbedSection.items = scrubbedSection.items.map((item: any) => {
        const scrubbedItem = { ...item };
        if (scrubbedItem.txt) {
          scrubbedItem.txt = scrubPII(scrubbedItem.txt, true, recordId);
        }
        if (scrubbedItem.html) {
          scrubbedItem.html = scrubPII(scrubbedItem.html, true, recordId);
        }
        if (scrubbedItem.name && typeof scrubbedItem.name === 'string') {
          scrubbedItem.name = scrubPII(scrubbedItem.name, true, recordId);
        }
        return scrubbedItem;
      });
    }
    
    return scrubbedSection;
  });
}

/**
 * Polish and format tag data for display
 * Extracts relevant tags, truncates snippets, and optionally scrubs PII
 * 
 * @param data - Array of data items with tags
 * @param shouldScrubPII - Whether to scrub PII from the data
 * @returns Formatted data array
 */
export function polishTags(data: any[], shouldScrubPII: boolean = true): any[] {
  return data?.flat()?.map((d: any) => {
    const recordId = d.pad_id ?? d.id ?? 'unknown';
    
    // Format the data
    const scrubbedData: any = {
      ...d,
      snippet: d?.snippet?.length > 200 ? `${d.snippet.slice(0, 200)}…` : d.snippet,
      rawtags: d.tags,
      tags: d?.tags
          ?.filter((t: any) => t.type === 'thematic_areas')
          .map((t: any) => t.name),
      sdg: d?.tags
          ?.filter((t: any) => t.type === 'sdgs')
          .map((t: any) => t.key)
    };
    
    // Scrub PII from sensitive fields
    if (shouldScrubPII) {
      if (scrubbedData.title) {
        scrubbedData.title = scrubPII(scrubbedData.title, true, recordId);
      }
      if (scrubbedData.full_text) {
        scrubbedData.full_text = scrubPII(scrubbedData.full_text, true, recordId);
      }
      if (scrubbedData.snippet) {
        scrubbedData.snippet = scrubPII(scrubbedData.snippet, true, recordId);
      }
      if (Array.isArray(scrubbedData.sections)) {
        scrubbedData.sections = scrubPadSections(scrubbedData.sections, true, recordId);
      }
      if (scrubbedData.description) {
        scrubbedData.description = scrubPII(scrubbedData.description, true, recordId);
      }
      if (scrubbedData.content) {
        scrubbedData.content = scrubPII(scrubbedData.content, true, recordId);
      }
    }
    return scrubbedData;
  });
}
