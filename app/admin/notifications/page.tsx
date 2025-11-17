import React from 'react';
import Navigation from '@/app/ui/components/Navbar';
import Footer from '@/app/ui/components/Footer';
import getSession from '@/app/lib/session';
import { unauthorized } from 'next/navigation';
import NotificationsClient from './NotificationsClient.client';

import { Button } from "@/app/ui/components/Button";
import Link from "next/link";
import { ChevronLeft } from 'lucide-react';

export default async function AdminNotificationsPage(){
  const session = await getSession();
  const rights = session?.rights || 0;
  if (!session || rights < 4) return unauthorized();

  // Server-side render: minimal page shell, client will fetch notifications
  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      <Navigation />
      <div className="grid-bg">
        <main className="max-w-6xl mx-auto py-12">
          <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <h1 className="text-4xl mb-2 font-bold">System <span className="slanted-bg blue"><span>Notifications</span></span></h1>
              <p className="text-gray-600">View and act on system-wide notifications.</p>
            </div>

            <div className="mt-6 sm:mt-0">
              <Button>
                <ChevronLeft className="size-4 mr-2" />
                <Link href="/admin">Back to Dashboard</Link>
              </Button>
            </div>
          </div>

          <section className="bg-white border-2 border-black border-solid p-6">
            <div id="admin-notifications-root">
              <NotificationsClient />
            </div>
          </section>

        </main>
      </div>
      <Footer />
    </div>
  );
}
