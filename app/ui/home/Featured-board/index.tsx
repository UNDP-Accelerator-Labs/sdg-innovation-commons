'use client';

import { useState } from 'react';
import { Button } from '@/app/ui/components/Button';
import Link from 'next/link';
import Card from '@/app/ui/components/Card/featured-card';

export default function Section() {
    // Array of slides (background image, title, description, etc.)
    const slides = [
        {
            backgroundImage: 'images/Rectangle 15.png',
            title: 'Featured Country Boards ',
            description: 'Small Islands Developing States',
            cardTitle: 'Board Name Lorem',
            cardDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut accumsan diam adipiscing elit.',
            viewCount: 145,
            cardTags: ['SIDS'],
        },
        {
            backgroundImage: 'images/Rectangle 15-2.png',
            title: 'Featured Country Boards',
            description: 'Least Developed Countries',
            cardTitle: 'Vietnam Board',
            cardDescription: 'Focusing on the sustainability and development in mountain regions.',
            viewCount: 123,
            cardTags: ['Country'],
        },
        {
            backgroundImage: 'images/Rectangle 15-3.png',
            title: 'Coastal Communities',
            description: 'Addressing challenges faced by coastal communities and their ecosystems.',
            cardTitle: 'Coastal Board',
            cardDescription: 'Sustainable development practices for coastal communities.',
            viewCount: 98,
            cardTags: ['Coast'],
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
        <div className="w-full relative bg-white h-[872px] overflow-hidden shrink-0 text-center text-3xl text-black">
            {/* Background Image */}
            <img className="absolute top-[1px] left-0 w-full h-[870px] object-cover" alt="" src={currentData.backgroundImage} />

            {/* Title and Description */}
            <div className="absolute top-[0px] left-[0px] w-[587px] flex flex-col items-start justify-start pt-[137px] pb-0 pl-[93px] pr-0 box-border text-left text-white">
                <img className="w-[594.5px] absolute !m-[0] top-[209px] left-[79.47px] h-[26px] z-[0]" alt="" src="images/Rectangle 86.svg" />
                <b className="self-stretch relative leading-[48px] z-[1]">{currentData.title}</b>
                <b className="relative text-17xl leading-[46px] z-[2] mb-10">{currentData.description}</b>
                <Button className="absolute w-[248px] h-[80.3px] text-lg bg-transparent">
                    <Link href={'#'} className="leading-[22px]">
                        All Boards
                    </Link>
                </Button>
            </div>

            {/* Featured Card */}
            <div className='pr-[111px]'>
            <Card
                title={currentData.cardTitle}
                description={currentData.cardDescription}
                tags={currentData.cardTags}
                href={'/'}
                viewCount={currentData.viewCount}
                backgroundImage="images/Rectangle 68.png"
            />
            </div>

            {/* Slide Number */}
            <div className="absolute top-[676px] left-[78px] w-[184px] h-[60px] text-[16px] text-white">

            <img className="w-full absolute max-w-full overflow-hidden h-[60px] object-contain left-0" alt="" src="images/Arrow-left.svg" onClick={handlePrevSlide} />
                <div className="absolute top-[19px] left-[110px] w-[67px] h-[22px]">
                    <b className="absolute top-[0px] left-[0px] leading-[22px]">
                        {`${currentSlide + 1} / ${slides.length}`}
                    </b>
                </div>
                <img className="w-full relative max-w-full overflow-hidden h-[60px] object-contain left-[70px]" alt="" src="images/Arrow-right.svg" onClick={handleNextSlide} />
            </div>
        </div>
    );
}
