'use client';
import { useRef, useEffect } from 'react';

interface Props {
	description: string;
	vignette: string;
}

export default function Infobar({
	description,
	vignette
}: Props) {
	const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) ref.current.innerHTML = description ? description.replace(/\n+/g, '<br/>') : '';
    }, [ref]);

  	return (
	  	<>
	  	<section className='home-section relative mb:py-[40px] lg:py-[80px] overflow-hidden'>
		    <div className='hidden md:block lg:hidden gradient-img c-right max-h-[75vh] w-full overflow-hidden'>
				<img className='absolute right-0 top-0 z-[100]' alt='Branding illustration' src="/images/hands/board.svg" />
				<img src={vignette?.replace(/\/sm\//, '/')} className='min-h-full block w-full object-contain' />
			</div>
		    <div className='inner w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px] mx-auto'>
			    <div className='section-content grid grid-cols-9 gap-[20px] px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] md:pt-[40px] md:pb-[20px] lg:py-0'>
			        <div className='c-left col-span-9 lg:col-span-5 z-[150]'>
		            	<p ref={ref} className='lead font-bold'>{description}</p>
			        </div>
			    </div>
			</div>
			<div className='hidden lg:block gradient-img c-right absolute h-full right-0 top-0 lg:w-[35%]'>
				<img className='absolute right-0 top-0 z-[100]' alt="Branding illustration" src="/images/hands/board.svg" />
				<img src={vignette?.replace(/\/sm\//, '/')} className='min-h-full w-full object-contain' />
			</div>
	  	</section>
	  	</>
  	);
}