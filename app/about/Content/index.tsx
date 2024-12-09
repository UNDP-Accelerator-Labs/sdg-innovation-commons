import { Button } from '@/app/ui/components/Button';
import Link from 'next/link';

export default function Section() {
  return (
    <>
      <section className="relative flex h-[1800px] w-full flex-col justify-start overflow-hidden bg-white font-noto-sans text-lg text-black md:h-[900px] lg:h-[900px]">
        <div className="absolute left-1/2 top-0 flex -translate-x-1/2 transform flex-row items-center justify-center px-0 py-[120px]">
          <div className="w-full px-5 lg:w-[846px] lg:px-0">
            <p className="pb-10">
              <strong className="text-[22px] leading-[30px]">
                The SDG Commons grows each day and is AI-powered to help UNDP
                colleagues quickly know who in the Lab Network is working on
                what topic, and search, leverage and curate cutting-edge and
                bottom-up insights on frontier development challenges across 114
                countries.
              </strong>
            </p>
            <p className="pb-2 font-bold leading-[26px]">
              What can you find on the SDG Commons?
            </p>
            <ol className="pl-6">
              <li className="mb-2 leading-[26px]">
                <strong className="underline">What We See:</strong> Explore the
                Labs’ notes on grassroots innovations and other solutions.
              </li>
              <li className="mb-2 leading-[26px]">
                <strong className="underline">What We Test:</strong> Discover
                notes on experiments where we learn what works and what doesn't
                in sustainable development.
              </li>
              <li className="mb-2 leading-[26px]">
                <strong className="underline">What We Learn:</strong> Explore
                our curated collection of blogs and publications where we
                reflect on what we learn from action.
              </li>
              <li className="mb-2 leading-[26px]">
                <strong>How We Work:</strong> Discover the tools, methodologies,
                and toolkits used or created by the Labs.
              </li>
              <li className="mb-2 leading-[26px]">
                <strong className="underline">
                  Next Practices for the SDGs:
                </strong>{' '}
                Browse through thematic curated pinboards on R&D development
                questions such as digital financial inclusion, circular economy,
                food systems, sustainable tourism.
              </li>
            </ol>
            <p className="mt-6 leading-[26px]">
              Our ambition is to open it in 2025 to all change-makers and
              development actors globally so they can pick up insights, make
              sense of the knowledge in their own context, and accelerate
              action. It is the beginning of a movement, one that radically sees
              openness as a tool to shift power and drive systems transformation
              from the bottom up.
            </p>
            <p className="mt-6 leading-[26px]">
              We hope you will find it helpful. Please share your feedback with
              us, so we can improve it and make it useful for your daily work.
            </p>
          </div>
        </div>
      </section>
      <section className="home-section mx-10 flex lg:mx-0 lg:py-[80px]">
        <div className="inner mx-auto w-[846px]">
          <div className="box-border items-center justify-start gap-10 px-0 py-[120px]">
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
                  Reach out to Us
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
