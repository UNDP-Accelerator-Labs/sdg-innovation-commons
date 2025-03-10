'use client'
import clsx from 'clsx';
import { Button } from '@/app/ui/components/Button';
import { useSharedState } from '@/app/ui/components/SharedState/Context';

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
	platform?: string;
	pinboards?: any[];
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
	platform,
	pinboards = [],
}: Props) {
	if (padtype === 'solution') padtype = 'solution note';
	padtype = `${padtype.slice(0, 1).toUpperCase()}${padtype.substring(1)}`;
	let labLink: string = '';
	if (lab) {
		if (lab.includes('Global')) {
			labLink = 'https://www.undp.org/acceleratorlabs/';
		} else labLink = `https://www.undp.org/acceleratorlabs/${lab?.toLowerCase().replace(/\s/g, '-')}`; // FORMAT: undp-algeria-accelerator-lab
	}

	const { setSharedState, sharedState } = useSharedState();
  	const { isLogedIn } = sharedState || {};

	const showAddToBoardModal = () => {
		setSharedState((prevState: any) => ({
		  ...prevState,
		  addToBoard: {
			showAddToBoardModal: true,
			platform,
			id,
			pinboards,
		  },
		}));
	  };

  	return (
	<section className='relative home-section !border-t-0 grid-bg pt-[140px] lg:pt-0 pb-[40px] lg:pb-[80px] overflow-hidden'>
	    <div className='inner w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px] mx-auto'>
		    <div className='section-content grid grid-cols-9 gap-[20px] px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] pt-[40px] lg:pt-[80px]'>
		        <div className='c-left col-span-9 md:col-span-5 lg:col-span-5 lg:mt-[80px] lg:mb-[60px]'>
	            	<span className={clsx('slanted-bg full', color)}>
	            		<span><b>{padtype}</b></span>
	            	</span>
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
					{!isLogedIn ? null : (
					<Button onClick={showAddToBoardModal} className="grow-0 border-l-0 mt-5">
						Add to board
					</Button>
					)}
		        </div>
		    </div>
		</div>
		{!vignette ? null : (
			<div className='hidden md:block lg:block gradient-img c-right absolute h-full right-0 top-0 w-[40%] border-l-[1px] border-solid bg-white'>
				<img className='h-full min-w-full object-contain' alt='Pad vignette' src={vignette?.replace('/sm/', '/')} />
			</div>
		)}
	</section>
  );
}