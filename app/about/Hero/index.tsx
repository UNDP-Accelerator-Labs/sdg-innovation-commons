export default function Hero() {
	return (
		<>
			<section className='relative home-section !border-t-0 grid-bg pt-[120px] lg:pt-0 lg:pb-[80px]'>
				<img id="arm" className='w-[60%] lg:w-[60%] absolute right-[10%] lg:right-[5%] top-[20%] md:top-[18%] lg:top-[3%]' alt='Branding illustration' src='/images/hands/about_us_top.png' />
				<img className='w-[20%] lg:w-[15%] absolute right-0 md:right-[15%] lg:right-[15%] top-[40%] lg:top-[30%] hidden lg:flex' alt="Branding illustration" src='/images/hero_image.svg' />
				<img className='w-[60%] lg:w-[50%] absolute right-[15%] md:right-0 lg:right-[5%] bottom-[-1px]' alt="Branding illustration" src='/images/hands/about_us.svg' />

				<div className='inner w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px] mx-auto'>
					<div className='section-content grid grid-cols-9 gap-[20px] px-0 lg:px-[80px] xl:px-[40px] xxl:px-[80px] pt-[80px]'>
						<div className='c-left col-span-9 lg:col-span-5 mb-[80px] lg:mb-[40px] lg:mt-[80px]'>
							<h1>
								<span className='slanted-bg yellow'>
									<span>About Us</span>
								</span>
							</h1>
							<p className='lead'>
								The SDG Commons is a resource hub of nearly 8,000 documents created by the UNDP Accelerator Labs, UNDP’s open, globally distributed R&D capability for the Sustainable Development Goals (SDGs).
							</p>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}