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
        <section className='relative lg:home-section lg:py-[80px] overflow-hidden min-h-[100vh] flex items-center'>
            
            <div className='caroussel w-full min-h-[100vh] absolute ml-[calc((100% - 100vw) / 2)]'>
                <div className='slides flex items-center justify-between flex-nowrap snap-x w-full overflow-auto box-border'>
                    <img src={image} className='w-[100vw] z-[-2]' />
                </div>
            </div>

            <div className='inner lg:mx-auto lg:px-[80px] lg:w-[1440px]'>
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
                            {/*<div className='stats-cartouche lg:p-[20px] inline-block'>
                                <span className='lg:mr-[40px]'><span className='number lg:mr-[5px]'>{padsCount}</span>Note{padsCount !== 1 ? 's' : null}</span>
                                <span className='lg:mr-[40px]'><span className='number lg:mr-[5px]'>{locations.count}</span> Location{locations.count !== 1 ? 's' : null}</span>
                                <span className='lg:mr-[40px]'><span className='number lg:mr-[5px]'>{tags.count}</span> Thematic area{tags.count !== 1 ? 's' : null}</span>
                                <span><span className='number lg:mr-[5px]'>{contributors}</span> Contributor{contributors !== 1 ? 's' : null}</span>
                            </div>*/}
                            {/*<div className='mt-auto'>
                                <div className='flex justify-start items-center'>
                                    <img className='cursor-pointer' alt='Arrow left' src='/images/Arrow-left.svg' onClick={handlePrevSlide} />
                                    <p className='text-white font-space-mono my-0'>
                                        <b><span className='text-[36px]'>0{currentSlide + 1}</span> / 0{cards.length}</b>
                                    </p>
                                    <img className='cursor-pointer' alt='Arrow right' src='/images/Arrow-right.svg' onClick={handleNextSlide} />
                                </div>
                            </div>*/}
                        </div>
                        {/*<div className='c-right slides flex items-center justify-between flex-nowrap snap-x w-full overflow-auto box-border p-[20px]'>
                            {cards.map((d: any, i: number) => {
                                return (
                                    <div key={i} ref={elRefs.current[i]} className={clsx('shrink-0 silde relative snap-center w-full flex-none', i < cards.length - 1 && 'mr-[80px]')}>
                                        <Card
                                            title={d.title}
                                            id={d.pinboard_id}
                                            description={d.description}
                                            // tags={currentData.cardTags}
                                            href={`/boards/all/${d.pinboard_id}`}
                                            viewCount={d.total}
                                            // backgroundImage={currentData.cardBackgroundImage}
                                            openInNewTab={false}
                                        />
                                    </div>
                                )
                            })}
                        </div>*/}
                    </div>
                </div>
            </div>
        </section>
        </>
    );
}