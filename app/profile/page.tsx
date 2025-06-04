import Navigation from "@/app/ui/components/Navbar";
import ProfileContent from "@/app/ui/components/Profile";
import Footer from "@/app/ui/components/Footer";
import platformApi, { getContributorInfo } from "@/app/lib/data/platform-api";
import { redirect, unauthorized } from "next/navigation";
import getSession from "@/app/lib/session";

export default async function ProfilePage() {
    const { uuid, username } = await getSession()|| {};
    if (!uuid || !username)  return unauthorized();

  // Fetch country names and profile data in parallel
  const [countries, profileData] = await Promise.all([
    platformApi({}, "experiment", "countries"),
    getContributorInfo(uuid), 
  ]);

  // Redirect to unauthorized page if the user is not authorized
  if (!profileData || profileData.status !== 200) {
    unauthorized()
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
