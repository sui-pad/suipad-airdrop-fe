"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useMemo, useState } from "react";

import { twMerge } from "tailwind-merge";

import Tag from "@/components/Tag";
import Button from "@/components/Button";
import Skeleton from "@/components/Skeleton";

import { AirdropType, useAirdropList } from "@/hooks/useTaskApi";

import ImgNull from "@/app/assets/null.png";

function AirdropSkeleton() {
  return (
    <div className="grid gap-x-[30px] md:grid-cols-3">
      <div className="h-[420px] rounded-xl border border-[#DCDADA]">
        <Skeleton className="h-[154px] rounded-xl md:w-full" />
        <div className="px-4">
          <div className="flex items-end justify-between">
            <div className="relative z-10 -mt-10 h-20 w-20 rounded-lg bg-white p-1">
              <Skeleton className="rounded-lg md:h-full md:w-full" />
            </div>

            <div className="flex items-center gap-3">
              <Skeleton className="md:w-12" variant="text" />
              <Skeleton variant="text" />
            </div>
          </div>

          <Skeleton className="mt-7 text-3xl md:w-1/3" variant="text" />
          <Skeleton className="mt-4 md:w-2/3" variant="text" />

          <Skeleton className="mx-auto mt-12 h-10 md:w-2/3" />
        </div>
      </div>
      <div className="h-[420px] rounded-xl border border-[#DCDADA]">
        <Skeleton className="h-[154px] rounded-xl md:w-full" />
        <div className="px-4">
          <div className="flex items-end justify-between">
            <div className="relative z-10 -mt-10 h-20 w-20 rounded-lg bg-white p-1">
              <Skeleton className="rounded-lg md:h-full md:w-full" />
            </div>

            <div className="flex items-center gap-3">
              <Skeleton className="md:w-12" variant="text" />
              <Skeleton variant="text" />
            </div>
          </div>

          <Skeleton className="mt-7 text-3xl md:w-1/3" variant="text" />
          <Skeleton className="mt-4 md:w-2/3" variant="text" />

          <Skeleton className="mx-auto mt-12 h-10 md:w-2/3" />
        </div>
      </div>
      <div className="h-[420px] rounded-xl border border-[#DCDADA]">
        <Skeleton className="h-[154px] rounded-xl md:w-full" />
        <div className="px-4">
          <div className="flex items-end justify-between">
            <div className="relative z-10 -mt-10 h-20 w-20 rounded-lg bg-white p-1">
              <Skeleton className="rounded-lg md:h-full md:w-full" />
            </div>

            <div className="flex items-center gap-3">
              <Skeleton className="md:w-12" variant="text" />
              <Skeleton variant="text" />
            </div>
          </div>

          <Skeleton className="mt-7 text-3xl md:w-1/3" variant="text" />
          <Skeleton className="mt-4 md:w-2/3" variant="text" />

          <Skeleton className="mx-auto mt-12 h-10 md:w-2/3" />
        </div>
      </div>
    </div>
  );
}

function AirdropBox(props: AirdropType) {
  const router = useRouter();
  const { jobId, state, coverImage, logo, name, description, tags } = props;

  return (
    <div className="h-[420px] overflow-hidden rounded-xl border border-[#DCDADA] shadow-[0px_5px_16px_0px_rgba(0,0,0,0.08)]">
      <div className="relative">
        <img src={coverImage} alt="" />

        <span className="absolute right-4 top-4 flex h-6 w-[100px] items-center justify-center rounded-full bg-[#6DE0E5] text-sm">
          {state}
        </span>
      </div>

      <div className="px-4">
        <div className="flex items-end justify-between">
          <div className="relative z-10 -mt-10 h-20 w-20 overflow-hidden rounded-lg bg-white p-0.5">
            <img src={logo} alt="" />
          </div>

          <Tag tags={tags} />
        </div>

        <h2 className="mt-7 text-3xl font-bold leading-none">{name}</h2>
        <p className="mt-4 h-12 text-[#5F5F5F]">{description}</p>

        <Button
          className="mx-auto mt-8 h-10 w-64 text-2xl font-bold"
          colors="active"
          onClick={() => router.push("/" + jobId)}
        >
          SEE DETAILS
        </Button>
      </div>
    </div>
  );
}

function AirdropList({ records }: { records: AirdropType[] }) {
  if (!records.length)
    return (
      <div className="flex h-[420px] items-center justify-center">
        <Image className="w-1/3 md:w-40" src={ImgNull} alt="nodata" />
      </div>
    );

  return (
    <div className="grid gap-[10px] md:gap-[30px] md:grid-cols-3">
      {records.map(item => (
        <AirdropBox {...item} key={item.jobId} />
      ))}
    </div>
  );
}

enum TabEnums {
  ALL = "All",
  ACTIVE = "Active",
  UPCOMING = "Upcoming",
  CLOSED = "Closed",
}

export default function Home() {
  const [tab, setTab] = useState<TabEnums>(TabEnums.ALL);
  const { data, isLoading } = useAirdropList();

  const records = useMemo(() => {
    if (!data) return [];

    return data
      .map(item => {
        const now = Date.now();

        const state =
          now - item.startTime < 0
            ? TabEnums.UPCOMING
            : now - item.endTime > 0
              ? TabEnums.CLOSED
              : TabEnums.ACTIVE;

        return { ...item, state };
      })
      .filter(item => tab === TabEnums.ALL || tab === item.state);
  }, [tab, data]);

  return (
    <div className="mx-3 rounded-2xl bg-white p-3 md:mx-auto md:w-[1280px] md:p-10">
      <div className="h-[120px] overflow-hidden rounded-xl md:h-[328px]">
        <video
          className="h-full w-full object-cover"
          src="https://suipadstatic.s3.ap-southeast-1.amazonaws.com/airdrop/odyssey.mp4"
          muted
          loop
          autoPlay
        />
      </div>

      <div className="my-5 flex items-center justify-between border-b border-b-[#EAEAEA] pb-3 font-bold leading-none text-[#7D7D7D] md:my-10 md:justify-center md:gap-x-20 md:text-xl">
        {Object.values(TabEnums).map(item => (
          <>
            <span
              className={twMerge("relative cursor-pointer", item === tab && "text-black")}
              onClick={() => setTab(item)}
              key={item}
            >
              {item}
              {item === tab && (
                <span className="absolute left-0 top-full mt-[9px] h-[3px] w-full bg-[#4EC3C9]" />
              )}
            </span>
          </>
        ))}
      </div>

      {isLoading ? <AirdropSkeleton /> : <AirdropList records={records ? records : []} />}
    </div>
  );
}
