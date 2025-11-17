import Navigation from "@/app/ui/components/Navbar";
import ProfileContent from "@/app/ui/components/Profile";
import Footer from "@/app/ui/components/Footer";
import platformApi, { getContributorInfo } from "@/app/lib/data/platform-api";
import { notFound } from "next/navigation";


export type incomingRequestParams = {
    params: Promise<{ uuid: string, }>;
  }

export default async function ProfilePage({
  params,
}: incomingRequestParams) {
    let { uuid } = await params;
    if (!uuid)  return notFound();

  // Fetch country names and profile data in parallel
  const [countries, rawProfile] = await Promise.all([
    platformApi({}, "experiment", "countries"),
    getContributorInfo(uuid), 
  ]);

  // Redirect to not found if the user lookup failed
  if (!rawProfile || (rawProfile as any).status !== 200) {
    notFound();
  }

  // At this point rawProfile is expected to be the contributor object; cast for the UI
  const profileData = rawProfile as any;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Main content */}
      <div className="relative home-section !border-t-0 grid-bg pt-[120px] lg:pb-[80px]">
        <ProfileContent countries={countries} profileData={profileData} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
