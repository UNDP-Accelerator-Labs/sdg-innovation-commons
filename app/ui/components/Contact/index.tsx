"use client";
import clsx from "clsx";
import { useActionState, useState, useEffect } from "react";
import { createContact, ContactState } from "@/app/lib/data/contact-us";
import { Button } from "@/app/ui/components/Button";
import Link from "next/link";
import { useSharedState } from "@/app/ui/components/SharedState/Context";

export default function Contact() {
  const [loading, setLoading] = useState<boolean>(false);
  const [formLoadTime] = useState<number>(Date.now());
  const [apiToken, setApiToken] = useState<string | null>(null);
  const [tokenCopied, setTokenCopied] = useState<boolean>(false);
  const [tokenVisible, setTokenVisible] = useState<boolean>(false);
  const { sharedState } = useSharedState();
  const { isLogedIn } = sharedState || {};

  const initialState: ContactState = {
    message: null,
    errors: {},
    isSubmited: false,
  };
  const [state, formAction] = useActionState(createContact, initialState);

  // Fetch API token when user is logged in
  useEffect(() => {
    if (isLogedIn) {
      fetch("/api/auth/api-token")
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            setApiToken(data.token);
          }
        })
        .catch((err) => console.error("Error fetching API token:", err));
    }
  }, [isLogedIn]);

  const copyToken = async () => {
    if (apiToken) {
      try {
        await navigator.clipboard.writeText(apiToken);
        setTokenCopied(true);
        setTimeout(() => setTokenCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy token:", err);
      }
    }
  };

  const handleForm = async (e: FormData) => {
    setLoading(true);
    formAction(e);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <>
      <section
        className="home-section overflow-hidden lg:px-0 lg:py-0 bg-posted-yellow"
        id="contact"
      >
        <div className="inner mx-auto w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px]">
          <div className="section-content grid grid-cols-9 gap-[20px] px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px]">
            <div className="c-left col-span-9 xl:col-span-4 py-[80px] lg:py-[120px]">
              <div className="lg:grid lg:grid-cols-2 lg:gap-[20px] lg:mb-[20px]">
                <div>
                  <h2 className="mb-[20px]">
                    <span className="slanted-bg white">
                      <span>Contact us</span>
                    </span>
                  </h2>
                </div>
                {/* Description */}
                <div className="lg:mt-[20px]">
                  <p className="lead">
                    If you want to be involved or get help, drop us a line
                    below. We’re here to help.
                  </p>
                </div>
              </div>

              <small className="block w-full mb-5 text-base">
                If you would like to report a bug or a technical issue, or
                suggest a new feature please{" "}
                <a
                  href="https://github.com/UNDP-Accelerator-Labs/sdg-innovation-commons/issues/new/choose"
                  target="_blank"
                  className="text-light-blue"
                >
                  click here.
                </a>
              </small>

              {/* Display Success or Failure Message */}
              {state.message && (
                <div
                  className={clsx(
                    "my-4 font-bold",
                    state.success ? "text-undp-blue" : "text-red-500"
                  )}
                >
                  {state.message}
                </div>
              )}

              {/* Form */}
              <form
                action={handleForm}
                className="lg:grid lg:grid-cols-2 lg:gap-[20px]"
              >
                {/* Honeypot field - hidden from users but visible to bots */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    width: "1px",
                    height: "1px",
                    overflow: "hidden",
                  }}
                  aria-hidden="true"
                />
                {/* Hidden field for time-based validation */}
                <input type="hidden" name="formLoadTime" value={formLoadTime} />
                {/* Name Input and Error */}
                <div className="mb-[20px] lg:mb-0">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0"
                  />
                  {state.errors?.name &&
                    state.errors.name.map((error: string) => (
                      <p className="mt-1 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>

                {/* Surname Input and Error */}
                <div className="mb-[20px] lg:mb-0">
                  <input
                    type="text"
                    name="surname"
                    placeholder="Surname"
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0"
                  />
                  {state.errors?.surname &&
                    state.errors.surname.map((error: string) => (
                      <p className="mt-1 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>

                {/* Email Input and Error */}
                <div className="mb-[20px] lg:mb-0">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0"
                  />
                  {state.errors?.email &&
                    state.errors.email.map((error: string) => (
                      <p className="mt-1 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>

                {/* Organization Input and Error */}
                <div className="mb-[20px] lg:mb-0">
                  <input
                    type="text"
                    name="org"
                    placeholder="Organization"
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0"
                  />
                  {state.errors?.org &&
                    state.errors.org.map((error: string) => (
                      <p className="mt-1 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>

                {/* Dropdown Menu */}
                <div className="mb-[20px] lg:mb-0 lg:col-span-2">
                  <select
                    name="reason"
                    className="w-full focus:outline-none focus:ring-0"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Select a reason for contact
                    </option>
                    <option value="I would like to become a super user to actively test it for my team">
                      I would like to become a super user to actively test it
                      for my team.
                    </option>
                    <option value="I have content to contribute">
                      I have content to contribute.
                    </option>
                    <option value="I'm interested in using the SDG Commons, and I need help to make sense of it and would like to collaborate further.">
                      I'm interested in using the SDG Commons, and I need help
                      to make sense of it and would like to collaborate further.
                    </option>
                    <option value="Other">Other</option>
                  </select>
                  {state.errors?.reason &&
                    state.errors.reason.map((error: string) => (
                      <p className="mt-1 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>

                <div className="mb-[40px] lg:mb-0 lg:col-span-2">
                  {/* Message Textarea and Error */}
                  <textarea
                    placeholder="Write Your Message..."
                    name="message"
                    className="w-full focus:outline-none focus:ring-0 box-border resize-y"
                  />
                  {/*</div>*/}
                  {state.errors?.message &&
                    state.errors.message.map((error: string) => (
                      <p className="mt-1 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
                <div className="mt-[20px] text-right lg:col-start-2">
                  {/* Submit Button */}
                  <Button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </form>
            </div>
            <div className="c-right hidden xl:block lg:col-span-4 lg:col-start-6 border-l-[1px] border-black border-solid">
              <img
                className="min-w-full h-full object-cover"
                alt="Contact stock image"
                src="images/Rectangle 96.png"
              />
              <div className="absolute h-full w-[100vw] top-0 left-0 [background:linear-gradient(173.09deg,_rgba(1,_141,_242,_1),_rgba(237,_255,_164,_1))] opacity-[.5] border-none" />
            </div>
          </div>
        </div>
      </section>

      <section
        id="api-documentation"
        className="home-section flex lg:mx-0 lg:py-[10px] grid-bg font-noto-sans"
      >
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
                Access our databases of solutions, experiments, and insights
                through our developer-friendly APIs. Integrate the collective
                intelligence of global sustainability efforts into your
                applications and research projects.
              </p>

              {isLogedIn && apiToken && (
                <div className="mb-6 mx-auto max-w-2xl bg-white border-2 border-blue-100 rounded-xl p-6 shadow-sm">
                  <div className="mb-3">
                    <p className="text-[12px] font-semibold text-gray-700">
                      Your API Access Token
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg p-3 mb-3">
                    {tokenVisible ? (
                      <code className="flex-1 text-xs font-mono text-gray-800 break-all select-all">
                        {apiToken}
                      </code>
                    ) : (
                      <div className="flex-1 text-[14px] font-mono text-gray-400">
                        {"•".repeat(60)}
                      </div>
                    )}

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => setTokenVisible(!tokenVisible)}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-300 transition-colors"
                        title={tokenVisible ? "Hide token" : "Show token"}
                      >
                        {tokenVisible ? (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>

                      <button
                        onClick={copyToken}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        {tokenCopied ? (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Copied
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-[11px] leading-relaxed text-gray-500">
                      Secure this token—it grants API access to your account data and is valid for one year. Add it to requests as:
                      <code className="block bg-white px-2 py-1.5 mt-1 rounded text-gray-800 font-mono text-[9px]">
                        Authorization: Bearer YOUR_TOKEN
                      </code>
                    </p>
                  </div>
                </div>
              )}

              <Button>
                <Link href="/api-docs" target="_blank">
                  Explore API Documentation
                </Link>
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
