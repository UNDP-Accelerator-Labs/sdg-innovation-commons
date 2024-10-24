import get from "@/app/lib/data/get"; 

export const baseHost= '.sdg-innovation-commons.org'
export const page_limit = 27;

export const commonsPlatform = [
  {
    title: 'Learning Plans',
    url: 'https://learningplans.sdg-innovation-commons.org',
    key: 'action plan'
  },
  {
    title: 'Solutions',
    url: 'https://solutions.sdg-innovation-commons.org',
    key: 'solution'
  },
  {
    title: 'Experiments',
    url: 'https://experiments.sdg-innovation-commons.org',
    key: 'experiment'
  },
  {
    title: 'Insight',
    url: 'https://blogapi.sdg-innovation-commons.org',
    key: 'insight'
  },
  {
    title: 'Login',
    url: 'https://login.sdg-innovation-commons.org',
    key: 'login'
  }
];

export const NLP_URL = "https://nlpapi.sdg-innovation-commons.org/api";

export async function getAdditionalData(results: any, base_url: string) {
  const ids = results?.hits.map((hit: any) => hit?.main_id.split(':')[1]);
  const url = `${base_url}/apis/fetch/pads?pads=${ids.join('&pads=')}&output=json&include_engagement=true&include_tags=true&include_metafields=true&include_data=true`;

  // Fetch the additional data from the API
  const fetchedData = await get({
    url,
    method: 'GET',
  });

  const flattenedFetchedData = fetchedData?.flat();

  if (!flattenedFetchedData) {
    return results;
  }

  // Use Promise.all to resolve all the async operations in map
  results.hits = await Promise.all(
    results.hits.map(async (hit: any) => {
      const matchingFetchedData = flattenedFetchedData.find(
        (fetchedItem: any) => fetchedItem.pad_id === hit.doc_id
      );

      const sdg = extractSDGNumbers(matchingFetchedData);
      
      return {
        ...hit,
        ...matchingFetchedData,
        tags: matchingFetchedData?.tags
          ?.filter((p: any) => p.type === 'thematic_areas')
          .map((p: any) => p.name),
        sdg,
      };
    })
  );

  return results;
}


export function extractSDGNumbers(pad: any) {
  const sdgNumbers: number[] = [];

  pad.sections?.forEach((section: any) => {
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
    "learn": "What has the network learnt?",
    "test": "What is the network testing?"
  };
  
  return def[key];
}


export async function get_externalDb(id : number){
  if(id == 1) return commonsPlatform.filter(p=> p.key == 'action plan')[0]?.url;
  if(id == 2) return commonsPlatform.filter(p=> p.key == 'experiment')[0]?.url;;
  if(id == 4) return commonsPlatform.filter(p=> p.key == 'solution')[0]?.url;;
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

