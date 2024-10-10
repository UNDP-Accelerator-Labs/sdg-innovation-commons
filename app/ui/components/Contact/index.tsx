'use client';
import { useFormState } from "react-dom";
import { createContact, ContactState } from '@/app/lib/data/contact-us';
import { Button } from '@/app/ui/components/Button';

export default function Contact() {
    const initialState: ContactState = { message: null, errors: {} };
    const [state, formAction] = useFormState(createContact, initialState);

    return (
        <div className="relative bg-posted-yellow border-black border-t-[1px] border-solid box-border w-full flex flex-col lg:flex-row items-start lg:items-center justify-start text-left text-base text-black">
            <div className="w-full lg:w-2/3 bg-posted-yellow flex flex-col items-start justify-start py-10 px-5 lg:py-[100px] lg:px-20 box-border gap-[30px] lg:gap-[60px]">
                <div className="lg:self-stretch lg:flex lg:flex-row items-start justify-start gap-[111px]">
                {/* Contact Us title */}
                <div className="flex flex-col items-start justify-start relative text-[28px] lg:text-17xl">
                    <img className="w-[243px] absolute !m-[0] bottom-[0px] left-[-10px] h-[26px] z-[0]" alt="" src="images/Rectangle 94.svg" />
                    <b className="relative text-[28px] lg:text-[32px] leading-[38px] lg:leading-[46px] z-[1]">Contact Us</b>
                </div>
                {/* Description */}
                <div className="lg:w-[304px] self-stretch relative leading-[24px] lg:leading-[26px] lg:text-lg lg:inline-block lg:shrink-0 text-[16px]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut accumsan diam adipiscing elit.
                </div>
                </div>
                {/* Form */}
                <form action={formAction} className="self-stretch flex flex-col items-end justify-start gap-5 lg:items-start">
                    <div className="self-stretch flex flex-col items-start justify-start gap-5">
                        <div className="self-stretch  w-full lg:flex lg:flex-row gap-5">
                            {/* Name Input and Error */}
                            <div className="lg:flex lg:flex-col lg:w-[305px]">
                                <div className="self-stretch bg-white border-black border-[1px] border-solid box-border h-[47px] lg:h-[60px] flex items-center justify-start py-[18px] px-[22px] focus-within:border-blue-500 gap-5">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        className="w-full bg-transparent border-none focus:outline-none focus:ring-0 focus:border-none leading-[24px]"
                                    />
                                </div>
                                {state.errors?.name && state.errors.name.map((error: string) => (
                                    <p className="mt-1 text-sm text-red-500" key={error}>{error}</p>
                                ))}
                            </div>

                            {/* Surname Input and Error */}
                            <div className="lg:flex lg:flex-col lg:w-[305px] mt-5 lg:mt-0">
                                <div className="bg-white border-black border-[1px] border-solid box-border h-[47px] lg:h-[60px] flex items-center justify-start py-[18px] px-[22px] focus-within:border-blue-500">
                                    <input
                                        type="text"
                                        name="surname"
                                        placeholder="Surname"
                                        className="w-full bg-transparent border-none focus:outline-none focus:ring-0 focus:border-none leading-[24px]"
                                    />
                                </div>
                                {state.errors?.surname && state.errors.surname.map((error: string) => (
                                    <p className="mt-1 text-sm text-red-500" key={error}>{error}</p>
                                ))}
                            </div>
                        </div>

                        <div className="self-stretch  w-full lg:flex lg:flex-row gap-5">
                            {/* Email Input and Error */}
                            <div className="lg:flex lg:flex-col lg:w-[305px]">
                                <div className="bg-white border-black border-[1px] border-solid box-border h-[47px] lg:h-[60px] flex items-center justify-start py-[18px] px-[22px] focus-within:border-blue-500">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        className="w-full bg-transparent border-none focus:outline-none focus:ring-0 focus:border-none leading-[24px]"
                                    />
                                </div>
                                {state.errors?.email && state.errors.email.map((error: string) => (
                                    <p className="mt-1 text-sm text-red-500" key={error}>{error}</p>
                                ))}
                            </div>

                            {/* Organization Input and Error */}
                            <div className="lg:flex lg:flex-col lg:w-[305px] mt-5 lg:mt-0">
                                <div className="bg-white border-black border-[1px] border-solid box-border h-[47px] lg:h-[60px] flex items-center justify-start py-[18px] px-[22px] focus-within:border-blue-500">
                                    <input
                                        type="text"
                                        name="org"
                                        placeholder="Organization"
                                        className="w-full bg-transparent border-none focus:outline-none focus:ring-0 focus:border-none leading-[24px]"
                                    />
                                </div>
                                {state.errors?.org && state.errors.org.map((error: string) => (
                                    <p className="mt-1 text-sm text-red-500" key={error}>{error}</p>
                                ))}
                            </div>
                        </div>

                        <div className="self-stretch  w-full lg:flex lg:flex-row gap-5">
                            {/* Message Textarea and Error */}
                            <div className="lg:flex lg:flex-col w-full lg:w-[630px]">
                                <div className="relative h-[164px] focus-within:border-blue-500">
                                    <textarea
                                        placeholder="Write Your Message..."
                                        name="message"
                                        className="absolute top-0 left-0 w-full h-full bg-white border-black border-[1px] border-solid box-border p-4 focus:outline-none focus:ring-0 focus:border-none leading-[24px] resize-none"
                                    />
                                </div>
                                {state.errors?.message && state.errors.message.map((error: string) => (
                                    <p className="mt-1 text-sm text-red-500" key={error}>{error}</p>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit">Submit</Button>
                </form>
            </div>

            {/* Image and gradient overlay (desktop only) */}
            <div className="hidden lg:block relative w-[648px]">
                <img className="w-[653.7px] relative h-[783px] object-cover" alt="" src="images/Rectangle 96.png" />
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-[rgba(3,_104,_177,_0.25)] to-[rgba(237,_255,_164,_0.25)] z-[2]" />
            </div>
        </div>
    );
}
