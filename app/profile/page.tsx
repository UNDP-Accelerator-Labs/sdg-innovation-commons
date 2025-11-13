import Navigation from "@/app/ui/components/Navbar";
import ProfileContent from "@/app/ui/components/Profile";
import Footer from "@/app/ui/components/Footer";
import platformApi, { getContributorInfo } from "@/app/lib/data/platform-api";
import { redirect, unauthorized } from "next/navigation";
import getSession from "@/app/lib/session";

export default async function ProfilePage() {
    // fetch session and safely access fields to avoid TS errors when session is null
    const sess = (await getSession()) as { uuid?: string; username?: string } | null;
    const uuid = sess?.uuid;
    const username = sess?.username;
    if (!uuid || !username) return unauthorized();

  // Fetch country names and profile data in parallel
  const [countries, profileData] = await Promise.all([
    platformApi({}, "experiment", "countries"),
    getContributorInfo(uuid), 
  ]);

  // Redirect to unauthorized page if the user is not authorized
  if (!profileData || (profileData as any).status !== 200) {
    unauthorized();
  }

  // Narrow profileData to a usable value for the ProfileContent component
  const profile = (profileData && (profileData as any).status === 200) ? (profileData as any).data || (profileData as any) : null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Main content */}
      <div className="relative home-section !border-t-0 grid-bg pt-[120px] lg:pb-[80px]">
        <ProfileContent countries={countries} profileData={profile} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
