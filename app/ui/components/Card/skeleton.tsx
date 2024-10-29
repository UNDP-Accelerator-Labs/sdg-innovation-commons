import clsx from 'clsx';
// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function ImgCardSkeleton({ className }: { className?: string }) {
    return (
      <div className={clsx("w-full relative flex flex-col items-start justify-start text-center text-smi text-black", shimmer, className)}>
        <div className="w-full border-black border-[1px] border-solid box-border flex flex-col items-start justify-start animate-pulse">
          {/* Background Image Placeholder */}
          <div className="self-stretch h-[191px] bg-gray-200"></div>
  
          {/* SDG and Country Placeholder */}
          {/* Chips */}
          <div className='chips-container absolute top-0 w-full'>
            <div className="flex flex-row items-center justify-end pt-[20px] pb-0 pl-0 pr-[20px] gap-[10px] z-[2]">
              <div className="rounded-11xl bg-gray-200 h-6 w-16">&nbsp;</div>
              <div className="rounded-11xl bg-gray-300 h-6 w-24">&nbsp;</div>
            </div>
          </div>
  
          {/* Experiment Label Placeholder */}
          <div className="self-stretch border-black border-t-[1px] border-solid flex flex-row items-center justify-start py-2.5 px-5 bg-gray-200">&nbsp;</div>
  
          {/* Title and Description Placeholder */}
          <div className="self-stretch border-black border-t-[1px] border-solid flex flex-col pt-5 gap-6 text-lg text-left">
            <div className="self-stretch flex flex-col items-start justify-start">
              <div className="self-stretch flex flex-col items-start justify-start gap-2.5 py-2.5 px-5">
                <div className="self-stretch h-5 bg-gray-200 rounded-md"></div>
                <div className="self-stretch h-4 bg-gray-300 rounded-md"></div>
              </div>
            </div>
          </div>
  
          {/* Tags Placeholder */}
          <div className="hidden w-[351px] lg:flex flex-row items-end justify-start flex-wrap content-end gap-1.5 text-center text-sm py-2.5 px-5">
            <div className="rounded-11xl bg-gray-200 h-8 w-16"></div>
            <div className="rounded-11xl bg-gray-300 h-8 w-20"></div>
            <div className="rounded-11xl bg-gray-200 h-8 w-24"></div>
          </div>
  
          {/* Footer with View Count and Arrow */}
          <div className="self-stretch flex flex-row items-center justify-between text-sm py-2.5 px-5">
            <div className="flex flex-row items-start justify-start gap-1">
              <div className="h-5 w-10 bg-gray-200 rounded"></div>
              <div className="h-5 w-6 bg-gray-300 rounded"></div>
            </div>
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }


  export function NoImgCardSkeleton() {
    return (
      <div className="w-full relative bg-white border-black border-t-[1px] border-solid box-border flex flex-col items-start justify-start pt-5 px-5 pb-10 gap-6 text-left text-smi text-undp-blue animate-pulse">
        <div className="self-stretch flex flex-col items-start justify-start gap-5">
          {/* Country and Date placeholders */}
          <div className="self-stretch flex flex-row items-start justify-between">
            <div className="bg-gray-200 h-4 w-24 rounded"></div>
            <div className="bg-gray-200 h-4 w-16 rounded"></div>
          </div>
          {/* Title and Description placeholders */}
          <div className="self-stretch flex flex-col items-start justify-start gap-5 text-9xl text-black">
            <div className="bg-gray-200 h-8 w-full rounded"></div>
            <div className="bg-gray-200 h-4 w-full rounded"></div>
          </div>
        </div>
  
        {/* Tags placeholders */}
        <div className="self-stretch flex flex-row items-center justify-between text-center text-black">
          <div className="flex flex-row gap-2">
            <div className="bg-gray-200 h-6 w-16 rounded-[30px]"></div>
            <div className="bg-gray-200 h-6 w-20 rounded-[30px]"></div>
          </div>
  
          {/* Arrow placeholder */}
          <div className="h-[41.9px] w-[42.5px] bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }
  
  
export function ImgCardsSkeleton() {
  return (
    <>
      <ImgCardSkeleton />
      <ImgCardSkeleton />
      <ImgCardSkeleton />
    </>
  );
}

export function NoImgCardsSkeleton() {
    return (
      <>
        <NoImgCardSkeleton />
        <NoImgCardSkeleton />
        <NoImgCardSkeleton />
      </>
    );
  }