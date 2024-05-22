"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { Suspense } from "react";
import { twMerge } from "tailwind-merge";

import Divider from "@/components/Divider";
import Tag from "@/components/Tag";
import Button from "@/components/Button";
import Clipboard from "@/components/Clipboard";
import { showSucc } from "@/components/Popover";
import Skeleton from "@/components/Skeleton";

import { TaskList } from "@/sections/Task";

import {
  ProgressType,
  AirdropType,
  useUserInfo,
  useAirdropInfo,
  useTaskList,
  useTaskInfo,
} from "@/hooks/useTaskApi";
import { useRewardInfo } from "@/hooks/useRewardApi";

import { formatTimeRange } from "@/utils/formatTime";
import { formatNumber } from "@/utils/formatNumber";

import ImgBack from "@/app/assets/back.png";
import ImgCopy from "@/app/assets/copy.png";
import ImgCalendar from "@/app/assets/calendar.png";

function ProjectSkeleton() {
  return (
    <div>
      <Skeleton className="w-1/3 text-2xl md:text-5xl" variant="text" />

      <div className="mt-8 flex items-center gap-3">
        <Skeleton className="w-12" variant="text" />
        <Skeleton className="w-20" variant="text" />
      </div>

      <Skeleton className="mt-8 w-2/5" variant="text" />

      <div className="mt-[60px]">
        <Skeleton className="mt-3 w-1/3 md:w-1/6" variant="text" />
        <Skeleton className="mt-3 w-2/3 md:w-1/2" variant="text" />
      </div>
    </div>
  );
}

function ProjectInfo(props: AirdropType) {
  const { name, tags, startTime, endTime, description, illustration } = props;

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="grid gap-y-4 md:gap-y-8">
          <h2 className="text-2xl font-bold leading-none md:text-5xl">{name}</h2>
          <Tag tags={tags} />
          <p className="flex items-center gap-x-2 text-xs md:text-base">
            <Image className="w-4" src={ImgCalendar} alt="" />
            {formatTimeRange(startTime, endTime) + "(UTC+08:00)"}
          </p>
        </div>

        <div className="mt-8 md:mt-[60px] md:w-[450px]">
          <h3 className="font-bold md:text-xl">Description</h3>
          <p className="mt-1 text-sm md:mt-3 md:text-xl">{description}</p>
        </div>
      </div>

      <img className="mr-5 hidden w-80 select-none md:block" src={illustration} alt="" />
    </div>
  );
}

function ProjectTask({
  jobId,
  progress,
  startTime,
  endTime,
}: {
  jobId: string;
  progress?: ProgressType[];
  startTime: number;
  endTime: number;
}) {
  const { data: tasks } = useTaskList(jobId);
  const { data: userInfo } = useUserInfo(jobId);

  if (!tasks) return <></>;

  const now = Date.now();

  return (
    <div className="max-w-[720px] flex-1">
      <h3 className="mb-4 text-xl font-bold md:mb-8 md:text-3xl">Missions</h3>
      <TaskList
        jobId={jobId}
        data={tasks}
        progress={progress}
        isEnd={now - startTime < 0 || now - endTime > 0}
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

function RewardLabel({ label, action }: { label: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between text-xl">
      <span>{label}</span>
      {action}
    </div>
  );
}

function RewardItem({
  className,
  value,
  action,
}: {
  className?: string;
  value: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={twMerge(
        "flex items-center justify-between rounded-[20px] bg-[#F0F0F0] px-8 py-5 text-3xl font-bold leading-none",
        className,
      )}
    >
      {value}
      {action}
    </div>
  );
}

function Progress({ percent }: { percent: number }) {
  return (
    <div className="relative h-2.5 overflow-hidden rounded-full bg-[#EDF9F9]">
      <div className="absolute h-full rounded-full bg-[#4EC3C9]" style={{ width: percent + "%" }} />
    </div>
  );
}

function ProjectReward({ jobId }: { jobId: string }) {
  const { data } = useRewardInfo(jobId);

  if (!data) return <></>;

  const token = (
    <div className="flex items-center justify-between">
      ${data.tokenName}
      <img src={data.logo} alt="" />
    </div>
  );

  return (
    <>
      <Divider className="mx-10" direction="column" />

      <div className="flex-1">
        <h3 className="mb-4 text-xl font-bold md:mb-8 md:text-3xl">Reward</h3>

        <div className="grid gap-10">
          <RewardItem value={formatNumber(data?.totalRealse)} action={token} />

          <div>
            <RewardLabel label="Release Progress" action="67%" />
            <Progress percent={67} />
          </div>

          <div>
            <RewardLabel label="You have Claimed" />
            <RewardItem value={formatNumber(data?.totalRealse)} action={token} />
          </div>

          <div>
            <RewardLabel label="You Can Claim" />
            <RewardItem
              className="bg-transparent"
              value={formatNumber(data?.balance)}
              action={token}
            />
          </div>

          <Button
            className="h-[70px] rounded-2xl text-3xl font-bold"
            colors="active"
            disabled={!data.balance}
          >
            Claim
          </Button>
        </div>
      </div>
    </>
  );
}

function ProjectBox() {
  const param = useParams<{ project: string }>();

  const { data, isLoading } = useAirdropInfo(param.project);
  const { data: taskinfo } = useTaskInfo(param.project);

  const { progress } = taskinfo ?? {};

  if (!param.project) return <></>;

  return (
    <>
      {isLoading || !data ? <ProjectSkeleton /> : <ProjectInfo {...data} />}

      <div className="mt-10 flex md:mt-20">
        <ProjectTask
          jobId={param.project}
          progress={progress}
          startTime={data?.startTime ?? 0}
          endTime={data?.endTime ?? 0}
        />
        {data && data.claimStimeTime - Date.now() < 0 && <ProjectReward jobId={param.project} />}
      </div>
    </>
  );
}

export default function Project() {
  const router = useRouter();

  return (
    <div className="mx-3 rounded-2xl bg-white px-3 md:mx-auto md:w-[1280px] md:px-[60px]">
      <div className="inline-block cursor-pointer pt-5" onClick={() => router.replace("/")}>
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
