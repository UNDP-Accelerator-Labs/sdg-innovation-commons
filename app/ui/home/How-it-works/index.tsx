import { Button } from '@/app/ui/components/Button';
import Link from 'next/link';

export default async function Section() {
    return (
        <div className="w-full relative bg-white border-black border-t-[1px] border-solid box-border overflow-hidden flex flex-col items-center justify-end py-[40px] lg:py-[100px] px-[20px] gap-[100px] text-left text-17xl text-black grid-background md:bg-none lg:bg-none">

            {/* Left and Right Background Images */}
            <div className="hidden md:flex lg:flex absolute inset-0 w-full h-full">
                <div
                    className="absolute inset-y-0 left-0 w-1/2 h-full bg-[url('/images/Union.svg')] bg-no-repeat bg-left bg-contain"
                    aria-hidden="true"
                ></div>
                <div
                    className="absolute inset-y-0 right-0 w-1/2 h-full bg-[url('/images/Union-2.svg')] bg-no-repeat bg-right bg-contain"
                    aria-hidden="true"
                ></div>
            </div>

            <div className="self-stretch flex flex-col lg:flex-row items-start justify-start py-0 lg:px-20 lg:gap-[364px] z-[2]">
                <div className="w-[285.7px] relative h-[54px]">
                    <img className="absolute top-[28px] left-[0px] w-[285.7px] h-[26px]" alt="" src="images/Rectangle 89.svg" />
                    <b className="absolute top-[0px] left-[22px] leading-[46px] text-9xl lg:text-17xl">How it Works</b>
                </div>
                <div className="flex-1 flex flex-col items-start justify-start gap-10 text-lg">
                    <b className="w-[517.5px] relative leading-[30px] inline-block lg:text-3xl text-2xl px-[20px] lg:px-0 pt-[20px] lg:py-0 ">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.</b>

                    <Button className='text-lg h-[70px] lg:w-[238px] w-[159.5px]'>
                        <Link href={'#'} className='leading-[22px]'>
                            Join Platform
                        </Link>
                    </Button>

                </div>
            </div>
            <div className="self-stretch flex flex-col items-start justify-start z-[3] text-lg">
                <div className="self-stretch flex flex-row items-start justify-start py-0 pl-20 md:pl-0 lg:pl-0 lg:mx-[80px] md:mx-[40px] ">
                    {/* Grid system for responsive layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {cards.map((card) => (
                            <div key={card.id} className=" w-[305px] lg:w-[305px] md:w-[323px] relative h-72 md:h-[190px] lg:h-72 ">
                                <div className="absolute top-[0px] left-[0px] w-[305px] md:w-[323px] lg:w-[305px] h-72 md:h-[190px] lg:h-72  ">
                                    <div className="absolute top-[0px] left-[0px] bg-posted-grey border-black border-[1px] border-solid box-border w-[305px] lg:w-[305px] md:w-[323px] h-72 lg:h-72 md:h-[190px] " >
                                        <div className="absolute top-[96px] lg:top-[179px] left-[31px] leading-[26px] inline-block w-[255px] text-base lg:text-lg">
                                            {card.text}
                                        </div>
                                    </div>
                                </div>
                                <b className="absolute top-[34px] left-[30px] text-13xl lg:text-23xl leading-[48px] inline-block w-[150px]">{card.number}</b>
                                <img className="absolute top-[30px] left-[219px] w-14 h-14 overflow-hidden lg:flex hidden" alt="" src="images/Layer_1.svg" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>);
};

const cards = [
    {
        id: 1,
        text: "Working on a wicked challenge? Get in touch with a Lab to co-create.",
        number: "01",
    },
    {
        id: 2,
        text: (
            <>
                <p className="m-0">Submit on the ground</p>
                <p className="m-0">SDG solutions you see.</p>
            </>
        ),
        number: "02",
    },
    {
        id: 3,
        text: "Share your actionable insights and learnings.",
        number: "03",
    },
    {
        id: 4,
        text: "Create your own SDG inspiration board.",
        number: "04",
    },
];