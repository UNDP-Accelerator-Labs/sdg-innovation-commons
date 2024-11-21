'use client';
import clsx from 'clsx';
import { useState, useRef, createRef, RefObject } from 'react';
import { Button } from '@/app/ui/components/Button';
import { useIsVisible } from '@/app/ui/components/Interaction';
import Link from 'next/link';
import Card from '@/app/ui/components/Card/featured-card';
import { collection as collectionData } from '@/app/lib/data/collection/tempData';

export default function Section() {
    // TO DO: FOR NOW, THE COLLECTIONS ARE STATICLY ENCODED IN THE DATA
    // NEED TO BUILD A WAY TO MAKE THIS DYNAMIC
    const slides = collectionData.map((d: any, i: number) => {
        const { id, ...obj } = d;
        obj.key = id;
        obj.id = i;
        obj.href = `/collections/${id}`;
        obj.description = obj.sections[0].items[0].txt;
        obj.cardBackgroundImage = '/images/Rectangle 68.png';
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

    const ref1 = useRef<HTMLDivElement>(null);
    const isVisible1 = useIsVisible(ref1);

    return (
        <>
        <section className='relative lg:home-section overflow-hidden min-h-[100vh] flex items-center'>
            
            <div className='caroussel w-full min-h-[100vh] absolute ml-[calc((100% - 100vw) / 2)]'>
                <div className='slides flex items-center justify-between flex-nowrap snap-x w-full overflow-auto box-border'>
                    {slides.map((d: any, i: number) => {
                        return (
                            <div key={i} 
                                ref={elRefs.current[i]}
                                className='silde relative snap-center w-full flex-none z-[-2]'
                            >
                                <img src={d.mainImage} className='w-[100vw]' />
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='inner lg:mx-auto lg:px-[80px] lg:w-[1440px]'>
            {/*<section className='relative lg:home-section lg:px-0 lg:py-0 !border-t-0 overflow-hidden'>*/}
                <div className='section-content'>
                    <div className='grid gap-[20px] lg:grid-cols-3'>
                        <div className='c-left lg:col-span-2 flex flex-col'>
                            <div>
                                {/*<p className='lead text-white font-space-mono mb-0'>
                                    <b>{currentData.title}</b>
                                </p>*/}
                                <h2 ref={ref1} className='lg:mt-[5px]'>
                                    <span className={clsx('dark blue', isVisible1 ? 'slanted-bg' : '')}>
                                        <span>Featured Thematic Collections</span>
                                    </span>
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
                                        <b><span className='text-[36px]'>0{currentSlide + 1}</span> / 0{slides.length}</b>
                                    </p>
                                    <img className='cursor-pointer' alt='Arrow right' src='images/Arrow-right.svg' onClick={handleNextSlide} />
                                </div>
                            </div>
                        </div>
                        <div className='c-right'>
                            <Card
                                id={currentData.id}
                                title={currentData.title}
                                description={''}
                                tags={[]}
                                href={currentData.href}
                                viewCount={currentData.boards.length}
                                backgroundImage={currentData.cardBackgroundImage}
                                openInNewTab={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </>
    );
}
