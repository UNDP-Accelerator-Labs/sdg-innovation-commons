export default function Hero() {
  	return (
  	<>
  		<section className='relative home-section !border-t-0 pt-[120px] lg:pt-0 lg:pb-[80px] z-[0]'>
  			<img className='absolute right-[30%] md:right-[5%] top-[90px] z-[0]' alt='Branding illustration' src='/images/hands/home_top.svg' />
  			<img className='absolute left-[0%] bottom-[-45%] z-[0] scale-[-1] z-[-1]' alt='Branding illustration' src='/images/hands/home_bottom.svg' />

		    <div className='inner relative w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px] mx-auto'>
			    <div className='section-content grid grid-cols-9 gap-[20px] px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] pt-[80px]'>
			        <div className='c-left col-span-9 lg:col-span-5 mb-[80px] lg:mb-[40px] lg:mt-[80px]'>
		            	<h1>
		            		<span className='slanted-bg yellow'>
		            			<span>About</span>
		            		</span>
		            	</h1>
		            	{/*<p className='lead'>Explore our notes on solutions to SDG priorities and problems mapped around the world.</p>*/}
			        </div>
			    </div>
			</div>
  		</section>
  	</>
  );
}