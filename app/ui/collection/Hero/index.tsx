'use client';
import { useState, useRef, createRef, RefObject } from 'react';
import { Button } from '@/app/ui/components/Button';
import { useIsVisible } from '@/app/ui/components/Interaction';
import Link from 'next/link';
import Card from '@/app/ui/components/Card/featured-card';
import clsx from 'clsx';
// import Filters from '../Filters';


interface Props {
    title: string;
    description: string;
    creator: string;
    image: string;
    tags: any;
    cards: any[];
    count: number;
}

export default function Hero({
    title,
    description,
    creator,
    image,
    tags,
    cards,
    count = 0,
}: Props) {
    /*
        Credit: https://stackoverflow.com/questions/54633690/how-can-i-use-multiple-refs-for-an-array-of-elements-with-hooks
    */
    const elRefs = useRef<Array<RefObject<HTMLDivElement> | null>>([]);
    if (elRefs.current.length !== cards.length) {
        // add or remove refs
        elRefs.current = Array(cards.length)
        .fill(0)
        .map((_, i) => elRefs.current[i] || createRef());
    }

    const [currentSlide, setCurrentSlide] = useState(0); // Manage the current slide index
    const [animate, setAnimate] = useState(true); // Manage animation

    const handleNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % cards.length);
        elRefs?.current[(currentSlide + 1) % cards.length]?.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + cards.length) % cards.length);
        elRefs?.current[(currentSlide || cards.length) - 1]?.current?.scrollIntoView({ behavior: "smooth" });
    };

    // const currentData = cards[currentSlide]; // Get the current slide data

    // const ref1 = useRef<HTMLDivElement>(null);
    // const isVisible1 = useIsVisible(ref1);

    // const [searchQuery, setSearchQuery] = useState<string>(searchParams.search || '');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filterVisibility, setFilterVisibility] = useState<boolean>(false);

    return (
        <>
        <section className='relative home-section pb-[40px] pt-[160px] lg:py-[80px] overflow-hidden min-h-[100vh] h-full lg:flex items-center'>
            
            {/* FOR SMALL DISPLAYS */}
            <div className='lg:hidden mt-[-20px]'>
                <div className='w-full'>
                    <img src={image} className='w-full block min-h-full' />
                </div>
                <div className='folder horizontal'>
                    <div className='folder-label'>
                        <span>{count} Board{count !== 1 ? 's' : null}</span>
                    </div>
                    <div className='folder-base'></div>
                </div>
            </div>

            {/* FOR LARGE DISPLAYS */}
            <div className='hidden lg:block'>
                <div className='absolute right-0 top-0 w-[40%] overflow-hidden h-full'>
                    <img src={image} className='lg:min-w-[100vw] block min-h-full translate-x-[-10%]' />
                </div>
                <div className='folder vertical right-[40%]'>
                    <div className='folder-label'>
                        <span>{count} Board{count !== 1 ? 's' : null}</span>
                    </div>
                    <div className='folder-base'></div>
                </div>
            </div>

            <div className='inner mx-auto px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px]'>
                <div className='section-content'>
                    <div className='grid gap-[20px] lg:grid-cols-2'>
                        <div className='c-left flex flex-col mb-[80px] lg:mb-[40px] mt-[80px]'>
                            <div>
                                <h1>
                                    <span className='yellow slanted-bg'>
                                        <span>{title}</span>
                                    </span>
                                </h1>
                                <p className='mb-[40px]' dangerouslySetInnerHTML={{ __html: description }} ></p>
                            </div>
                            <div className='flex flex-wrap flex-row gap-1.5 mb-[20px] mt-[40px]'>
                                {tags.highlight.map((d: any, i: number) => (
                                    <button className='chip bg-posted-yellow' key={i}>{d.name}</button>
                                    )
                                )}
                                {tags.diff > 0 && (
                                    <button className='chip bg-posted-yellow'>+{tags.diff}</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </>
    );
}