'use client';
import clsx from 'clsx';
import { useState, useRef, createRef, RefObject, useEffect } from 'react';
import { Button } from '@/app/ui/components/Button';
import { useIsVisible } from '@/app/ui/components/Interaction';
import Link from 'next/link';
import Card from '@/app/ui/components/Card/collection-card';

interface Props {
    className: string;
};

export default function Section({
    className,
}: Props) {
    const [slides, setSlides] = useState<any[]>([]);

    // Fetch published collections from API
    useEffect(() => {
        fetch('/api/collections?list=public&limit=10')
            .then(res => res.json())
            .then(data => {
                const collections = (data || []).map((d: any, i: number) => ({
                    ...d,
                    key: d.slug,
                    id: i,
                    href: `/next-practices/${d.slug}`,
                    description: d.description || '',
                    mainImage: d.main_image || '',
                    boards: d.boards || [],
                    cardBackgroundImage: '/images/Rectangle 68.png',
                }));
                setSlides(collections);
            })
            .catch(err => console.error('Failed to fetch collections', err));
    }, []);

    /*
        Credit: https://stackoverflow.com/questions/54633690/how-can-i-use-multiple-refs-for-an-array-of-elements-with-hooks
    */
    const elRefs = useRef<Array<RefObject<HTMLDivElement> | null>>([]);
    if (slides && elRefs.current.length !== slides.length) {
        // add or remove refs
        elRefs.current = Array(slides.length)
        .fill(0)
        .map((_, i) => elRefs.current[i] || createRef());
    }

    const [currentSlide, setCurrentSlide] = useState(0); // Manage the current slide index
    const [animate, setAnimate] = useState(true); // Manage animation

    const handleNextSlide = () => {
        if (!slides || slides.length === 0) return;
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        elRefs?.current[(currentSlide + 1) % slides.length]?.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handlePrevSlide = () => {
        if (!slides || slides.length === 0) return;
        setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
        elRefs?.current[(currentSlide || slides.length) - 1]?.current?.scrollIntoView({ behavior: "smooth" });
    };

    const currentData = slides && slides.length > 0 ? slides[currentSlide] : null; // Get the current slide data

    const ref1 = useRef<HTMLDivElement>(null);
    const isVisible1 = useIsVisible(ref1);

    // Show nothing if no collections are available yet
    if (!slides || !slides.length || !currentData) {
        return null;
    }

    return (
        <>
        <section id='featured-boards' className={clsx('relative home-section overflow-hidden min-h-[100vh] flex items-center', className)}>
            <div className='caroussel w-full min-h-[100vh] absolute ml-[calc((100% - 100vw) / 2)]'>
                <div className='slides flex items-center justify-between flex-nowrap snap-x w-full overflow-hidden box-border'>
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
            <div className='inner mx-auto px-[80px] w-[1440px]'>
                <div className='section-content'>
                    <div className='grid gap-[20px] grid-cols-3 items-center'>
                        <div className='c-left col-span-2 flex flex-col'>
                            <div>
                                <h2 ref={ref1} className='mt-[5px] mb-[40px]'>
                                    <span className={clsx('dark blue', isVisible1 ? 'slanted-bg' : '')}>
                                        <span>Next Practices for the SDGs</span>
                                    </span>
                                </h2>
                                <p className='lead text-white font-bold mb-[40px]'>
                                    Discover how we are uncovering next practices for the SDGs through what we see, what we test, and what we learn.
                                </p>
                            </div>
                            <div>
                                <Button className='block mb-[160px]'>
                                    <Link href={'/next-practices'}>
                                        View All
                                    </Link>
                                </Button>
                            </div>
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
