import clsx from 'clsx';

interface Props {
	tagStyleShade: string;
}

export default function Hero({ 
	tagStyleShade,
}: Props) {
	// if (padtype === 'solution') padtype = 'solution note';
	// padtype = `${padtype.slice(0, 1).toUpperCase()}${padtype.substring(1)}`;
	// const labLink: string = `https://www.undp.org/acceleratorlabs/${lab?.toLowerCase().replace(/\s/g, '-')}`; // FORMAT: undp-algeria-accelerator-lab

  	return (
  	<>
  		<section className='relative home-section !border-t-0 grid-bg lg:pb-[60px] overflow-hidden'>
		    <div className='inner w-[1440px] mx-auto'>
			    <div className='section-content grid grid-cols-9 gap-[20px] lg:px-[80px] lg:pt-[80px]'>
			        <div className='c-left lg:col-span-5 lg:mt-[80px] lg:mb-[60px]'>
		            	<span><span>
		            		<b>&nbsp;</b>
		            	</span></span>
		            	<h2 className='w-[50%] h-10 bg-gray-600 rounded-md'></h2>
						<p className='w-[50%] h-5 bg-gray-400 rounded-md'></p>
		            	<p className='w-[33%] h-4 bg-gray-300 rounded-md'></p>
		            	
		            	<div className='flex flex-wrap flex-row gap-1.5 mb-[20px] mt-[40px]'>
		            	{(new Array(4)).fill(0).map((d: number, i: number) => {
	            			return (
	            				<button className={clsx('chip', tagStyleShade)} key={i}>Tag</button>
	            			)
	            		})}
		            	</div>
			        </div>
			    </div>
			</div>
			{/*{!vignette ? null : (
				<div className='gradient-img c-right absolute h-full right-0 top-0 lg:w-[40%] border-l-[1px] border-solid'>
					<img className='h-full object-contain' alt='Pad vignette' src={vignette?.replace('/sm/', '/')} />
				</div>
			)}*/}
  		</section>
  	</>
  );
}