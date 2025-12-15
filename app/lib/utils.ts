
export const baseHost= '.sdg-innovation-commons.org'
export const page_limit = 18;
export const base_url = 'https://sdg-innovation-commons.org';

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

export const LOCAL_BASE_URL = 'http://localhost:3000'

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

export const polishTags = (data: any[]) => {
  return data?.flat()?.map((d: any) => {
    // Clean snippet: remove null, undefined, 'null', 'undefined' strings
    let snippet = d?.snippet;
    if (!snippet || snippet === 'null' || snippet === 'undefined' || 
        (typeof snippet === 'string' && snippet.trim().toLowerCase() === 'null') ||
        (typeof snippet === 'string' && snippet.trim().toLowerCase() === 'undefined')) {
      snippet = '';
    } else if (typeof snippet === 'string' && snippet.length > 200) {
      snippet = `${snippet.slice(0, 200)}…`;
    }
    
    return {
      ...d,
      snippet,
      rawtags: d.tags,
      tags: d?.tags
          ?.filter((t: any) => t.type === 'thematic_areas')
          .map((t: any) => t.name),
      sdg: d?.tags
          ?.filter((t: any) => t.type === 'sdgs')
          .map((t: any) => t.key)
    };
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