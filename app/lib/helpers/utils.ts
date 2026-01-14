
export const baseHost= '.sdg-innovation-commons.org'
export const page_limit = 18;
export const base_url = 'https://sdg-innovation-commons.org';
export const app_storage = 'https://acclabplatforms.blob.core.windows.net/';
export const app_title_short = 'sdg-innovation-commons';

export const commonsPlatform = [
  {
    title: 'Learning Plans',
    url: 'https://learningplans.sdg-innovation-commons.org',
    key: 'action plan',
    shortkey: 'ap',
  },
  {
    title: 'Solutions',
    url: 'https://solutions.sdg-innovation-commons.org',
    key: 'solution',
    shortkey: 'sm',
  },
  {
    title: 'Experiments',
    url: 'https://experiments.sdg-innovation-commons.org',
    key: 'experiment',
    shortkey: 'exp',
  },
  {
    title: 'Insight',
    url: 'https://blogapi.sdg-innovation-commons.org',
    key: 'insight',
    shortkey: 'blogs'
  },
  {
    title: 'Login',
    url: 'https://login.sdg-innovation-commons.org',
    key: 'login',
  }
];

export const sdgLabels = ['No poverty','Zero hunger','Good health and well-being','Quality education','Gender equality','Clean water and sanitation','Affordable and clean energy','Decent work and economic growth','Industry, innovation and infrastructure','Reduced innequalities','Sustainable cities and communities','Responsible consumption and production','Climate action','Life below water','Life on land','Peace, justice and strong institutions','Partnerships for the goals'];

export const NLP_URL = "https://nlpapi.sdg-innovation-commons.org/api";

// Dynamically set base URL based on environment
// In production, use the production URL; in development, use localhost
// You can also override with NEXT_PUBLIC_API_BASE_URL environment variable
export const LOCAL_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://sdg-innovation-commons.org' 
    : 'http://localhost:3000');

