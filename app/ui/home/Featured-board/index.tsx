'use client';
import { useState, useRef } from 'react';
import { Button } from '@/app/ui/components/Button';
import { useIsVisible } from '@/app/ui/components/Interaction';
import Link from 'next/link';
import Card from '@/app/ui/components/Card/featured-card';
import clsx from 'clsx';

export default function Section() {
    const slides = [
        {
            backgroundImage: '/images/Rectangle 15.png',
            title: 'Featured Country Boards ',
            description: 'Small Islands Developing States',
            cardTitle: 'Board Name Lorem',
            cardDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut accumsan diam adipiscing elit.',
            viewCount: 145,
            cardTags: ['SIDS'],
            cardBackgroundImage: "images/Rectangle 68.png"
        },
        {
            backgroundImage: '/images/Rectangle 15-2.png',
            title: 'Featured Country Boards',
            description: 'Least Developed Countries',
            cardTitle: 'Vietnam Board',
            cardDescription: 'Focusing on the sustainability and development in mountain regions.',
            viewCount: 123,
            cardTags: ['Country'],
            cardBackgroundImage: "images/Rectangle 68.png"
        },
        {
            backgroundImage: '/images/Rectangle 15-3.png',
            title: 'Coastal Communities',
            description: 'Addressing challenges faced by ecosystems.',
            cardTitle: 'Coastal Board',
            cardDescription: 'Sustainable development practices for coastal communities.',
            viewCount: 98,
            cardTags: ['Coast'],
            cardBackgroundImage: "images/Rectangle 68.png"
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0); // Manage the current slide index
    const [animate, setAnimate] = useState(true); // Manage animation

    const handleNextSlide = () => {
        setAnimate(false); // Disable animation temporarily to reset
        setTimeout(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
            setAnimate(true); // Re-enable animation
        }, 100); // Delay for smooth reset
    };

    const handlePrevSlide = () => {
        setAnimate(false); // Disable animation temporarily to reset
        setTimeout(() => {
            setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
            setAnimate(true); // Re-enable animation
        }, 100); // Delay for smooth reset
    };

    const currentData = slides[currentSlide]; // Get the current slide data

    const ref1 = useRef<HTMLDivElement>(null);
    const isVisible1 = useIsVisible(ref1);

    return (
        <>
        <section className='relative lg:home-section lg:py-[80px] overflow-hidden min-h-[100vh] flex items-center'>
            <img className={clsx("w-full absolute !m-[0] top-[1px] left-0 h-[600px] md:h-[800px] lg:h-[872px] object-cover z-[0]", { 'opacity-0 transition-opacity duration-500': !animate })} alt="" src={currentData.backgroundImage} />
            <div className='inner lg:mx-auto lg:px-[80px] lg:w-[1440px]'>
            {/*<section className='relative lg:home-section lg:px-0 lg:py-0 !border-t-0 overflow-hidden'>*/}
                <div className='section-content'>
                    <div className='grid gap-[20px] lg:grid-cols-3'>
                        <div className='c-left lg:col-span-2 flex flex-col'>
                            <div>
                                {/*<p className='lead text-white font-space-mono mb-0'>
                                    <b>{currentData.title}</b>
                                </p>*/}
                                <h2 ref={ref1} className={`dark blue lg:mt-[5px] ${isVisible1 ? 'slanted-bg' : ''}`}>
                                    {/*<span>{currentData.description}</span>*/}
                                    <span>Featured Thematic Boards</span>
                                </h2>
                            </div>
                            <div>
                                <Button className='block mt-[10px]'>
                                    <Link href={'/boards'}>
                                        All Boards
                                    </Link>
                                </Button>
                            </div>
                            <div className='mt-auto'>
                                <div className='flex justify-start items-center'>
                                    <img className='cursor-pointer' alt='Arrow left' src='images/Arrow-left.svg' onClick={handlePrevSlide} />
                                    <p className='text-white font-space-mono my-0'>
                                        <b>{`${currentSlide + 1} / ${slides.length}`}</b>
                                    </p>
                                    <img className='cursor-pointer' alt='Arrow right' src='images/Arrow-right.svg' onClick={handleNextSlide} />
                                </div>
                            </div>
                        </div>

                        <div className='c-right'>
                            <Card
                                title={currentData.cardTitle}
                                description={currentData.cardDescription}
                                tags={currentData.cardTags}
                                href={'/'}
                                viewCount={currentData.viewCount}
                                backgroundImage={currentData.cardBackgroundImage}
                                className={clsx("transition-transform duration-500 transform", { 'translate-x-0': animate, 'translate-x-full': !animate })}
                                openInNewTab={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </>
    );
}
