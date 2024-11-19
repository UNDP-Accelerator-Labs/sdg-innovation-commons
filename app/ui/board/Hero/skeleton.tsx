export default async function Hero() {
	return (
	  	<>
	  	<section className='relative home-section !border-t-0 grid-bg lg:pb-[60px]'>
			<div className='inner w-[1440px] mx-auto'>
				<div className='section-content grid grid-cols-9 gap-[20px] lg:px-[80px] lg:pt-[80px]'>
					<div className='c-left lg:col-span-5 lg:mt-[80px] lg:mb-[20px]'>
		            	<h1 className='w-[75%] h-10 bg-gray-600 rounded-md'></h1>
						<p className='w-[50%] h-5 bg-gray-400 rounded-md'></p>
		            	<p className='w-[33%] h-4 bg-gray-300 rounded-md'></p>
						<div className='flex flex-wrap flex-row gap-1.5 mb-[40px] mt-[40px]'>
							{(new Array(3)).fill(0).map((d: number, i: number) => (
									<button className='chip bg-light-gray-shade' key={i}>Tag</button>
								)
							)}
						</div>
						<div className='stats-cartouche lg:p-[20px] inline-block flex flex-row justify-between items-center'>
							<div className='w-full h-5 bg-gray-400 rounded-md mr-[40px]'></div>
							<div className='w-full h-5 bg-gray-400 rounded-md mr-[40px]'></div>
							<div className='w-full h-5 bg-gray-400 rounded-md mr-[40px]'></div>
							<div className='w-full h-5 bg-gray-400 rounded-md'></div>
						</div>
					</div>
					{/*<div className='c-right lg:col-span-4 lg:mt-[80px] lg:mb-[20px]'>
							<img src={mapFile} className='gradient-img absolute w-[calc(100%+200px)] min-h-[calc(100%+160px)] top-[-160px] right-[-80px] object-contain' />
					</div>*/}
				</div>
			</div>
	  	</section>
	  	</>
	)
}