'use client';
import { Button } from '@/app/ui/components/Button';
import Link from 'next/link';
import { useSharedState } from '@/app/ui/components/SharedState/Context';

export default function Section() {
  const { sharedState } = useSharedState();
  const { isLogedIn, session } = sharedState || {};

  return (
    <>
      <section className="home-section  bg-white font-noto-sans text-lg text-black ">
      <div className="inner mx-auto lg:w-[846px]">
          <div className="w-full px-5 lg:w-[846px] lg:px-0 py-[80px]">
            <p className="pb-10">
              <strong className="lead">
                The SDG Commons grows each day and is AI-powered to help UNDP colleagues quickly know who in the Lab Network is working on what topic, and search, leverage and curate cutting-edge and bottom-up insights on frontier development challenges across 114 countries.
              </strong>
            </p>
            <p className="pb-2 font-bold leading-[26px]">
              What can you find on the SDG Commons?
            </p>
            <ol className="pl-6">
              <li className="mb-2 leading-[26px]">
                <Link href='/see'><strong className="underline">What We See:</strong></Link> Explore the
                Labs’ notes on grassroots innovations and other solutions.
              </li>
              <li className="mb-2 leading-[26px]">
                <Link href='/test/all'><strong className="underline">What We Test:</strong></Link> Discover
                notes on experiments where we learn what works and what doesn't
                in sustainable development.
              </li>
              <li className="mb-2 leading-[26px]">
                <Link href='/learn/all'><strong className="underline">What We Learn:</strong></Link> Explore our curated collection of blogs and publications where we reflect on what we learn from action.
              </li>
              <li className="mb-2 leading-[26px]">
                <Link href='/boards'><strong className="underline">Community Curated Boards:</strong></Link> Browse through thematic boards curated by our network and extended community.
              </li>
              {isLogedIn ? (
              <li className="mb-2 leading-[26px]">
                <Link href='/boards?space=private'><strong className="underline">My boards:</strong></Link> Create your own boards by pining any content of interest, you can keep them private, share them and make them public for the benefit of the community of users.
              </li>
              ) : null}
              <li className="mb-2 leading-[26px]">
                <Link href='/next-practices'><strong className="underline"> Next Practices for the SDGs:</strong></Link> Discover highly curated pinboards on the three main Research and Development (R&D) priorities of the Accelerator Labs in 2024: digital financial inclusion, circular economy and climate action, and food systems. More will be added in 2025.
              </li>
            </ol>
            <p className="mt-6 leading-[26px]">
              Our ambition is to open the SDG Commons in 2025 to all change-makers and development actors globally so they can pick up insights, make sense of the knowledge in their own context, and accelerate action. It is the beginning of a movement, one that radically sees openness as a tool to shift power and drive systems transformation from the bottom up.
            </p>
          </div>
        </div>
      </section>
      <section className="home-section flex lg:mx-0 lg:py-[10px]">
        <div className="inner mx-auto lg:w-[846px]">
          <div className="box-border items-center justify-start gap-10 px-5 lg:px-0 py-[80px]">
            <div className="relative self-stretch text-center">
              <p className="m-0">
                <b>
                  <span className="text-sm leading-5 lg:text-[22px] lg:leading-[36px]">
                    Please be aware that the content published here has not been
                    peer reviewed. It consists of personal reflections,
                    insights, and learnings of the contributor(s). It may not to
                    be exhaustive, nor does it aim to be authoritative
                    knowledge.
                  </span>
                  <span className="text-[22px] leading-[30px]">&nbsp;</span>
                </b>
              </p>
              <p className="my-5 pb-5 text-sm font-medium leading-5 lg:text-[20px] lg:leading-[28px]">
                We hope you will find it helpful. Please share your feedback
                with us, so we can improve it and make it useful for your daily
                work.
              </p>

              <Button type="submit" className="grow-0 border-l-0">
                <Link href={'/#contact'} passHref>
                  Contact Us
                </Link>
              </Button>
            </div>
            {/* <img className='w-[80%] lg:w-[20%] absolute left-0  ' alt="Branding illustration" src='/images/hands/about_us_bottom_left.svg' /> */}
          </div>
        </div>
      </section>
    </>
  );
}
