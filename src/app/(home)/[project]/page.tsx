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
  const { data: tasks } = useTaskList(jobId);
  const { data: progress = [] } = useTaskProgress(jobId);

  if (!tasks) return <></>;

  return (
    <div className="max-w-[720px]">
      <h3 className="text-3xl font-bold">Missions</h3>
      <TaskList jobId={jobId} data={tasks} progress={progress} />
      <Divider className="my-10" />
      <div className="grid gap-y-7">
        <div className="flex items-center gap-x-10">
          <p className="w-[300px]">Invite more people for a higher chance of winning the draw.</p>
          <span className="underline">{userInfo?.inviteCode}</span>

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
          <p>Your current number of invited friends is</p>

          <span className="flex h-8 w-[50px] items-center justify-center rounded-full bg-[#F0F0F0]">
            {userInfo?.inviteCount}
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
    <div className="itemc flex justify-between">
      <div>
        <div className="grid gap-y-8">
          <h2 className="text-5xl font-bold leading-none">{data.name}</h2>
          <Tag tags={data.tags} />
          <p className="flex items-center gap-x-2">
            <Image className="w-4" src={ImgCalendar} alt="" />
            {formatTimeRange(data.startTime, data.endTime) + "(UTC+08:00)"}
          </p>
        </div>

        <div className="mt-[60px] w-[450px] text-xl">
          <h3 className="font-bold">Description</h3>
          <p className="mt-3">{data.description}</p>
        </div>
      </div>

      <img className="mr-5 w-80" src={data.illustration} alt="" />
    </div>
  );
}

function ProjectBox() {
  const param = useParams<{ project: string }>();

  if (!param.project) return <></>;

  return (
    <>
      <ProjectInfo jobId={param.project} />

      <div className="mt-20">
        <ProjectTask jobId={param.project} />
      </div>
    </>
  );
}

export default function Project() {
  const router = useRouter();

  return (
    <div className="mx-auto w-[1280px] rounded-2xl bg-white px-[60px]">
      <div className="inline-block cursor-pointer pt-5" onClick={() => router.back()}>
        <Image className="w-8" src={ImgBack} alt="" />
      </div>
      <div className="py-10">
        <Suspense fallback={<ProjectSkeleton />}>
          <ProjectBox />
        </Suspense>
      </div>
    </div>
  );
}
