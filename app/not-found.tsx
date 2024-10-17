import Navbar from '@/app/ui/components/Navbar';

export default async function NotFound() {
    return (
        <>
            <Navbar />
            <div className="w-full  min-h-screen relative grid-bg overflow-hidden text-center text-base text-black ">
                {/* <img className="w-[545.8px] absolute !m-[0] top-[178.96px] left-[1062.6px] rounded-101xl h-[804.9px] object-contain z-[1]" alt="" src="images/Vector 37.svg" /> */}
                <div className="self-stretch  flex flex-row items-center justify-center pt-40 px-20 pb-[100px] relative gap-[23px] z-[2] text-43xl ">
                    <div className="flex-1 flex flex-col items-center justify-start relative gap-[23px] z-[1]">
                        <div className="flex flex-col items-center justify-start relative gap-[30px] z-[3]">
                            <div className='flex flex-col w-[160px]'>
                                <div className="self-stretch relative leading-[69px] z-[1] slanted-bg-yellow "><span>404</span></div>
                            </div>
                            <b className="w-[632.7px] relative text-17xl leading-[46px] inline-block z-[2]">Something went wrong</b>
                            <div className="w-[632.7px] relative text-xl leading-[28px] font-medium inline-block z-[3]">Explore our curated collection of blogs and publications that foster collaboration, innovation, and continuous learning within the Accelerator Lab networks.</div>
                        </div>
                        <img className="w-[721px] absolute !m-[0] top-[-208px] left-[-170.5px] rounded-101xl h-[729px] z-[1]" alt="" src="images/Vector 36.svg" />
                        <div className="w-[682px] flex flex-col items-start justify-start z-[3] text-left text-base">
                            <div className="w-[682px] flex flex-col items-start justify-end">
                                <div className="self-stretch flex flex-col items-start justify-end">
                                    <div className="self-stretch flex flex-row items-end justify-start gap-10">
                                        {/* TODO: Make Jeremy's Search Input a component and import here */}
                                        <div className="w-[522px] flex flex-row items-end justify-start">
                                            <div className="flex-1 bg-white border-black border-t-[0.7px] border-solid border-b-[0.7px] border-l-[0.7px]  box-border h-[60px] flex flex-row items-center justify-start py-[18px] px-[22px]">
                                                <div className="relative leading-[26px]">Looking for something?</div>
                                            </div>
                                            <div className="w-[72px] relative h-[71px]">
                                                <div className="absolute h-[84.51%] w-[87.5%] top-[0%] right-[0%] bottom-[15.49%] left-[12.5%] bg-lime-yellow" />
                                                <div className="absolute h-[84.51%] w-[87.5%] top-[15.49%] right-[12.5%] bottom-[0%] left-[0%] border-black border-[1px] border-solid box-border" />
                                                <img className="absolute h-[33.8%] w-[33.33%] top-[26.03%] right-[28.47%] bottom-[40.17%] left-[38.19%] max-w-full overflow-hidden max-h-full" alt="" src="images/search-sm.svg" />
                                            </div>
                                        </div>
                                        {/* TODO: Make Filter and children a component and import here */}
                                        <div className="flex flex-row items-end justify-center">
                                            <div className="shadow-[0px_0px_0px_1px_rgba(16,_24,_40,_0.18)_inset,_0px_-2px_0px_rgba(16,_24,_40,_0.05)_inset,_0px_1px_2px_rgba(16,_24,_40,_0.05)] bg-white border-black border-[1px] border-solid box-border h-[60px] overflow-hidden flex flex-row items-center justify-center p-5 gap-2.5">
                                                <img className="w-5 relative h-5 overflow-hidden shrink-0" alt="" src="images/filter-lines.svg" />
                                                <div className="flex flex-row items-center justify-center py-0 px-spacing-xxs">
                                                    <div className="relative leading-[26px]">Filters</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}