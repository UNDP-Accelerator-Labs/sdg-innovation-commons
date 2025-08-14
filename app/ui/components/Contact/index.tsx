'use client';
import clsx from 'clsx';
import { useActionState, useState } from "react";
import { createContact, ContactState } from '@/app/lib/data/contact-us';
import { Button } from '@/app/ui/components/Button';
import Link from 'next/link';

export default function Contact() {
    const [loading, setLoading] = useState<boolean>(false);

    const initialState: ContactState = { message: null, errors: {}, isSubmited: false };
    const [state, formAction] = useActionState(createContact, initialState);
    
    const handleForm = async (e: FormData)=>{
        setLoading(true)
        formAction(e)
        setTimeout(() => {
            setLoading(false)
        }, 3000);
    }

    return (
        <>
        <section className='home-section overflow-hidden lg:px-0 lg:py-0 bg-posted-yellow' id='contact' >
            <div className='inner mx-auto w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px]'>
                <div className='section-content grid grid-cols-9 gap-[20px] px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px]'>
                    <div className='c-left col-span-9 xl:col-span-4 py-[80px] lg:py-[120px]'>
                        <div className='lg:grid lg:grid-cols-2 lg:gap-[20px] lg:mb-[20px]'>
                            <div>
                                <h2 className='mb-[20px]'>
                                    <span className='slanted-bg white'>
                                        <span>Contact us</span>
                                    </span>
                                </h2>
                            </div>
                            {/* Description */}
                            <div className='lg:mt-[20px]'>
                                <p className='lead'>
                                If you want to be involved or get help, drop us a line below. We’re here to help.
                                </p>
                            </div>
                        </div>

                        <small className='block w-full mb-5 text-base'>
                            If you would like to report a bug or a technical issue, or suggest a new feature please <a href="https://github.com/UNDP-Accelerator-Labs/sdg-innovation-commons/issues/new/choose" target='_blank' className='text-light-blue'>click here.</a>
                        </small>

                        {/* Display Success or Failure Message */}
                        {state.message && (
                            <div className={clsx('my-4 font-bold', state.success ? 'text-undp-blue' : 'text-red-500')}>
                                {state.message}
                            </div>
                        )}

                        {/* Form */}
                        <form action={handleForm} className='lg:grid lg:grid-cols-2 lg:gap-[20px]'>
                            {/* Name Input and Error */}
                            <div className='mb-[20px] lg:mb-0'>
                                <input
                                    type='text'
                                    name='name'
                                    placeholder='Name'
                                    className='w-full bg-transparent border-none focus:outline-none focus:ring-0'
                                />
                                {state.errors?.name && state.errors.name.map((error: string) => (
                                    <p className='mt-1 text-sm text-red-500' key={error}>{error}</p>
                                ))}
                            </div>

                            {/* Surname Input and Error */}
                            <div className='mb-[20px] lg:mb-0'>
                                <input
                                    type="text"
                                    name="surname"
                                    placeholder="Surname"
                                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0"
                                />
                                {state.errors?.surname && state.errors.surname.map((error: string) => (
                                    <p className="mt-1 text-sm text-red-500" key={error}>{error}</p>
                                ))}
                            </div>

                            {/* Email Input and Error */}
                            <div className='mb-[20px] lg:mb-0'>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0"
                                />
                                {state.errors?.email && state.errors.email.map((error: string) => (
                                    <p className="mt-1 text-sm text-red-500" key={error}>{error}</p>
                                ))}
                            </div>

                            {/* Organization Input and Error */}
                            <div className='mb-[20px] lg:mb-0'>
                                <input
                                    type="text"
                                    name="org"
                                    placeholder="Organization"
                                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0"
                                />
                                {state.errors?.org && state.errors.org.map((error: string) => (
                                    <p className="mt-1 text-sm text-red-500" key={error}>{error}</p>
                                ))}
                            </div>

                             {/* Dropdown Menu */}
                             <div className='mb-[20px] lg:mb-0 lg:col-span-2'>
                                <select
                                    name="reason"
                                    className="w-full focus:outline-none focus:ring-0"
                                    defaultValue=""
                                    required
                                >
                                    <option value="" disabled>
                                        Select a reason for contact
                                    </option>
                                    <option value="I would like to become a super user to actively test it for my team">I would like to become a super user to actively test it for my team.</option>
                                    <option value="I have content to contribute">I have content to contribute.</option>
                                    <option value="I'm interested in using the SDG Commons, and I need help to make sense of it and would like to collaborate further.">
                                        I'm interested in using the SDG Commons, and I need help to make sense of it and would like to collaborate further.
                                    </option>
                                    <option value="Other">Other</option>
                                </select>
                                {state.errors?.reason && state.errors.reason.map((error: string) => (
                                    <p className="mt-1 text-sm text-red-500" key={error}>{error}</p>
                                ))}
                            </div>

                            <div className='mb-[40px] lg:mb-0 lg:col-span-2'>
                                {/* Message Textarea and Error */}
                                <textarea
                                    placeholder="Write Your Message..."
                                    name="message"
                                    className="w-full focus:outline-none focus:ring-0 box-border resize-y"
                                />
                                {/*</div>*/}
                                {state.errors?.message && state.errors.message.map((error: string) => (
                                    <p className="mt-1 text-sm text-red-500" key={error}>{error}</p>
                                ))}
                            </div>
                            <div className='mt-[20px] text-right lg:col-start-2'>
                                {/* Submit Button */}
                                <Button type="submit" disabled={loading} >
                                    {loading ? 'Submitting...' : 'Submit'}
                                </Button>
                            </div>
                        </form>
                    </div>
                    <div className='c-right hidden xl:block lg:col-span-4 lg:col-start-6 border-l-[1px] border-black border-solid'>
                        <img className='min-w-full h-full object-cover' alt='Contact stock image' src='images/Rectangle 96.png' />
                        <div className='absolute h-full w-[100vw] top-0 left-0 [background:linear-gradient(173.09deg,_rgba(1,_141,_242,_1),_rgba(237,_255,_164,_1))] opacity-[.5] border-none' />
                    </div>
                </div>
            </div>
        </section>

        <section id='api-documentation' className="home-section flex lg:mx-0 lg:py-[10px] grid-bg font-noto-sans">
        <div className="inner mx-auto lg:w-[846px]">
          <div className="box-border items-center justify-start gap-10 px-5 lg:px-0 py-[80px]">
            <div className="relative self-stretch text-center">
              <p className="m-0">
                <b>
                  <span className="text-sm leading-5 lg:text-[22px] lg:leading-[36px]">
                    Build with SDG Commons Data
                  </span>
                </b>
              </p>
              <p className="my-5 pb-5 text-sm font-medium leading-5 lg:text-[20px] lg:leading-[28px]">
                Access our databases of solutions, experiments, and insights through our developer-friendly APIs.
                Integrate the collective intelligence of global sustainability efforts into your applications and research projects.
              </p>

              <Button>
                <Link href="https://apis.sdg-innovation-commons.org/" target='_blank'>
                  Explore API Documentation
                </Link>
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </section>

        </>
    );
}
