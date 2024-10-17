'use client';
import { useFormState } from "react-dom";
import { createContact, ContactState } from '@/app/lib/data/contact-us';
import { Button } from '@/app/ui/components/Button';

export default function Contact() {
    const initialState: ContactState = { message: null, errors: {} };
    const [state, formAction] = useFormState(createContact, initialState);

    return (
        <>
            <section className='lg:home-section lg:px-0 lg:py-0 bg-[#EDFFA4]'>
                <div className='section-content grid grid-cols-9 gap-[20px]'>
                    <div className='c-left lg:col-span-4 lg:pl-[80px] lg:py-[100px]'>
                        <div className='grid grid-cols-2 gap-[20px] lg:pb-[40px]'>
                            <div>
                                <h2 className='slanted-bg white lg:mt-[5px]'>
                                    <span>Contact us</span>
                                </h2>
                            </div>
                            {/* Description */}
                            <div className='lg:mt-[20px]'>
                                <p className='lead'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut accumsan diam adipiscing elit.
                                </p>
                            </div>
                        </div>
                        {/* Form */}
                        <form action={formAction} className='grid grid-cols-2 gap-[20px]'>
                            {/* Name Input and Error */}
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0"
                                />
                                {state.errors?.name && state.errors.name.map((error: string) => (
                                    <p className="mt-1 text-sm text-red-500" key={error}>{error}</p>
                                ))}
                            </div>

                            {/* Surname Input and Error */}
                            <div>
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
                            <div>
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
                            <div>
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

                            <div className='col-span-2'>
                                {/* Message Textarea and Error */}
                                {/*<div className="relative h-[164px] focus-within:border-blue-500">*/}
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
                            <div className='mt-[20px]'>
                                {/* Submit Button */}
                                <Button type="submit">Submit</Button>
                            </div>
                        </form>
                    </div>
                    <div className='c-right lg:col-span-4 lg:col-start-6 border-l-[1px] border-black border-solid'>
                        <img className='w-full h-full object-cover' alt='Contact stock image' src='images/Rectangle 96.png' />
                        <div className='absolute h-full w-full top-0 left-0 [background:linear-gradient(173.09deg,_rgba(1,_141,_242,_1),_rgba(237,_255,_164,_1))] opacity-[.5] border-none' />
                    </div>
                </div>
            </section>
        </>
    );
}
