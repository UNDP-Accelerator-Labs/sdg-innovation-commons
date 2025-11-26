import clsx from "clsx";
import collectionData from "@/app/lib/data/collection";
import Card from "@/app/ui/components/Card/featured-card";
import { Pagination } from "@/app/ui/components/Pagination";
import CollectionReview from "@/app/next-practices/[collection]/CollectionReview/client";

import Hero from "../Hero";
import Infobar from "../Infobar";
import { Button } from "@/app/ui/components/Button";
import Link from "next/link";

export interface PageStatsResponse {
  total: number;
  pages: number;
}

interface SectionProps {
  id: string;
  searchParams: any;
  session?: any;
}

export default async function Section({
  id,
  searchParams,
  session,
}: SectionProps) {
  const { page, search } = searchParams;

  const {
    title,
    description,
    creatorName,
    mainImage,
    sections,
    data,
    pages,
    tags,
    sdgs,
    locations,
    highlights,
  } = await collectionData({ id, searchParams });

  return (
    <>
      <Hero
        title={title}
        description={description}
        creator={creatorName}
        image={mainImage}
        tags={tags}
        cards={data?.sort((a: any, b: any) => b.total - a.total).slice(0, 3)}
        count={data.length}
      />

      <Infobar
        sections={sections}
        sdgs={sdgs}
        locations={locations}
        // vignette={vignette}
      />

      {/* Review panel: client component handles visibility and admin actions */}
      {highlights?.length <= 0 || highlights?.published === true ? (
        <></>
      ) : (
        <div className="home-section py-[40px] px-[40px] lg:py-[80px]">
          <CollectionReview
            slug={id}
            highlights={highlights}
            creatorName={creatorName}
          />
        </div>
      )}

      <section className="home-section grid-bg py-[40px] lg:py-[80px]">
        <div className="inner xxl:px-[80px] xxl:w-[1440px] mx-auto w-[375px] px-[20px] md:w-[744px] lg:w-[992px] lg:px-[80px] xl:w-[1200px] xl:px-[40px]">
          {/* SEARCH */}
          <form
            id="search-form"
            method="GET"
            className="section-header relative"
          ></form>
          {/* Display the section title and description */}
          <div className="section-header mb-[20px] lg:mb-[100px]">
            <div className="c-left col-span-9 lg:col-span-5">
              <h2 className="mb-[20px]">
                <span className="slanted-bg yellow">
                  <span>Full List of Boards in this Collection</span>
                </span>
              </h2>
            </div>
          </div>
          {/* Display the content */}
          <div className="section-content">
            {/* Display Cards */}
            <div className="mb-[40px] grid gap-[20px] md:grid-cols-2 lg:mb-[80px] lg:grid-cols-3">
              {data?.map((post: any) => (
                <Card
                  key={post?.pinboard_id}
                  id={post?.pinboard_id}
                  country={
                    post?.country === "NUL" || !post?.country
                      ? "Global"
                      : post?.country
                  }
                  title={post?.title || ""}
                  description={
                    post?.description?.length > 200
                      ? `${post?.description.slice(0, 200)}…`
                      : post?.description
                  }
                  source={post?.base || "solution"}
                  tagStyle="bg-light-green"
                  tagStyleShade="bg-light-green-shade"
                  href={`/boards/all/${post?.pinboard_id}`}
                  backgroundImage={post?.vignette}
                  date={post?.date}
                  viewCount={post?.total}
                />
              ))}
            </div>
          </div>
          {pages > 1 && (
            <div className="pagination">
              <div className="col-start-2 flex w-full justify-center">
                <Pagination page={+page} totalPages={pages} />
              </div>
            </div>
          )}

          {/* Edit Collection page if you are creator or admin and collection is not rejected */}
          {((highlights && highlights?.creator_uuid === session?.uuid) ||
          session?.rights >= 4) && highlights?.status !== 'rejected' ? (
            <div className="flex row justify-between mb-6">
              <div className="group col-span-9 flex flex-row items-stretch lg:col-span-4"></div>
              <div className="col-span-5 col-start-5 flex flex-row gap-x-5 md:col-span-2 md:col-start-8 lg:col-span-1 lg:col-end-10">
                <Button>
                  <Link href={`/next-practices/create?edit=${id}`}>
                    Edit Collection
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </section>
    </>
  );
}
