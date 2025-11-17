import React from "react";
import getSession from "@/app/lib/session";
import Navbar from "@/app/ui/components/Navbar";
import Footer from "@/app/ui/components/Footer";
import ExportsPanel from "./ExportsPanel.client";
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
              <h1 className="text-5xl font-bold mb-3">
                <>Admin </>
                <span className="slanted-bg blue">
                  <span>Analytics</span>
                </span>
              </h1>
              <p className="text-gray-600 text-lg">
                Request and manage multi-DB exports. Enqueues background jobs
                and lists recent exports.
              </p>
            </div>

            <div className="mt-6 sm:mt-0">
              <Button>
                <ChevronLeft className="size-4 mr-2" />
                <Link href="/admin"> Back to Dashboard</Link>
              </Button>
            </div>
          </div>
          <ExportsPanel />
        </main>
      </div>
      <Footer />
    </div>
  );
}
