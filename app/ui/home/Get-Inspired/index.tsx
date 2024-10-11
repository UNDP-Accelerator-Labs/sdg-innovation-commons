
import { LinkNav } from '@/app/ui/components/Link';
import { Button } from '@/app/ui/components/Button';
import Link from 'next/link';

export default function Section() {
    
    return (
        <div className="w-full relative flex flex-col lg:items-start justify-start text-left text-9xl text-black grid-background border-black border-t-[1px] border-solid">
            <div className='lg:my-[100px] lg:mx-[80px] '>
                <div className="flex flex-col items-start justify-start py-10 lg:py-[40px] px-0 z-[1]">
                    <div className="w-[375px] md:w-[70%] flex flex-col lg:flex-row items-start justify-start py-0 px-5 box-border gap-[30px]">
                        <div className="w-[254.4px] flex flex-col items-start justify-start relative">
                            <div className="w-[180px] !m-[0] absolute top-[22.78px] left-[-1.5px] flex flex-col items-start justify-start z-[0]">
                                <img className="self-stretch relative max-w-full overflow-hidden h-[16.2px] shrink-0" alt="" src="Rectangle 99.svg" />
                            </div>
                            <b className="relative leading-[38px] z-[1]">Get Inspired</b>
                        </div>
                        <b className="self-stretch relative text-2xl leading-[28px] lg:left-[50%] lg:w-[40%] ">
                            <p className="m-0">Next Practices for the SDGs.</p>
                            <p className="m-0">Explanation about the Boards idea, lorem ipsum dolor sti amet consectetur lorem ipsum dolor</p>
                        </b>
                    </div>
                </div>
                <div className="self-stretch overflow-x-auto flex flex-col lg:items-start justify-start z-[2] text-2xl">
                    <div className="w-[920px] lg:w-full flex flex-col items-start justify-start">
                        <div className="grid grid-cols-3 items-start justify-start py-0 px-5 gap-5 lg:gap-[50px]">
                            {cards.map((card, index) => (
                                <div key={index} className="w-[282px] lg:w-[450px] bg-white border-black border-[1px] border-solid box-border h-[278.7px] lg:h-[360px] flex flex-col items-start justify-start">
                                    <div className="w-[280px] lg:w-[450px] flex-1 relative">
                                        <img
                                            className="absolute h-full w-[282px] lg:w-[450px] top-[0%] right-[0%] bottom-[0%] left-[0%] max-w-full overflow-hidden max-h-full object-cover mix-blend-normal"
                                            alt=""
                                            src={card.imageSrc}
                                        />
                                        <div className="absolute h-full w-[282px] lg:w-[450px] top-[0%] right-[0%] bottom-[0%] left-[0%] [background:linear-gradient(173.09deg,_rgba(1,_141,_242,_0.35),_rgba(237,_255,_164,_0.35))] mix-blend-normal" />
                                    </div>
                                    <div className="self-stretch border-black border-t-[1px] border-solid flex flex-col items-start justify-start py-4 px-3 grid-background">
                                        <div className="self-stretch flex flex-row items-end justify-between">
                                            <b className="flex-1 relative leading-[28px]">{card.title}</b>
                                            <LinkNav
                                                className="w-[42.5px] relative h-[41.9px]"
                                                href={card.href}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="self-stretch flex flex-col items-start justify-start z-[3] text-center text-[14px]">
                    <div className="w-full flex flex-col items-start justify-start pt-[30px] px-5 pb-10 box-border">
                        <div className="self-stretch flex flex-col items-end justify-start">
                            <Button className='w-[166.3px] relative h-[53.8px]'>
                                <Link href={'#'} className='leading-[22px]'>
                                    All Boards
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const cards = [
    {
        title: 'Circular Economy',
        imageSrc: 'images/Rectangle 68.png',
        href: '#'
    },
    {
        title: 'Food Systems',
        imageSrc: 'images/Rectangle 68-2.png',
        href: '#'
    },
    {
        title: 'Digital Financial Inclusion',
        imageSrc: 'images/Rectangle 68-3.png',
        href: '#'
    },
];