'use client';
import { useState, useRef, createRef, RefObject } from 'react';
import { Button } from '@/app/ui/components/Button';
import { useIsVisible } from '@/app/ui/components/Interaction';
import Link from 'next/link';
import Card from '@/app/ui/components/Card/collection-card';
import clsx from 'clsx';
import { collection as collectionData } from '@/app/lib/data/collection/tempData';

export default function Section() {
    const slides = collectionData.map((d: any, i: number) => {
        const { id, ...obj } = d;
        obj.key = id;
        obj.id = i;
        obj.href = `/next-practices/${id}`;
        obj.description = obj.sections[0].items[0].txt;
        // obj.cardBackgroundImage = '/images/Rectangle 68.png';
        return obj
    });

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

    // const ref1 = useRef<HTMLDivElement>(null);
    // const isVisible1 = useIsVisible(ref1);

    // const [searchQuery, setSearchQuery] = useState<string>(searchParams.search || '');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filterVisibility, setFilterVisibility] = useState<boolean>(false);

    return (
        <>
        <section className='relative home-section pt-[120px] py-[80px] overflow-hidden min-h-[100vh] flex items-center'>

            <div className='caroussel w-full min-h-[100vh] h-full absolute ml-[calc((100% - 100vw) / 2)]'>
                <div className='slides flex items-center justify-between flex-nowrap snap-x min-w-full h-full overflow-hidden box-border'>
                    {slides.map((d: any, i: number) => {
                        return (
                            <div key={i} 
                                ref={elRefs.current[i]}
                                className='silde relative snap-center w-full h-full flex-none'
                            >
                                <img src={d.mainImage} className='min-h-full block lg:min-w-[100vw]' />
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className='inner mx-auto px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px]'>
            {/*<section className='relative lg:home-section lg:px-0 lg:py-0 !border-t-0 overflow-hidden'>*/}
                <div className='section-content'>
                    <div className='md:grid md:gap-[20px] md:grid-cols-6 lg:grid-cols-9 items-end md:mb-[40px]'>
                        <div className='c-left md:col-span-6 lg:col-span-5 flex flex-col my-[80px] lg:mb-0'>
                            <div>
                                <h1 className='text-white'>
                                    <span className='dark blue slanted-bg'>
                                        <span>Next practices for the SDGs</span>
                                    </span>
                                </h1>
                                <p className='lead text-white font-bold lg:mb-[160px]'>
                                    Discover how we are uncovering next practices for the SDGs through what we see, what we test, and what we learn.
                                </p>
                            </div>
                            {/*<div className='mt-auto hidden lg:block'>
                                <div className='flex justify-start items-center'>
                                    <img className='cursor-pointer' alt='Arrow left' src='images/Arrow-left.svg' onClick={handlePrevSlide} />
                                    <p className='text-white font-space-mono my-0'>
                                        <b><span className='text-[36px]'>0{currentSlide + 1}</span> / 0{slides.length}</b>
                                    </p>
                                    <img className='cursor-pointer' alt='Arrow right' src='images/Arrow-right.svg' onClick={handleNextSlide} />
                                </div>
                            </div>*/}
                        </div>
                        <div className='c-right md:col-span-4 lg:col-span-4 lg:col-start-6'>
                            <Card
                                id={currentData.id}
                                title={currentData.title}
                                description={''}
                                tags={[]}
                                href={currentData.href}
                                viewCount={currentData.boards.length}
                                backgroundImage={currentData.mainImage}
                                openInNewTab={false}
                            />
                        </div>
                        {/*<div className='c-left block md:row-start-3 md:col-span-4 lg:hidden my-[40px]'>
                            <div className='flex justify-start items-center'>
                                <img className='cursor-pointer' alt='Arrow left' src='images/Arrow-left.svg' onClick={handlePrevSlide} />
                                <p className='text-white font-space-mono my-0'>
                                    <b><span className='text-[24px] lg:text-[36px]'>0{currentSlide + 1}</span> / 0{slides.length}</b>
                                </p>
                                <img className='cursor-pointer' alt='Arrow right' src='images/Arrow-right.svg' onClick={handleNextSlide} />
                            </div>
                        </div>*/}
                    </div>
                </div>
            </div>
        </section>
        </>
    );
}
