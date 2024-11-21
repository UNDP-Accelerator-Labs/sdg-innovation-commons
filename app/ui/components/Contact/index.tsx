'use client';
import clsx from 'clsx';
import { useActionState } from "react";
import { createContact, ContactState } from '@/app/lib/data/contact-us';
import { Button } from '@/app/ui/components/Button';

export default function Contact() {
    const initialState: ContactState = { message: null, errors: {}, isSubmitting: false };
    const [state, formAction] = useActionState(createContact, initialState);

    return (
        <>
        <section className='home-section lg:px-0 lg:py-0 bg-posted-yellow' id='contact' >
            <div className='inner mx-auto md:w-[744px] lg:w-[1440px]'>
                <div className='section-content grid grid-cols-9 gap-[20px]'>
                    <div className='c-left md:col-span-9 lg:col-span-4 md:px-[40px] md:py-[80px] lg:pl-[80px] lg:py-[120px]'>
                        <div className='lg:grid lg:grid-cols-2 lg:gap-[20px] lg:mb-[20px]'>
                            <div>
                                <h2 className='md:mb-[20px]'>
                                    <span className='slanted-bg white'>
                                        <span>Contact us</span>
                                    </span>
                                </h2>
                            </div>
                            {/* Description */}
                            <div className='lg:mt-[20px]'>
                                <p className='lead'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut accumsan diam adipiscing elit.
                                </p>
                            </div>
                        </div>

                        <p className='text-base font-semibold'>
                            If you would like to report a bug or a technical issue, please <a href="https://github.com/UNDP-Accelerator-Labs/sdg-innovation-commons/issues/new/choose" target='_blank' className='text-light-blue'>click here.</a>
                        </p>

                        {/* Display Success or Failure Message */}
                        {state.message && (
                            <div className={clsx('my-4 font-bold', state.success ? 'text-undp-blue' : 'text-red-500')}>
                                {state.message}
                            </div>
                        )}

                        {/* Form */}
                        <form action={formAction} className='lg:grid lg:grid-cols-2 lg:gap-[20px]'>
                            {/* Name Input and Error */}
                            <div className='md:mb-[20px] lg:mb-0'>
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
                            <div className='md:mb-[20px] lg:mb-0'>
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
                            <div className='md:mb-[20px] lg:mb-0'>
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
                            <div className='md:mb-[20px] lg:mb-0'>
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
                             <div className='md:mb-[20px] lg:mb-0 lg:col-span-2'>
                                <select
                                    name="reason"
                                    className="w-full focus:outline-none focus:ring-0"
                                    defaultValue=""
                                    required
                                >
                                    <option value="" disabled>
                                        Select a reason for contact
                                    </option>
                                    <option value="I would like to become a super user">I would like to become a super user.</option>
                                    <option value="I'm trying to use it but I'm stuck, please help">I'm trying to use it but I'm stuck, please help.</option>
                                    <option value="I have content to contribute">I have content to contribute.</option>
                                    <option value="I'm interested in using the SDG Commons, and I need help to make sense of it and would like to collaborate further">
                                        I'm interested in using the SDG Commons, and I need help to make sense of it and would like to collaborate further.
                                    </option>
                                    <option value="Other">Other</option>
                                </select>
                                {state.errors?.reason && state.errors.reason.map((error: string) => (
                                    <p className="mt-1 text-sm text-red-500" key={error}>{error}</p>
                                ))}
                            </div>

                            <div className='md:mb-[40px] lg:mb-0 lg:col-span-2'>
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
                            <div className='mt-[20px] md:text-right lg:col-start-2'>
                                {/* Submit Button */}
                                <Button type="submit" disabled={state.isSubmitting}>{state.isSubmitting ? 'Submitting...' : 'Submit'}</Button>
                            </div>
                        </form>
                    </div>
                    <div className='c-right md:hidden lg:block lg:col-span-4 lg:col-start-6 border-l-[1px] border-black border-solid'>
                        <img className='w-full h-full object-cover' alt='Contact stock image' src='images/Rectangle 96.png' />
                        <div className='absolute h-full w-full top-0 left-0 [background:linear-gradient(173.09deg,_rgba(1,_141,_242,_1),_rgba(237,_255,_164,_1))] opacity-[.5] border-none' />
                    </div>
                </div>
            </div>
        </section>
        </>
    );
}
