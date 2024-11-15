import clsx from 'clsx';

interface Props {
	id: number;
	padtype: string;
	title: string;
	owner: string;
	lab: string | undefined;
	vignette?: string;
	tags: string[];
	tagStyle: string;
	tagStyleShade: string;
	color: string;
}

export default function Hero({ 
	id,
	padtype,
	title,
	owner,
	lab,
	vignette,
	tags,
	tagStyle,
	tagStyleShade,
	color,
}: Props) {
	if (padtype === 'solution') padtype = 'solution note';
	padtype = `${padtype.slice(0, 1).toUpperCase()}${padtype.substring(1)}`;
	const labLink: string = `https://www.undp.org/acceleratorlabs/${lab?.toLowerCase().replace(/\s/g, '-')}`; // FORMAT: undp-algeria-accelerator-lab

  	return (
  	<>
  		<section className='relative home-section !border-t-0 grid-bg lg:pb-[60px] overflow-hidden'>
		    <div className='inner w-[1440px] mx-auto'>
			    <div className='section-content grid grid-cols-9 gap-[20px] lg:px-[80px] lg:pt-[80px]'>
			        <div className='c-left lg:col-span-5 lg:mt-[80px] lg:mb-[60px]'>
		            	<span className={clsx('slanted-bg full', color)}><span><b>{padtype}</b></span></span>
		            	<h2>{title}</h2>
		            	<p className='lead mb-[10px]'><b>Posted by {owner}</b></p>
		            	{lab === undefined ? null : (
		            		<a href={labLink} target='_blank' rel='noopener noreferrer' className='underline'>{lab}</a>
		            	)}
		            	<div className='flex flex-wrap flex-row gap-1.5 mb-[20px] mt-[40px]'>
		            	{tags.map((d: any, i: number) => {
	            			return (
	            				<button className={clsx('chip', tagStyleShade)} key={i}>{d}</button>
	            			)
	            		})}
		            	</div>
			        </div>
			    </div>
			</div>
			{!vignette ? null : (
				<div className='gradient-img c-right absolute h-full right-0 top-0 lg:w-[40%] border-l-[1px] border-solid'>
					<img className='h-full object-contain' alt='Pad vignette' src={vignette?.replace('/sm/', '/')} />
				</div>
			)}
  		</section>
  	</>
  );
}