import Link from "next/link";
import { Button } from "@/app/ui/components/Button";

export default function NotPublished() {
  return (
    <section className="home-section grid-bg py-[80px] lg:py-[120px]">
      <div className="inner xxl:px-[80px] xxl:w-[1440px] mx-auto w-[375px] px-[20px] md:w-[744px] lg:w-[992px] lg:px-[80px] xl:w-[1200px] xl:px-[40px]">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Icon/Visual */}
          <div className="mb-[40px]">
            <svg 
              className="w-[120px] h-[120px] text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>

          {/* Message */}
          <h1 className="mb-[20px] text-[32px] font-bold leading-[1.2] lg:text-[48px]">
            <span className="slanted-bg yellow">
              <span>Collection Not Available</span>
            </span>
          </h1>

          <div className="max-w-[600px] mb-[40px]">
            <p className="text-[18px] leading-[1.6] text-gray-700 mb-[20px]">
              This collection is currently in draft mode and has not been published yet.
            </p>
            <p className="text-[16px] leading-[1.6] text-gray-600">
              Only the collection creator and administrators can view unpublished collections.
              If you believe you should have access to this collection, please contact the creator or an administrator.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-[20px] justify-center">
            <Link href="/next-practices">
              <Button>
                Browse Published Collections
              </Button>
            </Link>
            <Link href="/">
              <Button>
                Go to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
