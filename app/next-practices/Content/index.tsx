"use client";
import { useState, useEffect } from "react";
import Card from "@/app/ui/components/Card/collection-card";
import { ImgCardsSkeleton } from "@/app/ui/components/Card/skeleton";
import { pagestats, Pagination } from "@/app/ui/components/Pagination";
import platformApi from "@/app/lib/data/platform-api";
import { page_limit, commonsPlatform } from "@/app/lib/helpers/utils";
import { useSharedState } from "@/app/ui/components/SharedState/Context";
import { useSearchParams } from "next/navigation";
import { Button } from "@/app/ui/components/Button";
import clsx from "clsx";
import { collection as collectionData } from "@/app/lib/data/collection/tempData";
import Link from "next/link";

export interface PageStatsResponse {
  total: number;
  pages: number;
}

interface Props {
  searchParams: any;
}

export default function Section({ searchParams }: Props) {
  const { sharedState } = useSharedState();
  const { isLogedIn, session } = sharedState || {};

  const [myCollections, setMyCollections] = useState<any[]>([]);
  const [publicCollections, setPublicCollections] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"my" | "public">("public");
  const [loadingCollections, setLoadingCollections] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!isLogedIn) return;
    setLoadingCollections(true);
    (async () => {
      try {
        const res = await fetch("/api/my-collections");
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          setMyCollections(data || []);
        }
      } catch (e) {
        console.error("Failed to fetch my collections", e);
      } finally {
        if (mounted) setLoadingCollections(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [isLogedIn]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/collections?list=public&limit=12");
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          setPublicCollections(data || []);
        }
      } catch (e) {
        console.error("Failed to fetch public collections", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const data = collectionData.map((d: any, i: number) => {
    const { id, ...obj } = d;
    obj.key = id;
    obj.id = i;
    obj.href = `/next-practices/${id}`;
    obj.description = obj.sections[0].items[0].txt;
    return obj;
  });

  // merge publicCollections with temp data fallback for display
  const publicData = publicCollections.length ? publicCollections : data;

  // derive a human-friendly status for a collection record
  const getCollectionStatus = (c: any): string => {
    // check for explicit status in highlights first
    if (c?.highlights?.status) {
      return c.highlights.status
        .split('_')
        .filter(Boolean)
        .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
    }

    // check top-level status field
    if (c?.status && typeof c.status === "string") {
      return c.status
        .split('_')
        .filter(Boolean)
        .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
    }

    // review flags in highlights (common patterns)
    if (c?.highlights && typeof c.highlights === "object") {
      // If awaiting_review is set, return awaiting review status
      if (c.highlights.awaiting_review || c.highlights?.review === true) {
        return "Awaiting Review";
      }
      if (
        Array.isArray(c.highlights?.comments) &&
        c.highlights.comments.length > 0
      )
        return "Review: Comments";
    }

    // public if it has boards attached
    if (Array.isArray(c?.boards) && c.boards.length > 0) return "Public";

    // if creator exists but no boards -> draft
    if (c?.creator_name || c?.creatorName || c?.creator) return "Draft";

    return "Draft";
  };

  return (
    <>
      <section className="home-section py-[80px]">
        <div className="inner mx-auto px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px]">
          {/* SEARCH */}
          {/* <form
            id="search-form"
            method="GET"
            className="section-header relative pb-[100px] lg:pb-[100px]"
          ></form> */}

          <div className="tabs flex row justify-between mb-6">
            <div className="group col-span-9 flex flex-row items-stretch lg:col-span-4">
              {/* Tabs: show only if user has at least one collection */}
              {isLogedIn && myCollections.length > 0 && (
                <>
                  {/* Display tabs */}
                  <nav className="tabs">
                    {(["public", "my"] as const).map((d, i) => (
                      <div
                        key={i}
                        className={clsx(
                          "tab tab-line",
                          activeTab === d ? "font-bold" : "yellow"
                        )}
                      >
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab(d);
                          }}
                        >
                          {d === "my" ? "My Collections" : "Public Collections"}
                        </a>
                      </div>
                    ))}
                  </nav>
                </>
              )}
            </div>
            {session?.rights >= 2 && (
              <div className="col-span-5 col-start-5 flex flex-row gap-x-5 md:col-span-2 md:col-start-8 lg:col-span-1 lg:col-end-10">
                <Button
                  onClick={() =>
                    (window.location.href = "/next-practices/create")
                  }
                >
                  Create Collection
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mb-6">
            {isLogedIn && session?.pinboards?.length ? (
              <p className="lead">
                Browse through thematic curated boards on frontier sustainable
                development challenges. Click on “My boards” at the bottom right
                to access and customize your own boards.
              </p>
            ) : null}
          </div>

          <div className="section-content pt-[40px]">
            {/* Display Cards */}
            <div className="grid gap-[20px] md:grid-cols-2 lg:grid-cols-3">
              {(activeTab === "my" ? myCollections : publicData).map(
                (d: any, i: number) => (
                  <div key={i} className="relative">
                    {activeTab === "my" && (
                      <div
                        className={clsx(
                          "absolute top-12 right-2 px-2 py-1 border rounded text-xs font-semibold",
                          getCollectionStatus(d) === "Published" || getCollectionStatus(d) === "Public"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : getCollectionStatus(d) === "Rejected"
                              ? "bg-red-100 text-red-800 border-red-300"
                              : getCollectionStatus(d).startsWith("Review") ||
                                getCollectionStatus(d) === "Awaiting Review"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                : "bg-gray-100 text-gray-800 border-gray-300"
                        )}
                        style={{ zIndex: 50 }}
                      >
                        {getCollectionStatus(d)}
                      </div>
                    )}
                    <Card
                      id={d.slug || d.id}
                      title={d.title}
                      description={""}
                      tags={[]}
                      href={`/next-practices/${d.slug || d.id}`}
                      viewCount={(d.boards || []).length}
                      backgroundImage={d.main_image || d.mainImage}
                      openInNewTab={false}
                      className="mt-10"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
