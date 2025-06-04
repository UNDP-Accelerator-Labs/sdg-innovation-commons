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
  const [countries, profileData] = await Promise.all([
    platformApi({}, "experiment", "countries"),
    getContributorInfo(uuid), 
  ]);

  // Redirect to unauthorized page if the user is not authorized
  if (!profileData || profileData.status !== 200) {
    notFound()
  }

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
