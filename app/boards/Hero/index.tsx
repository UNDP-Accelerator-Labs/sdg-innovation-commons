'use client';
import { useState, useRef, createRef, RefObject } from 'react';
import { Button } from '@/app/ui/components/Button';
import { useIsVisible } from '@/app/ui/components/Interaction';
import Link from 'next/link';
import Card from '@/app/ui/components/Card/featured-card';
import clsx from 'clsx';
// import Filters from '../Filters';

export default function Section() {
    const slides = [
        {
            id: 0,
            backgroundImage: 'images/Rectangle 15.png',
            title: 'Next best practices for the SDGs',
            description: 'Small Islands Developing States',
            cardTitle: 'Board Name Lorem',
            cardDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut accumsan diam adipiscing elit.',
            viewCount: 145,
            cardTags: ['SIDS'],
            cardBackgroundImage: "images/Rectangle 68.png"
        },
        {
            id: 0,
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
            id: 0,
            backgroundImage: 'images/Rectangle 15-3.png',
            title: 'Coastal Communities',
            description: 'Addressing challenges faced by ecosystems.',
            cardTitle: 'Coastal Board',
            cardDescription: 'Sustainable development practices for coastal communities.',
            viewCount: 98,
            cardTags: ['Coast'],
            cardBackgroundImage: "images/Rectangle 68.png"
        },
    ];

    /*
        Credit: https://stackoverflow.com/questions/54633690/how-can-i-use-multiple-refs-for-an-array-of-elements-with-hooks
    */
    const elRefs = useRef<Array<RefObject<HTMLDivElement> | null>>([]);
    if (elRefs.current.length !== slides.length) {
        // add or remove refs
        elRefs.current = Array(slides.length)
        .fill(0)
        .map((_, i) => elRefs.current[i] || createRef());
    }

    const [currentSlide, setCurrentSlide] = useState(0); // Manage the current slide index
    const [animate, setAnimate] = useState(true); // Manage animation

    const handleNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        elRefs?.current[(currentSlide + 1) % slides.length]?.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
        elRefs?.current[(currentSlide || slides.length) - 1]?.current?.scrollIntoView({ behavior: "smooth" });
    };

    const currentData = slides[currentSlide]; // Get the current slide data

    const ref1 = useRef<HTMLDivElement>(null);
    const isVisible1 = useIsVisible(ref1);

    // const [searchQuery, setSearchQuery] = useState<string>(searchParams.search || '');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filterVisibility, setFilterVisibility] = useState<boolean>(false);

    return (
        <>
        <section className='relative lg:home-section lg:py-[80px] overflow-hidden min-h-[100vh] flex items-center'>
            
            <div className='caroussel w-full min-h-[100vh] absolute ml-[calc((100% - 100vw) / 2)]'>
                <div className='slides flex items-center justify-between flex-nowrap snap-x w-full overflow-auto box-border'>
                    {slides.map((d: any, i: number) => {
                        return (
                            <div key={i} 
                                ref={elRefs.current[i]}
                                className='silde relative snap-center w-full flex-none'
                            >
                                <img src={d.backgroundImage} className='w-[100vw]' />
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className='inner lg:mx-auto lg:px-[80px] lg:w-[1440px]'>
            {/*<section className='relative lg:home-section lg:px-0 lg:py-0 !border-t-0 overflow-hidden'>*/}
                <div className='section-content]'>
                    <div className='grid gap-[20px] lg:grid-cols-3'>
                        <div className='c-left lg:col-span-2 flex flex-col'>
                            <div>
                                {/*<p className='lead text-white font-space-mono mb-0'>
                                    <b>{currentData.title}</b>
                                </p>*/}
                                <h2 ref={ref1} className={`dark blue lg:mt-[5px] ${isVisible1 ? 'slanted-bg' : ''}`}>
                                    {/*<span>{currentData.description}</span>*/}
                                    <span>Featured Thematic Collections</span>
                                </h2>
                            </div>
                            {/*<div>
                                <Button className='block mt-[10px]'>
                                    <Link href={'#'}>
                                        All Boards
                                    </Link>
                                </Button>
                            </div>*/}
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
                                id={currentData.id}
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
