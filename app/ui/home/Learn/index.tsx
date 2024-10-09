import { Button } from '@/app/ui/components/Button';
import Card from '@/app/ui/components/Card/without-img';
import Link from 'next/link';

export default function Section() {
    return (
        <>
        <hr className="border border-black border-1 w-full" />
        <div
            className="bg-[url('/images/Vector.svg')] bg-center h-[750px] opacity-5 "
        />
      <div className="w-full relative flex flex-col  items-start justify-start py-10 px-5 box-border gap-[30px] text-left text-smi text-black font-mobile-buttons z[1] mt-[-750px]">
        <div className="lg:w-full lg:relative lg:flex lg:flex-row lg:items-start lg:justify-start lg:py-0 lg:px-20 lg:box-border lg:gap-[357px] lg:text-left text-17xl text-black">
            <div className="flex flex-col items-start justify-start relative text-9xl">
                <img
                    className="w-[234.1px] lg:w-[292.2px] absolute !m-[0] top-[23.17px] left-[-7.5px] h-[26px] z-[0]"
                    alt="Icon"
                    src="images/Rectangle 89.svg"
                />

            <b className="relative leading-[38px] z-[1] text-[28px] lg:text-[36px] ">What We Learn</b>
            </div>
            <div className="lg:flex-1 lg:flex lg:flex-col lg:items-start lg:justify-start lg:gap-10 lg:text-3xl">
                <b className="self-stretch relative text-2xl leading-[28px] text-[21px] lg:text-[22px] ">
                Browse through our blogs, publications, and toolkits to learn what works and what doesn’t in sustainable development.
                </b>
            </div>
        </div>
        <div className="md:flex md:flex-row md:gap-5 lg:flex lg:flex-row lg:py-0 lg:px-20 lg:gap-[45px]">
            <div className="lg:w-[503px] lg:h-9 " />
            <Card
                country='Uganda'
                date='12.08.24'
                title='Example Insight title lorem ipsum dolor sit ametconsect'
                description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                tagArr={'Publication'}
                tagStyle='bg-lime-yellow'
                href='/'
            />

            <Card
                country='Uganda'
                date='12.08.24'
                title='Example Insight title lorem ipsum dolor sit ametconsect'
                description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                tagArr={'Publication'}
                tagStyle='bg-lime-yellow'
                href='/'
            />
        </div>
          <div className="self-stretch flex flex-col items-end justify-start text-center text-sm">
            <Button>
                <Link href={'/learn'}>
                    Read All
                </Link>
            </Button>
          </div>
      </div>
      </>
    );
  }
  