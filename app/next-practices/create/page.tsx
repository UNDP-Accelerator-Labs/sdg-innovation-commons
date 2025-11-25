"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSharedState } from "@/app/ui/components/SharedState/Context"
import Navigation from "@/app/ui/components/Navbar"
import CreateCollectionClient from "./create-collection-client"
import Footer from "@/app/ui/components/Footer"

export default function CreateCollectionPage() {
  const { sharedState } = useSharedState()
  const { session } = sharedState || {}
  const router = useRouter()

  useEffect(() => {
    // sharedState.session is initially undefined while the client hydrates.
    // Only redirect if we know the user is unauthenticated (session === null)
    // or the user is authenticated but lacks rights.
    if (session === undefined) return; // still loading
    if (!session || session.rights < 2) {
      router.push('/unauthorized');
    }
  }, [session])

  return (
    <>
      <section className="home-section grid-bg relative !border-t-0 pt-[120px] lg:pb-[80px] lg:pt-0">
        <Navigation />

        {/* Decorative elements */}
        <img
          className="absolute right-0 top-[170px] w-[80%] lg:top-[120px] lg:w-[40%]"
          alt="Branding illustration"
          src="/images/hands/test_top.svg"
        />
        <img
          className="absolute bottom-0 right-[30%] w-[60%] md:right-[60%] lg:right-[10%] lg:w-[30%]"
          alt="Branding illustration"
          src="/images/hands/test_bottom.svg"
        />

        <div className="container relative z-10 mx-auto px-4 py-16">
          <CreateCollectionClient />
        </div>
      </section>
      <Footer />
    </>
  )
}
