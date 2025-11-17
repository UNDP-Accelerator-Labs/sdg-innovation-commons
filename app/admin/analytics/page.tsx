import React from "react";
import getSession from "@/app/lib/session";
import Navbar from "@/app/ui/components/Navbar";
import Footer from "@/app/ui/components/Footer";
import { Button } from "@/app/ui/components/Button";
import Link from "next/link";
import { ChevronLeft } from 'lucide-react';

export default async function Page() {
  const session = await getSession();
  const rights = session?.rights || 0;
  if (!session || rights < 4) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="container mx-auto p-6">
          <h1 className="text-2xl font-bold">Unauthorized</h1>
          <p className="mt-4">You do not have permission to view this page.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      <Navbar />
      <div className="grid-bg">
        <main className="max-w-6xl mx-auto py-12">
          <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <h1 className="text-4xl mb-2 font-bold">
                <>Admin </>
                <span className="slanted-bg blue">
                  <span>Analytics</span>
                </span>
              </h1>
              <p className="text-gray-600">
                High-level analytics and interactive charts.
              </p>
              </div>
              <div className="mt-6 sm:mt-0">
                <Button>
                    <ChevronLeft className="size-4 mr-2" />
                  <Link href="/admin">Back to Dashboard</Link>
                </Button>
              </div>
          </div>

          <div className="p-4 border-2 rounded bg-white shadow-sm border-black border-solid">
            Coming soon!
          </div>

          {/* Quick links / utilities */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-5">
            <div className="bg-white border-2 border-black border-solid p-6">
              <h4 className="font-bold text-lg mb-2">Export data</h4>
              <p className="text-sm text-gray-600 mb-4">
                Request and manage data exports.
              </p>
              <div className="h-1 w-12 bg-[#d2f960] mb-4"></div>
              <Button className="">
                <Link href="/admin/exports">Manage Exports</Link>
              </Button>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
