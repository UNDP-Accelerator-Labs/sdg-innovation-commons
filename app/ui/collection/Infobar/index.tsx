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
	  	<section className='home-section relative lg:py-[80px] overflow-hidden grid-bg'>
		    <div className='inner w-[1440px] mx-auto'>
			    <div className='section-content grid grid-cols-9 gap-[20px] lg:px-[80px]'>
			        <div className='c-left lg:col-span-5'>
		            	{
		            	    sections.map((s: any, j: number) => {
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
			            className='lg:col-start-7 lg:col-span-3 bg-white'
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