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
}

export default function Hero({
    title,
    description,
    creator,
    image,
    tags,
    cards,
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
        <section className='relative home-section pb-[40px] pt-[160px] lg:py-[80px] overflow-hidden min-h-[100vh] h-full flex items-center'>
            
            <div className='caroussel min-w-full h-full lg:min-h-[100vh] absolute ml-[calc((100% - 100vw) / 2)]'>
                <div className='slides flex items-center justify-between flex-nowrap snap-x min-w-full h-full overflow-auto box-border overflow-hidden'>
                    <img src={image} className='lg:min-w-[100vw] block min-h-full z-[-2]' />
                </div>
            </div>

            <div className='inner lg:mx-auto px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px]'>
                <div className='section-content'>
                    <div className='grid gap-[20px] lg:grid-cols-3'>
                        <div className='c-left lg:col-span-2 flex flex-col'>
                            <div>
                                <h1>
                                    <span className='dark blue slanted-bg'>
                                        <span>{title}</span>
                                    </span>
                                </h1>
                                <p className='lead text-white font-bold mb-[40px]'>{description}</p>
                            </div>
                            <div className='flex flex-wrap flex-row gap-1.5 mb-[20px] mt-[40px]'>
                                {tags.highlight.map((d: any, i: number) => (
                                        <button className='chip bg-light-blue' key={i}>{d.name}</button>
                                    )
                                )}
                                {tags.diff > 0 && (
                                    <button className='chip bg-light-blue'>+{tags.diff}</button>
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