// Helper function to check if string is a URL
export const isURL = (str: string = ''): boolean => {
  const url = /(?<!:)(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  return !!url.test(encodeURI(str.valueOf().trim()));
};

// Helper function to extract images from pad sections (similar to parsers.getImg)
export const getImg = (_json: any = {}, _unique: boolean = true): string[] => {
  if (_json?.sections) {
    const media = _json.sections
      .map((c: any) => c.items?.map((b: any) => (b.type === 'group' ? b.items.flat() : b)).flat())
      .flat();
    
    const img = media
      .filter((c: any) => c.type === 'img' && c.src)
      .map((d: any) => {
        if (isURL(d.src)) return d.src;
        else return `/${d.src.replace('uploads', 'uploads/sm')}`;
      });
    
    const mosaic = media
      .filter((c: any) => c.type === 'mosaic' && c.srcs?.length > 0)
      .map((d: any) => d.srcs)
      .flat()
      .map((d: any) => {
        if (isURL(d)) return d;
        else return `/${d.replace('uploads', 'uploads/sm')}`;
      });
    
    const embed = media
      .filter((c: any) => c.type === 'embed' && c.src)
      .map((d: any) => d.src)
      .filter((d: any) => d)
      .map((d: any) => {
        if (isURL(d)) return d;
        else return `/${d.replace('uploads', 'uploads/sm')}`;
      });
    
    const results = img.concat(mosaic, embed);

    if (_unique) return [results[0]].filter((d) => d);
    else return results.filter((d:any) => d);
  } else return [];
};

export function extractSDGNumbers(pad: any) {
  const sdgNumbers: number[] = [];

  pad?.sections?.forEach((section: any) => {
    section.items.forEach((item: any) => {
      if (item.name === "sdgs") {
        item.tags.forEach((sdg: any) => {
          sdgNumbers.push(sdg.key); 
        });
      }
    });
  });

  return sdgNumbers;
}

export const defaultSearch = (key: 'see' | 'learn' | 'test'): string | undefined => {
  const def: { [key: string]: string } = {
    "see": "What solutions is the network seeing?",
    "learn": 'learning',
    "test": 'action learning',
  };
  
  return def[key];
}


/**
 * Scrub PII from free text when needed.
 * Removes email addresses, phone numbers, and ID sequences.
 * 
 * @param val - Value to scrub
 * @param shouldScrub - Whether to scrub PII (default: true)
 * @param recordId - Optional record ID for logging
 */
export function scrubPII(val: any, shouldScrub: boolean = true, recordId?: string | number): any {
  if (!shouldScrub) return val;
  if (val === null || typeof val === 'undefined') return val;
  
  let s = typeof val === 'string' ? val : JSON.stringify(val);
  
  // Remove email addresses
  s = s.replace(/[A-Za-z0-9]([A-Za-z0-9._%+-]*[A-Za-z0-9])?@[A-Za-z0-9]([A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}/gi, '[REDACTED_EMAIL]');
  
  // Remove phone numbers (international, local, with separators)
  s = s.replace(/(\+\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)(\d{2,4}[-.\s]?){2,}\d{2,4}/g, '[REDACTED_PHONE]');
  s = s.replace(/\b\d{3,}[-.\s]?\d{3,}[-.\s]?\d{3,}\b/g, '[REDACTED_PHONE]');
  
  // Remove sequences that look like national IDs (6+ consecutive digits)
  s = s.replace(/\b\d{6,}\b/g, '[REDACTED_ID]');
  
  // Remove email-like patterns that might have been missed
  s = s.replace(/[A-Za-z0-9._%+-]+\s*@\s*[A-Za-z0-9.-]+\s*\.\s*[A-Za-z]{2,}/gi, '[REDACTED_EMAIL]');
  
  // Remove mailto: links
  s = s.replace(/mailto:\s*[^\s<>]+/gi, 'mailto:[REDACTED_EMAIL]');
  
  return s;
}

/**
 * Scrub PII from pad sections structure
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

export const formatDate = (
  dateString: string,
) => {
  const date = new Date(dateString);
  
  // Get day, month, and year
  const day = String(date.getDate()).padStart(2, '0'); 
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = String(date.getFullYear()).slice(2); 

  // Return formatted date in DD.MM.YY format
  return `${day}.${month}.${year}`;
}

export const polishTags = (data: any[], shouldScrubPII: boolean = true) => {
  return data?.flat()?.map((d: any) => {
    const recordId = d.pad_id ?? d.id ?? 'unknown';
    
    // Scrub PII from text fields
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
};

export const getCountryList = (post: any, limit: number | undefined) => {
  if (!limit) limit = 3;
  let countries =
    post?.locations?.map((d: any) => d.country) || [];
  if (!countries.length)
    countries = [
      post?.country === 'NUL' || !post?.country
        ? 'Global'
        : post?.country,
    ];
  else {
    countries = countries.filter(
      (value: string, index: number, array: string[]) => {
        return array.indexOf(value) === index;
      }
    );
    if (countries.length > limit) {
      const n = countries.length;
      countries = countries.slice(0, limit);
      countries.push(`+${n - limit}`);
    }
  }
  return countries;
}

export type incomingRequestParams = {
  params: Promise<{ slug: string, platform: string, pad: string, board: string, collection: string, space: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const shimmer = 'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export const URLsToLinks = function (str = '') {
  // INSPIRED BY https://stackoverflow.com/questions/49634850/convert-plain-text-links-to-clickable-links
  // URLs starting with http://, https://, or ftp://
  const replacePattern1 =
    /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  
  if (typeof str !== 'string') return str;
  else {
	  str = str.valueOf().replace(
	    replacePattern1,
	    '<a class="text-blue-500 cursor-pointer" href="$1" target="_blank">$1</a>',
	  );

	  // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
	  const replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
	  str = str.replace(
	    replacePattern2,
	    '$1<a class="text-blue-500 cursor-pointer" href="http://$2" target="_blank">$2</a>',
	  );

	  // Change email addresses to mailto:: links.
	  const replacePattern3 =
	    /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
	  str = str.replace(replacePattern3, '<a class="text-blue-500 cursor-pointer" href="mailto:$1">$1</a>');

	  return str;
	}
};

export function isPasswordSecure(password: string): string[] {
  const minlength = 8;
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*\(\)]/;
  const commonPasswords = ['password', '123456', 'qwerty', 'azerty'];

  const isUpper = uppercaseRegex.test(password);
  const isLower = lowercaseRegex.test(password);
  const isNumber = numberRegex.test(password);
  const isSpecial = specialCharRegex.test(password);
  const groups = [isUpper, isLower, isNumber, isSpecial].reduce(
    (p, v) => p + (v ? 1 : 0),
    0
  );

  const checks: Record<string, boolean> = {
    'pw-length': password.length >= minlength,
    'pw-groups': groups >= 3,
    'pw-common': !commonPasswords.includes(password.toLowerCase()),
  };

  const msgs: Record<string, string> = {
    'pw-length': 'Password must be at least 8 characters long',
    'pw-groups':
      'Password requires three character groups out of uppercase letters, lowercase letters, numbers, or special characters !@#$%^&*()',
    'pw-common': 'Password cannot be a commonly used password',
  };

  return Object.keys(checks)
    .filter((key) => !checks[key])
    .map((key) => msgs[key]);
}

export async function escapeHtml(s: any) {
  if (s === null || typeof s === 'undefined') return '';
  return String(s).replace(/[&"'<>]/g, function (c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as any)[c];
  });
}