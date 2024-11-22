'use server';
import platformApi from './platform-api';
import { commonsPlatform, extractSDGNumbers, polishTags } from '@/app/lib/utils';
import get from './get';

export interface Props {
  id?: number[] | number;
  pads?: number[] | number;
  url?: string[] | string;
}

export default async function blogApi(_kwargs: Props) {
    let { id, pads } = _kwargs;
    // CHECK FOR pads: THIS IS IN THE CASE OF A REDIRECTION FROM platform-api
    // WHERE id WILL NOT BE DEFINED, BUT pads WILL
    if (pads) {
        if (!Array.isArray(pads)) pads = [pads];
        if (_kwargs.id) {
            if (Array.isArray(_kwargs.id)) _kwargs.id = [ ..._kwargs.id, ...pads ];
            else _kwargs.id = [ ...pads, _kwargs.id ];
        } else {
            _kwargs.id = pads;
        }
    }

    const params = new URLSearchParams();
    
    for (let k in _kwargs) {
        const argV = _kwargs[k as keyof typeof _kwargs];
        if (argV) {
            if (Array.isArray(argV)) {
                argV.forEach((v:any) => {
                    params.append(k, v.toString());
                });
            } else {
                params.set(k, argV.toString());
            }
        }
    }
    
    const url = `https://blogapi.sdg-innovation-commons.org/articles?${params.toString()}`;

    console.log('check url ', url)

    const data = await get({
        url,
        method: 'GET',
    });

    if (Array.isArray(data)) {
        // GET THE COUNTRY INFORMATION
        const countries = data.map((d: any) => d.iso3)
        .filter((value: any, index: number, self: any) => {
            return self.indexOf(value) === index;
        });

        const countryNames: any[] = await platformApi({ }, 'solution', 'countries'); // HERE solution IS USED BY DEFAULT SINCE THE API CALLS THE MAIN DB SHARED BY ALL PLATFORMS

        data?.forEach((d: any) => {
            d.base = 'blog';
            d.country = countryNames?.find((c: any) => d.iso3 === c.iso3)?.country;
            delete d.html_content;
            console.log(d.iso3, d.country)
        })
    }

    return data;
}
