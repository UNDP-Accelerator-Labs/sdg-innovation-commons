'use client';
import { useState, useRef, createRef, RefObject } from 'react';

interface Props {
    item: any;
    base: string;
}

export default function Img({
    item,
    base,
}: Props) {
    let { src, srcs, instruction } = item;
    if (srcs?.length === 1) src = srcs[0];
    
    if (src) {
        return (
            <>
            {!instruction ? null : (
                <p className='font-space-mono text-[14px] leading-[20px] mb-[10px]'><b>{instruction}</b></p>
            )}
            <div className='w-full border-[1px] border-solid mb-[40px] overflow-hidden'>
                <img 
                    src={ base ? `${base}/${src}` : src} 
                    alt='Image' 
                    className='w-full h-auto max-h-[60vh] object-contain block m-auto' 
                />
            </div>
            </>
        )
    } else if (srcs?.length) {

        /*
            Credit: https://stackoverflow.com/questions/54633690/how-can-i-use-multiple-refs-for-an-array-of-elements-with-hooks
        */
        const elRefs = useRef<Array<RefObject<HTMLDivElement> | null>>([]);
        if (elRefs.current.length !== srcs.length) {
            // add or remove refs
            elRefs.current = Array(srcs.length)
            .fill(0)
            .map((_, i) => elRefs.current[i] || createRef());
        }

        const [currentSlide, setCurrentSlide] = useState(0); // Manage the current slide index

        const handleNextSlide = () => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % srcs.length);
            elRefs?.current[(currentSlide + 1) % srcs.length]?.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        };

        const handlePrevSlide = () => {
            setCurrentSlide((prevSlide) => (prevSlide - 1 + srcs.length) % srcs.length);
            elRefs?.current[(currentSlide || srcs.length) - 1]?.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        };

        return (
            <>
            {!instruction ? null : (
                <p className='font-space-mono text-[14px] leading-[20px] mb-[10px]'><b>{instruction}</b></p>
            )}
            <div className='caroussel relative w-full mb-[40px] border-[1px] border-solid'>
                <div className='slides flex items-center justify-between flex-nowrap snap-x w-full overflow-auto box-border'>
                    {srcs.map((src: string, i: number) => {
                        return (
                            <div key={i} 
                                ref={elRefs.current[i]}
                                className='silde relative snap-center w-full flex-none overflow-hidden'
                            >
                                <img 
                                    key={`img-${i}`} 
                                    src={`${base}/${src}`} 
                                    alt='Image'
                                    className='h-full block max-h-[60vh] m-auto'
                                />
                            </div>
                        )
                    })}
                </div>
                <div className='absolute bottom-0 right-0 bg-white'>
                    <div className='flex justify-start items-center px-[10px]'>
                        <img className='cursor-pointer' alt='Arrow left' src='/images/arrow-l.svg' onClick={handlePrevSlide} />
                        <img className='cursor-pointer' alt='Arrow right' src='/images/arrow-r.svg' onClick={handleNextSlide} />
                    </div>
                </div>
            </div>
            </>
        )
    }
}