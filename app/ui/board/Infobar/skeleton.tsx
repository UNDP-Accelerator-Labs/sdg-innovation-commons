export default function Infobar() {
  	return (
	  	<>
	  	<section className='home-section relative lg:py-[80px] overflow-hidden'>
		    <div className='inner w-[1440px] mx-auto'>
			    <div className='section-content grid grid-cols-9 gap-[20px] lg:px-[80px]'>
			        <div className='c-left lg:col-span-5'>
		            	<div className='w-[97%] h-4 mb-[10px] bg-gray-400 rounded-md'></div>
		            	<div className='w-[95%] h-4 mb-[10px] bg-gray-400 rounded-md'></div>
		            	<div className='w-[100%] h-4 mb-[10px] bg-gray-400 rounded-md'></div>
		            	<div className='w-[98%] h-4 mb-[10px] bg-gray-400 rounded-md'></div>
		            	<div className='w-[96%] h-4 mb-[10px] bg-gray-400 rounded-md'></div>
		            	<div className='w-[94%] h-4 mb-[10px] bg-gray-400 rounded-md'></div>
		            	<div className='w-[98%] h-4 mb-[10px] bg-gray-400 rounded-md'></div>
		            	<div className='w-[97%] h-4 mb-[10px] bg-gray-400 rounded-md'></div>
			        </div>
			    </div>
			</div>
			<div className='gradient-img c-right absolute h-full right-0 top-0 lg:w-[35%]'>
				{/*<img className='absolute right-0 top-0 z-[100]' alt="Branding illustration" src="/images/hands/board.svg" />*/}
				{/*<img src={vignette?.replace(/\/sm\//, '/')} className='min-h-full w-full object-contain' />*/}
			</div>
	  	</section>
	  	</>
  	);
}