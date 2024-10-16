"use client";

export default function Hero() {

  return (
  	<div className='p-[80px] grid-bg mt-[90px] relative'>
  		<div className='w-[45%] mb-[30px]'>
  			<div className='w-[90%] mb-[30px]'>
	  			<h1 className='text-[62px] leading-[69px] mb-[30px] font-bold'>SDG Commons powered by UNDP</h1>
	  			<p className='text-[20px] leading-[28px]'>Building a 21st-century architecture for global public goods, requires sharing openly and scaling data, insights, solutions and next practices for the Sustainable Development Goals (SDGs). Join the Accelerator Labs on this journey as we open up our body of work, and come shape the SDG Commons with us.</p>
	  		</div>
	  		{/* Search bar */}
	  		<form method='GET' className='flex flex-row mb-[30px] group z-[10] relative'>
	  		{/* TO DO: FINISH FORM */}
	  			<input type='text' name='search' className='py-[18px] px-[22px] w-[70%] bg-white border-black' id='main-search-bar' placeholder='What are you looking for?' />
	  			<button type='submit' className='w-[30%] relative border-[1px] border-l-0 border-black font-bold font-space-mono detach'>
	  				Search
	  				{/*<div className='absolute h-[100%] w-[100%] top-[-10px] right-[-10px] bg-lime-yellow z-[-1]  transition-all duration-150 group-hover:top-[0px] group-hover:right-[0px]'></div>*/}
	  			</button>
	  		</form>
	  		<a href='/' className='font-bold underline'>Get SDG Inspired</a>
  		</div>
  		<img className='w-[40%] absolute right-0 bottom-[-15%]' alt="Branding illustration" src="/images/hero_hand_02.png" />
  	</div>
  );
}