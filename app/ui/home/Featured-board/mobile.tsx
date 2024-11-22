'use client';
import clsx from 'clsx';
import { useState, useRef, createRef, RefObject } from 'react';
import { Button } from '@/app/ui/components/Button';
import { useIsVisible } from '@/app/ui/components/Interaction';
import Link from 'next/link';
import Card from '@/app/ui/components/Card/collection-card';
import { collection as collectionData } from '@/app/lib/data/collection/tempData';

interface Props {
    className: string;
};

export default function Section({
    className,
}: Props) {
    // TO DO: FOR NOW, THE COLLECTIONS ARE STATICLY ENCODED IN THE DATA
    // NEED TO BUILD A WAY TO MAKE THIS DYNAMIC
    const slides = collectionData.map((d: any, i: number) => {
        const { id, ...obj } = d;
        obj.key = id;
        obj.id = i;
        obj.href = `/collections/${id}`;
        obj.description = obj.sections[0].items[0].txt;
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
        <section className={clsx('relative home-section overflow-hidden min-h-[100vh] flex items-center', className)}>
            <div className='caroussel w-full min-h-[100vh] ml-[calc((100% - 100vw) / 2)]'>
                <div className='slides absolute h-full flex items-center justify-between flex-nowrap snap-x w-full overflow-auto box-border'>
                    {slides.map((d: any, i: number) => {
                        return (
                            <div key={i} 
                                ref={elRefs.current[i]}
                                className='silde relative snap-center w-full h-full flex-none z-[-2] overflow-hidden'
                            >
                                <img src={d.mainImage} className='min-h-full lg:min-w-[100vw] block' />
                            </div>
                        )
                    })}
                </div>
                <div className='inner mx-auto px-[40px] pt-[40px] pb-[80px] md:py-[120px] w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px]'>
                    <div className='section-content'>
                        <h2 className='mt-[5px] mb-[40px]'>
                            <span ref={ref1} className={clsx('dark blue', isVisible1 ? 'slanted-bg' : '')}>
                                <span>Featured Thematic Collections</span>
                            </span>
                        </h2>
                        <p className='lead text-white font-bold mb-[40px]'>
                            Short description about the 3 thematic boards, lorem ipsum dolor sit amet consectetur, lorem. 
                        </p>
                    </div>
                    <div>
                        <Button className='block'>
                            <Link href={'/boards'}>
                                All Boards
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className='inner mx-auto px-[40px] w-[375px] md:w-[744px]'>
                    <div className='section-content'>
                        <div className='md:grid md:gap-[20px] md:grid-cols-5 items-center'>
                            <div className='hidden c-left col-span-2 md:flex flex-col'>
                                <div className='mt-auto'>
                                    <div className='flex justify-start items-center'>
                                        <img className='cursor-pointer' alt='Arrow left' src='/images/Arrow-left.svg' onClick={handlePrevSlide} />
                                        <p className='text-white font-space-mono my-0'>
                                            <b><span className='text-[36px]'>0{currentSlide + 1}</span> / 0{slides.length}</b>
                                        </p>
                                        <img className='cursor-pointer' alt='Arrow right' src='/images/Arrow-right.svg' onClick={handleNextSlide} />
                                    </div>
                                </div>
                            </div>
                            <div className='c-right col-span-3 mb-[40px] md:mb-[120px]'>
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
                            <div className='c-left col-span-2 flex flex-col mb-[40px] md:hidden'>
                                <div className='mt-auto'>
                                    <div className='flex justify-start items-center'>
                                        <img className='cursor-pointer' alt='Arrow left' src='/images/Arrow-left.svg' onClick={handlePrevSlide} />
                                        <p className='text-white font-space-mono my-0'>
                                            <b><span className='text-[36px]'>0{currentSlide + 1}</span> / 0{slides.length}</b>
                                        </p>
                                        <img className='cursor-pointer' alt='Arrow right' src='/images/Arrow-right.svg' onClick={handleNextSlide} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </>
    );
}
