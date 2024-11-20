'use client'
import Navbar from '@/app/ui/components/Navbar';
import { Button } from '@/app/ui/components/Button';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body>
                <Navbar />
                <div className="w-full  min-h-screen relative grid-bg overflow-hidden text-center text-base text-black ">
                    {/* <img className="w-[545.8px] absolute !m-[0] top-[178.96px] left-[1062.6px] rounded-101xl h-[804.9px] object-contain z-[1]" alt="" src="images/Vector 37.svg" /> */}
                    <div className="self-stretch  flex flex-row items-center justify-center pt-40 px-20 pb-[100px] relative gap-[23px] z-[2] text-43xl ">
                        <div className="flex-1 flex flex-col items-center justify-start relative gap-[23px] z-[1]">
                            <div className="flex flex-col items-center justify-start relative gap-[30px] z-[3]">
                                <div className='flex flex-col w-[160px]'>
                                    <div className="self-stretch relative leading-[69px] z-[1] slanted-bg yellow "><span>500</span></div>
                                </div>
                                <b className="w-[632.7px] relative text-17xl leading-[46px] inline-block z-[2]">Something went wrong</b>
                            </div>
                            <img className="w-[721px] absolute !m-[0] top-[-208px] left-[-170.5px] rounded-101xl h-[729px] z-[1]" alt="" src="/images/Vector 36.svg" />
                            <div className="w-[682px] flex flex-col items-start justify-start z-[3] text-left text-base">
                                <div className="w-[682px] flex flex-col items-center justify-center">
                                    <Button onClick={() => reset()}>
                                        Try again
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    )
}

