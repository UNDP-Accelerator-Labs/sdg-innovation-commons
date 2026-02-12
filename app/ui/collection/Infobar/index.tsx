import renderComponents from '@/app/ui/components/MediaComponents';
import Cartouche from '@/app/ui/pad/Cartouche';

interface Props {
	sections: any[];
	sdgs: any;
	locations: any;
}

export default function Infobar({
	sections,
	sdgs,
	locations,
}: Props) {
  	return (
	  	<>
	  	<section className='home-section relative py-[40px] lg:py-[80px] overflow-hidden'>
		    <div className='inner w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px] mx-auto'>
		    	<Cartouche 
		    	    locations={locations.values} 
		    	    sdgs={sdgs.highlight} 
		    	    className='lg:hidden col-span-9 bg-white grid grid-cols-2 mb-[40px]'
		    	    mapFile={locations.map}
		    	/>
			    <div className='section-content grid grid-cols-9 gap-[20px] px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px]'>
			        <div className='c-left col-span-9 lg:col-span-5'>
		            	{
		            	    sections?.map((s: any, j: number) => {
		            	        const { title, items } = s;
		            	        return (
		            	            <div key={j}>
			            	            {!title ? null : (
			            	                <h3>{title}</h3>
			            	            )}
			            	            {items.map((item: any, i: number) => {
			            	                const { type } = item;
			            	                if (type === 'group') {
			            	                    const { items: groupItemsArr, instruction } = item;
			            	                    return groupItemsArr.map((itemsArr: any[], i: number) => {
			            	                        return (
			            	                            <div key={i} className='group border-[1px] border-solid mt-[-1px] box-border p-[20px] pb-0 mb-[40px]'>
			            	                                {
			            	                                    itemsArr.map((item: any, k: number) => {
			            	                                        return renderComponents(items, item, k)
			            	                                    })
			            	                                }
			            	                            </div>
			            	                        )
			            	                    })
			            	                } else return renderComponents(items, item, i);
			            	            })}
			            	            {j < sections.length - 1 && (
			            	                <div className='divider block w-full h-0 border-t-[1px] border-solid mb-[40px]'></div>
			            	            )}
		            	            </div>
		            	        )
		            	    })
		            	}
			        </div>
			        <Cartouche 
			            locations={locations.values} 
			            sdgs={sdgs.highlight} 
			            className='hidden lg:block lg:col-start-7 lg:col-span-3 bg-white'
			            mapFile={locations.map}
			        />
			    </div>
			</div>
			{/*<div className='gradient-img c-right absolute h-full right-0 top-0 lg:w-[35%]'>
				<img className='absolute right-0 top-0 z-[100]' alt="Branding illustration" src="/images/hands/board.svg" />
				<img src={vignette?.replace(/\/sm\//, '/')} className='min-h-full w-full object-contain' />
			</div>*/}
	  	</section>
	  	</>
  	);
}