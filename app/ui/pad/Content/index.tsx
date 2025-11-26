import Link from "next/link";
import { Button } from "@/app/ui/components/Button";
import renderComponents from "@/app/ui/components/MediaComponents";
import platformApi, { addComment } from "@/app/lib/data/platform-api";
import woldMap from "@/app/lib/data/world-map";
import Hero from "../Hero";
import Cartouche from "../Cartouche";
import Disclaimer from "../Disclamer";
import Feedback from "../Feedback";
import clsx from "clsx";
import CommentSection from "./CommentSection";
import ReportContent from "./ReportContent";

interface Props {
  id: number;
  platform: string;
}

export default async function Section({ id, platform }: Props) {
  const data = await platformApi(
    {
      pads: id,
      include_locations: true,
      include_data: true,
      pseudonymize: false,
      include_source: true,
      include_metafields: true,
    },
    platform,
    "pads"
  );

  const [datum] = data;
  let {
    base,
    title,
    ownername,
    position,
    email,
    country,
    iso3,
    sections,
    vignette,
    locations,
    rawtags,
    tags,
    sdg,
    source,
    metadata,
    pinboards,
    current_user_engagement,
    engagement,
    comments,
    contributor_id,
  } = datum || {};

  let lab: string | undefined = undefined;
  const isUNDP: boolean = email?.includes("@undp.org");
  const isLabber: boolean = position?.includes("Head of");
  if (isUNDP && isLabber) lab = `UNDP ${country} Accelerator Lab`;

  if (!tags?.length && source) {
    const { tags: sourceTags } = source;
    tags = sourceTags
      ?.filter((d: any) => d.type === "thematic_areas")
      ?.map((d: any) => d.name);
  }
  if (!sdg?.length && source) {
    const { tags: sourceTags } = source;
    sdg = sourceTags
      ?.filter((d: any) => d?.type === "sdgs")
      ?.map((d: any) => d?.key);
  }
  if (!locations?.length) {
    locations = [{ iso3, country }];
  }

  let datasources: string[] = rawtags
    ?.filter((d: any) => d.type === "datasources")
    ?.map((d: any) => d.name);
  let methods: string[] = rawtags
    ?.filter((d: any) => d.type === "methods")
    ?.map((d: any) => d.name);
  if (!datasources?.length && typeof source === "object") {
    const { tags: sourceTags } = source;
    datasources = sourceTags
      ?.filter((d: any) => d?.type === "datasources")
      ?.map((d: any) => d.name);
  }
  if (!methods?.length && typeof source === "object") {
    const { tags: sourceTags } = source;
    methods = sourceTags
      ?.filter((d: any) => d.type === "methods")
      ?.map((d: any) => d.name);
  }

  let scaling: string[] = [];
  let cost: string[] = [];
  if (metadata?.length) {
    scaling = metadata
      ?.filter((d: any) => d.name === "scaling")
      ?.map((d: any) => d.value);
    cost = metadata
      ?.filter((d: any) => d.name === "total_cost")
      ?.map((d: any) => d.value);
  }

  let color: string = "green";
  if (base === "action plan") color = "yellow";
  else if (base === "experiment") color = "orange";

  const imgBase = vignette?.split("/uploads/")[0];

  const mapLayers = locations?.map((d: any) => {
    return { ...d, ...{ type: "point", color: "#d2f960", count: 1 } };
  });
  const { status, file: mapFile } = await woldMap({
    platform,
    projsize: 1440 / 3,
    base_color: "#000",
    layers: mapLayers,
  });

  return (
    <>
      <Hero
        id={id}
        platform={platform}
        title={title}
        vignette={vignette}
        owner={ownername}
        lab={lab}
        tags={tags}
        padtype={base}
        tagStyle={`bg-light-${color}`}
        tagStyleShade={`bg-light-${color}-shade`}
        color={color === "yellow" ? "light-yellow" : color}
        pinboards={pinboards}
        current_user_engagement={current_user_engagement}
        engagement={engagement}
        contributor_id={contributor_id}
      />
      <section className="home-section pb-[40px] pt-[80px] lg:pb-[80px] lg:pt-[120px]">
        <div className="inner xxl:w-[1440px] mx-auto w-[375px] md:w-[744px] lg:hidden lg:w-[992px] xl:w-[1200px]">
          <Cartouche
            locations={locations}
            sdgs={sdg}
            className="col-span-9 mb-[40px] grid grid-cols-2 bg-white lg:hidden"
            datasources={datasources}
            methods={methods}
            scaling={scaling}
            cost={cost}
            mapFile={mapFile}
          />
        </div>
        <div className="inner xxl:px-[80px] mx-auto grid w-[375px] grid-cols-9 gap-[20px] px-[20px] md:w-[744px] lg:w-[1440px] lg:px-[80px] xl:px-[40px]">
          <div className="section-content col-span-9 lg:col-span-5">
            <div className={clsx("p-3", `bg-light-${color}`)}>
              <Disclaimer platform={base} />
            </div>
            {sections?.map((s: any, j: number) => {
              const { title, items } = s || {};
              return (
                <div key={j}>
                  {!title ? null : <h3>{title}</h3>}
                  {items.map((item: any, i: number) => {
                    const { type } = item;
                    if (type === "group") {
                      const { items: groupItemsArr, instruction } = item;
                      return groupItemsArr.map((itemsArr: any[], i: number) => {
                        return (
                          <div
                            key={i}
                            className="group mb-[40px] mt-[-1px] box-border border-[1px] border-solid p-[20px] pb-0"
                          >
                            {!instruction ? null : (
                              <p className="mb-[20px] font-space-mono text-[14px] leading-[20px]">
                                <b>{instruction}</b>
                              </p>
                            )}
                            {itemsArr.map((item: any, i: number) => {
                              return renderComponents(items, item, i, imgBase);
                            })}
                          </div>
                        );
                      });
                    } else return renderComponents(items, item, i, imgBase);
                  })}
                  {j < sections.length - 1 && (
                    <div className="divider mb-[40px] block h-0 w-full border-t-[1px] border-solid"></div>
                  )}
                </div>
              );
            })}
          </div>
          <Cartouche
            locations={locations}
            sdgs={sdg}
            className="hidden lg:col-span-3 lg:col-start-7 lg:block"
            datasources={datasources}
            methods={methods}
            scaling={scaling}
            cost={cost}
            mapFile={mapFile}
          />
          {typeof source !== "object" ? null : (
            <div className="col-span-9 text-right lg:col-span-5">
              <Button>
                <Link href={source?.source_pad_id?.toString()}>Read more</Link>
              </Button>
            </div>
          )}
        </div>

        <CommentSection
          platform={platform}
          padId={id}
          comments={comments || []}
        />
      </section>

      {/* Report Content Section */}
      <ReportContent
        id={id}
        platform={platform}
        contentType="pad"
        title={title}
      />

      {/* Feedback Section */}
      <Feedback
        id={id}
        platform={platform}
        engagement={engagement}
        current_user_engagement={current_user_engagement}
        ownername={ownername}
      />
    </>
  );
}
