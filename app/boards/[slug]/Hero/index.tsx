"use client";
import { useState, useEffect } from 'react';
import { commonsPlatform } from '@/app/lib/utils';
import platformApi from '@/app/lib/data/platform-api';
import metaData from '@/app/lib/data/meta-data';
import get from '@/app/lib/data/get';

interface heroProps {
	searchParams: any;
	title: string;
	counts: any[];
	total: number;
	contributors: number;
	creatorName: string;
	platforms: any[];
	board: number;
}

export default function Hero({
	searchParams,
	title,
	counts,
	total,
	contributors,
	creatorName,
	platforms,
	board,
}: heroProps) {

	// GET THE MAP
	/*
	curl -H 'Content-Type: application/json' \
	     -d '{ "projsize": 800, "base_color": "black", "layers": [{"iso3": "DZA","lat": 28.14888965733064,"lng": 2.653091376797369,"count": 5,"type": "point"},{"iso3": "ARG","lat": -35.37867944030587,"lng": -65.17307736953525,"count": 2,"type": "point"},{"iso3": "BGD","lat": 23.845677724414227,"lng": 90.24199983947693,"count": 1,"type": "point"},{"iso3": "BFA","lat": 12.269553913794407,"lng": -1.7555276952566217,"count": 1,"type": "point"},{"iso3": "ECU","lat": -1.4534591942689437,"lng": -78.39463619576759,"count": 3,"type": "point"},{"iso3": "EGY","lat": 26.492993084547354,"lng": 29.86111079580237,"count": 3,"type": "point"},{"iso3": "SLV","lat": 13.735849549208535,"lng": -88.87103252208958,"count": 1,"type": "point"},{"iso3": "ETH","lat": 8.622951736470814,"lng": 39.60055103486151,"count": 7,"type": "point"},{"iso3": "FJI","lat": -17.44756195212767,"lng": 163.40786559316325,"count": 2,"type": "point"},{"iso3": "GTM","lat": 15.696016409029419,"lng": -90.36015683588494,"count": 34,"type": "point"},{"iso3": "GIN","lat": 10.434649046539635,"lng": -10.94306126600144,"count": 2,"type": "point"},{"iso3": "IND","lat": 22.91300071248592,"lng": 79.57888726082322,"count": 1,"type": "point"},{"iso3": "IRQ","lat": 32.73423385208388,"lng": 43.66875801638213,"count": 1,"type": "point"},{"iso3": "LAO","lat": 18.50230162867195,"lng": 103.73787193586227,"count": 12,"type": "point"},{"iso3": "MEX","lat": 23.949171200328962,"lng": -102.53030787352746,"count": 3,"type": "point"},{"iso3": "MKD","lat": 41.59500492551307,"lng": 21.683830410347362,"count": 10,"type": "point"},{"iso3": "PRY","lat": -23.227518815638398,"lng": -58.39842280769376,"count": 2,"type": "point"},{"iso3": "SAU","lat": 24.12232706505492,"lng": 44.5368636756876,"count": 1,"type": "point"},{"iso3": "THA","lat": 15.114399804213997,"lng": 101.00333335534482,"count": 1,"type": "point"},{"iso3": "VUT","lat": -16.20126791969478,"lng": 167.70084414094188,"count": 1,"type": "point"}] }' \
	     -X POST \
	     http://localhost:2000/apis/fetch/map
	*/

	const [loading, setLoading] = useState<boolean>(true);
	const [locationsCount, setLocationsCount] = useState<number>(0);
	const [tagsCount, setTagsCount] = useState<number>(0);
	const [topTags, setTopTags] = useState<any[]>([]);
	const [mapSrc, setMapSrc] = useState<string>('');

	async function fetchData(): Promise<void> {
        setLoading(true);

        // GET THE METADATA
        const meta: any[] = await metaData({ 
            searchParams: { ...searchParams, ...{ pinboard: +board } }, 
            platforms: platforms.map((d: any) => commonsPlatform.find((c: any) => c.shortkey === d.platform)?.key || d.platform), 
            filters: ['thematic areas']
        });
        setTagsCount(meta.find((d: any) => d.key === 'thematic areas')?.data.length ?? 0)
        setTopTags(meta.find((d: any) => d.key === 'thematic areas')?.data.sort((a: any, b: any) => b.count - a.count).slice(0, 3));

        // GET THE LOCATION DATA
        const locations: any[] = await Promise.all(platforms.map(async (d: any) => {
            const platform: string = commonsPlatform.find((c: any) => c.shortkey === d.platform)?.key || d.platform;
            const data: any[] = await platformApi(
                { ...searchParams, ...{ pinboard: d.pinboard_id, space: 'pinned', use_pads: true } },
                platform, 
                'countries'
            );
            return data;
        }));

        const nested_locations: any[] = [];
        locations.flat().forEach((d: any) => {
        	// NEED TO HANDLE SITUATIONS WHERE pads FROM ap MAY BE e.g. IN Guatemala AND pads FROM sm ARE ALSO IN Guatemala (NEED TO ADD THE COUNTS)
        	const groupby: string = d?.iso3;
        	if (!nested_locations.find((c: any) => c.iso3 === groupby)) {
				nested_locations.push({ 
					iso3: groupby, 
					// values: [d], 
					count: d?.count, 
					lat: d?.location.lat, 
					lng: d?.location.lng,
					type: 'point',
					color: '#d2f960',
				});
        	} else {
				// nested_locations.find((c: any) => c.iso3 === groupby).values.push(d);
				nested_locations.find((c: any) => c.iso3 === groupby).count += d.count;
        	}
        });
        // GET THE MAP (IT MAY NEED TO BE GENERATED THE FIRST TIME WHICH COULD TAKE A FEW SECONDS)
        setLocationsCount(nested_locations.length);
        // console.log(platforms[0].platform)
        
        const base_url: string | undefined = commonsPlatform.find(p => p.shortkey === platforms[0].platform)?.url;

        interface bodyProps {
        	projsize: number;
        	base_color: string;
        	layers: any;
        }
        const reqBody: bodyProps = {
        	projsize: 1440 * .75,
        	base_color: '#000',
        	layers: nested_locations,
        };

        const { file }: any = await get({
            url: `${base_url}/apis/fetch/map`,
            method: 'POST',
            body: reqBody,
        });

        setMapSrc(file);

        // let { hits, status } = await get({
        //     url: `${NLP_URL}/search`,
        //     method: 'POST',
        //     body,
        // });


        // projsize: number | default 1200px,
        // background-color: string | default 'transparent',
        // base-color: string | default 'rgba(102,117,127,.25)',

        setLoading(false);
    }

	useEffect(() => {
	    fetchData();
	}, []);



  	return (
  	<>
  	<section className='relative home-section !border-t-0 grid-bg lg:pb-[60px]'>
		{/*<img className='w-[40%] absolute right-0 top-[90px]' alt="Branding illustration" src="/images/hands/see_top.svg" />*/}
		{/*<img className='w-[40%] absolute right-[5%] bottom-[-1px]' alt="Branding illustration" src="/images/hands/see_bottom.svg" />*/}
	    <div className='inner w-[1440px] mx-auto'>
		    <div className='section-content grid grid-cols-9 gap-[20px] lg:px-[80px] lg:pt-[80px]'>
		        <div className='c-left lg:col-span-5 lg:mt-[80px] lg:mb-[20px]'>
	            	<h1 className='slanted-bg yellow'><span>{title}</span></h1>
	            	<p className='lead'>Curated by {creatorName}</p>

	            	<div className='flex flex-wrap flex-row gap-1.5 mb-[20px]'>
	            	{loading ? null : (
	            		topTags.map((d: any, i: number) => {
	            			return (
	            				<button className='chip bg-posted-yellow' key={i}>{d.name}</button>
	            			)
	            		})
	            	)}
	            	</div>
	            	{loading ? null : (
		            	<div className='stats-cartouche lg:p-[20px] inline-block'>
		            		<span className='lg:mr-[40px]'><span className='number lg:mr-[5px]'>{total}</span> Notes</span>
		            		<span className='lg:mr-[40px]'><span className='number lg:mr-[5px]'>{locationsCount}</span> Locations</span>
		            		<span className='lg:mr-[40px]'><span className='number lg:mr-[5px]'>{tagsCount}</span> Thematic areas</span>
		            		<span><span className='number lg:mr-[5px]'>{contributors}</span> Contributor</span>
		            	</div>
		            )}
		        </div>
		        <div className='c-right lg:col-span-4 lg:mt-[80px] lg:mb-[20px]'>
		        	{loading ? null : (
		        		<img src={mapSrc} className='gradient-img absolute w-[calc(100%+200px)] min-h-[calc(100%+160px)] top-[-160px] right-[-80px] object-contain' />
		        	)}
		        </div>
		    </div>
		</div>
  	</section>
  	</>
  );
}