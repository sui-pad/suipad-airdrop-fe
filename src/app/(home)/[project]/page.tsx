"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { Suspense } from "react";

import Divider from "@/components/Divider";
import Tag from "@/components/Tag";
import Clipboard from "@/components/Clipboard";
import { showSucc } from "@/components/Popover";
import Skeleton from "@/components/Skeleton";

import { TaskList } from "@/sections/Task";

import { useUserInfo, useAirdropInfo, useTaskList, useTaskProgress } from "@/hooks/useTaskApi";

import { formatTimeRange } from "@/utils/formatTime";

import ImgBack from "@/app/assets/back.png";
import ImgCopy from "@/app/assets/copy.png";
import ImgCalendar from "@/app/assets/calendar.png";

function ProjectSkeleton() {
  return (
    <div>
      <Skeleton className="text-5xl md:w-1/3" variant="text" />

      <div className="mt-8 flex items-center gap-3">
        <Skeleton className="md:w-12" variant="text" />
        <Skeleton variant="text" />
      </div>

      <Skeleton className="mt-8 md:w-2/5" variant="text" />

      <div className="mt-[60px]">
        <Skeleton className="mt-3 md:w-1/6" variant="text" />
        <Skeleton className="mt-3 md:w-1/2" variant="text" />
      </div>
    </div>
  );
}

function ProjectTask({ jobId }: { jobId: string }) {
  const { data: userInfo } = useUserInfo(jobId);
  const { data: info } = useAirdropInfo(jobId);

  const { data: tasks } = useTaskList(jobId);
  const { data: progress = [] } = useTaskProgress(jobId);

  if (!tasks) return <></>;

  const now = Date.now();

  return (
    <div className="max-w-[720px]">
      <h3 className="mb-4 text-xl font-bold md:mb-8 md:text-3xl">Missions</h3>
      <TaskList
        jobId={jobId}
        data={tasks}
        progress={progress}
        isEnd={!info || now - info.startTime < 0 || now - info.endTime > 0}
      />

      <Divider className="my-10" />

      <div className="grid gap-y-7">
        <div className="flex items-center gap-x-3 md:gap-x-10">
          <p className="text-xs md:w-[300px] md:text-base">
            Invite more people for a higher chance of winning the draw.
          </p>
          <span className="text-xs underline md:text-base">{userInfo?.inviteCode ?? "-"}</span>

          <Clipboard
            text={location.href + "?code=" + userInfo?.inviteCode}
            callback={() => {
              showSucc("Copied");
            }}
          >
            <span className="flex h-8 w-[50px] cursor-pointer select-none items-center justify-center rounded-full bg-[#4EC3C9]">
              <Image className="w-4" src={ImgCopy} alt="" />
            </span>
          </Clipboard>
        </div>
        <div className="flex items-center gap-x-10">
          <p className=" text-xs md:text-base">Your current number of invited friends is</p>

          <span className="flex h-8 w-[50px] items-center justify-center rounded-full bg-[#F0F0F0]">
            {userInfo?.inviteCount ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
}

function ProjectInfo({ jobId }: { jobId: string }) {
  const { data, isLoading } = useAirdropInfo(jobId);

  if (isLoading) return <ProjectSkeleton />;

  if (!data) return <></>;

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="grid gap-y-4 md:gap-y-8">
          <h2 className="text-2xl font-bold leading-none md:text-5xl">{data.name}</h2>
          <Tag tags={data.tags} />
          <p className="flex items-center gap-x-2 text-xs md:text-base">
            <Image className="w-4" src={ImgCalendar} alt="" />
            {formatTimeRange(data.startTime, data.endTime) + "(UTC+08:00)"}
          </p>
        </div>

        <div className="mt-8 md:mt-[60px] md:w-[450px]">
          <h3 className="font-bold md:text-xl">Description</h3>
          <p className="mt-1 text-sm md:mt-3 md:text-xl">{data.description}</p>
        </div>
      </div>

      <img className="mr-5 hidden w-80 md:block" src={data.illustration} alt="" />
    </div>
  );
}

function ProjectBox() {
  const param = useParams<{ project: string }>();

  if (!param.project) return <></>;

  return (
    <>
      <ProjectInfo jobId={param.project} />

      <div className="mt-10 md:mt-20">
        <ProjectTask jobId={param.project} />
      </div>
    </>
  );
}

export default function Project() {
  const router = useRouter();

  return (
    <div className="mx-3 rounded-2xl bg-white px-3 md:mx-auto md:w-[1280px] md:px-[60px]">
      <div className="inline-block cursor-pointer pt-5" onClick={() => router.back()}>
        <Image className="w-5 md:w-8" src={ImgBack} alt="" />
      </div>
      <div className="py-5 md:py-10">
        <Suspense fallback={<ProjectSkeleton />}>
          <ProjectBox />
        </Suspense>
      </div>
    </div>
  );
}
