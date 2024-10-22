'use client';

import { CardLink } from '@/app/ui/components/Link';
import { Button } from '@/app/ui/components/Button';
import Link from 'next/link';
import { useRef } from 'react';
import { useIsVisible } from '@/app/ui/components/Interaction';

export default function Section() {
    
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useIsVisible(ref);

    return (
        <>
            <section className='lg:home-section lg:px-[80px] lg:py-[100px] grid-bg'>
                {/* Display the section title and description */}
                <div className='section-header lg:mb-[40px]'>
                    <div className='c-left lg:col-span-5'>
                        <h2 ref={ref} className={`yellow lg:mt-[5px] ${isVisible ? 'slanted-bg' : ''}`}>
                            <span>Get Inspired</span>
                        </h2>
                    </div>
                    <div className='c-right lg:col-span-4 lg:mt-[20px]'>
                        <p className="lead">
                            <b>Next Practices for the SDGs. Explanation about the Boards idea, lorem ipsum dolor sti amet consectetur lorem ipsum dolor.</b>
                        </p>
                    </div>
                </div>
                <div className='section-content'>
                    {/* List of featured collections */}
                    <div className='overflow-x-auto lg:slideshow-lg'>
                        <div className='flex flex-row gap-[20px] lg:px-[80px]'>
                        {cards.map((card, i) => (
                            <div key={i} className='card lg:w-[600px] shrink-0'>
                                <div className="relative flex w-full h-[300px] overflow-hidden">
                                    <img
                                        className="object-cover flex-1 mix-blend-normal"
                                        alt='Collection image'
                                        src={card.imageSrc}
                                    />
                                    <div className='absolute h-full w-full top-0 left-0 [background:linear-gradient(173.09deg,_rgba(1,_141,_242,_1),_rgba(237,_255,_164,_1))] opacity-[.5]' />
                                </div>
                                <div className="border-black border-t-[1px] border-solid px-[20px] py-[20px]">
                                    <div className="flex flex-row items-center justify-between">
                                        <p className='lead mb-0'>{card.title}</p>
                                        <CardLink
                                            href={card.href}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
                <div className='section-footer text-right'>
                    <Button>
                        <Link href={'#'}>
                            All Boards
                        </Link>
                    </Button>
                </div>
            </section>
        </>
    );
}

const cards = [
    {
        title: 'Circular Economy',
        imageSrc: 'images/Rectangle 68.png',
        href: '#'
    },
    {
        title: 'Food Systems',
        imageSrc: 'images/Rectangle 68-2.png',
        href: '#'
    },
    {
        title: 'Digital Financial Inclusion',
        imageSrc: 'images/Rectangle 68-3.png',
        href: '#'
    },
];