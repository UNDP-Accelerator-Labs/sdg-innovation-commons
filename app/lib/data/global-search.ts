'use server';
import { NLP_URL, page_limit, getAdditionalData, get_externalDb } from '@/app/lib/utils';
import { Props } from './learn';
import get from './get';

export default async function search(_kwargs: Props) {
    const { page, limit, offset, search, language, country, doc_type } = _kwargs;

    const body = {
        input: search ?? '',
        page: page ?? 1,
        limit: limit ?? page_limit,
        offset: offset ?? 0,
        short_snippets: true,
        vecdb: 'main',
        filters: {
            language: language ? [language] : [],
            doc_type: doc_type && Array.isArray(doc_type) ? doc_type : ["solution", 'experiment', 'action plan', "blog", "publications", "news"],
            iso3: country ? [country] : [],
        },
    };

    // Fetch initial data from NLP_URL
    let data = await get({
        url: `${NLP_URL}/search`,
        method: 'POST',
        body,
    });

    type BaseType = 'solution' | 'experiments' | 'actionplan' | 'others';
    type BaseMap = Map<BaseType, any[]>;

    const baseMap: BaseMap = new Map<BaseType, any[]>([
        ['solution', []],
        ['experiments', []],
        ['actionplan', []],
        ['others', []],
    ]);

    data?.hits?.forEach((p: any) => {
        if (p.base === 'solution') baseMap.get('solution')?.push(p);
        else if (p.base === 'experiments') baseMap.get('experiments')?.push(p);
        else if (p.base === 'actionplan') baseMap.get('actionplan')?.push(p);
        else baseMap.get('others')?.push(p);
    });

    let solution_list = baseMap.get('solution') || [];
    let exp_list = baseMap.get('experiments') || [];
    let ap_list = baseMap.get('actionplan') || [];
    let others_list = baseMap.get('others') || [];

    // Parallelize fetching additional data
    if (solution_list?.length || exp_list?.length || ap_list?.length) {
        const [base_solution_url, base_exp_url, base_ap_url] = await Promise.all([
            get_externalDb(4),
            get_externalDb(2),
            get_externalDb(1),
        ]);

        const [update_solutions, update_experiments, update_actionplans] = await Promise.all([
            solution_list?.length ? getAdditionalData({ hits: solution_list }, base_solution_url || '') : Promise.resolve({ hits: [] }),
            exp_list?.length ? getAdditionalData({ hits: exp_list }, base_exp_url || '') : Promise.resolve({ hits: [] }),
            ap_list?.length ? getAdditionalData({ hits: ap_list }, base_ap_url || '') : Promise.resolve({ hits: [] })
        ]);

        // Update the lists if new data is fetched
        if (update_solutions?.hits?.length) solution_list = update_solutions.hits;
        if (update_experiments?.hits?.length) exp_list = update_experiments.hits;
        if (update_actionplans?.hits?.length) ap_list = update_actionplans.hits;
    }

    // Combine all lists into the final data
    const finalHits: any[] = [];
    finalHits.push(...ap_list, ...exp_list, ...solution_list, ...others_list);
    data.hits = finalHits;

    return data;
}
