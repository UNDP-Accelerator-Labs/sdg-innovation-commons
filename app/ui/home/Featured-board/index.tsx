'use client';

import { useState } from 'react';
import { Button } from '@/app/ui/components/Button';
import Link from 'next/link';
import Card from '@/app/ui/components/Card/featured-card';

export default function Section() {
    const slides = [
        {
            backgroundImage: 'images/Rectangle 15.png',
            title: 'Featured Country Boards ',
            description: 'Small Islands Developing States',
            cardTitle: 'Board Name Lorem',
            cardDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut accumsan diam adipiscing elit.',
            viewCount: 145,
            cardTags: ['SIDS'],
            cardBackgroundImage: "images/Rectangle 68.png"
        },
        {
            backgroundImage: 'images/Rectangle 15-2.png',
            title: 'Featured Country Boards',
            description: 'Least Developed Countries',
            cardTitle: 'Vietnam Board',
            cardDescription: 'Focusing on the sustainability and development in mountain regions.',
            viewCount: 123,
            cardTags: ['Country'],
            cardBackgroundImage: "images/Rectangle 68.png"
        },
        {
            backgroundImage: 'images/Rectangle 15-3.png',
            title: 'Coastal Communities',
            description: 'Addressing challenges faced by coastal communities and their ecosystems.',
            cardTitle: 'Coastal Board',
            cardDescription: 'Sustainable development practices for coastal communities.',
            viewCount: 98,
            cardTags: ['Coast'],
            cardBackgroundImage: "images/Rectangle 68.png"
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0); // Manage the current slide index

    // Function to handle slide change on arrow click
    const handleNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
    };

    const currentData = slides[currentSlide]; // Get the current slide data

    return (
        <div className="w-full relative h-[600px] md:h-[800px] lg:h-[872px] overflow-hidden shrink-0 flex flex-col items-start justify-between py-10 px-5 md:py-[60px] md:px-10 box-border text-left text-xl lg:text-3xl text-white">
            <img className="w-full absolute !m-[0] top-[1px] left-0 h-[600px] md:h-[800px] lg:h-[872px] object-cover z-[0]" alt="" src={currentData.backgroundImage} />
            <div className="self-stretch flex flex-col items-start justify-start z-[1] lg:my-[75px] lg:mx-[93px] ">
                <b className="self-stretch relative leading-[38px] text-xl">{currentData.title}</b>
                <div className="w-[254.4px] md:w-full flex flex-col items-start justify-start relative text-9xl">
                    <img className="w-[269.5px] md:max-w-full absolute !m-[0] top-[62px] md:top-[22.78px] left-[-6px] h-[16.2px] z-[0]" alt="" src="images/Rectangle 99-2.svg" />
                    <div className="w-[180px] !m-[0] absolute top-[22.78px] left-[-1.5px] flex flex-col items-start justify-start z-[1] md:hidden lg:hidden">
                        <img className="self-stretch relative max-w-full overflow-hidden h-[16.2px] shrink-0" alt="" src="images/Rectangle 99-2.svg" />
                    </div>
                    <b className="relative leading-[38px] z-[2]">
                        {currentData.description}
                    </b>
                </div>
                <Button className="w-[166.3px] relative h-[53.8px] text-center text-sm text-black bg-transparent mt-[40px] hidden lg:flex md:flex ">
                    <Link href={'#'} className="leading-[22px] text-sm lg:text-lg ">
                        All Boards
                    </Link>
                </Button>
            </div>
            <div className="self-stretch flex flex-col items-start justify-start gap-[30px] z-[2] text-lg text-black lg:my-[137px] lg:mx-[93px]">

                <Card
                    title={currentData.cardTitle}
                    description={currentData.cardDescription}
                    tags={currentData.cardTags}
                    href={'/'}
                    viewCount={currentData.viewCount}
                    backgroundImage={currentData.cardBackgroundImage}
                    className="w-[337px] md:w-[551px] md:gap-[30px] lg:top-[136px] lg:left-[850px] lg:w-[413px] lg:h-[600px] lg:absolute lg:text-left lg:mx-[90px] border-black border-[1px] border-solid box-border flex flex-col items-start justify-start"
                />

                <div className="self-stretch flex flex-row items-end justify-between text-center text-xl text-white">
                    {/* Slide Number */}
                    <span className="relative leading-[38px] text-xl ">
                        <img className="w-full absolute max-w-full overflow-hidden h-[60px] object-contain left-0" alt="" src="images/Arrow-left.svg" onClick={handlePrevSlide} />
                        <div className="absolute top-[19px] left-[45px] w-[67px] h-[22px]">
                            <b className="absolute top-[0px] left-[0px] leading-[22px]">
                                {`${currentSlide + 1} / ${slides.length}`}
                            </b>
                        </div>
                        <img className="w-full relative max-w-full overflow-hidden h-[60px] object-contain left-[70px]" alt="" src="images/Arrow-right.svg" onClick={handleNextSlide} />
                    </span> 
                    <Button className="w-[166.3px] relative h-[53.8px] text-sm text-black bg-transparent lg:hidden md:hidden ">
                        <Link href={'#'} className="leading-[22px] text-sm lg:text-lg ">
                            All Boards
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
