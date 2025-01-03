"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";

import { cx } from "cva";
import { twMerge } from "tailwind-merge";

import Divider from "@/components/Divider";
import Tag from "@/components/Tag";
import Social from "@/components/Social";
import Button from "@/components/Button";
import Clipboard from "@/components/Clipboard";
import { showError, showSucc } from "@/components/Popover";
import Skeleton from "@/components/Skeleton";

import Header from "@/sections/Header";
import Wallet from "@/sections/Wallet";
import { TaskList } from "@/sections/Task";

import useDevice from "@/hooks/useDevice";
import {
  ProgressType,
  AirdropInfoType,
  TaskType,
  UserInfoType,
  useUserInfo,
  useAirdropInfo,
  useTaskList,
  useTaskInfo,
} from "@/hooks/useTaskApi";
import { useRewardInfo } from "@/hooks/useRewardApi";
import { windowOpen } from "@/hooks/useTaskApi";

import { formatTimeRange } from "@/utils/formatTime";
import { formatNumber } from "@/utils/formatNumber";

import ImgBack from "@/app/assets/back.png";
import ImgCalendar from "@/app/assets/calendar.png";

import { useClaimState, useClaimReward } from "./hooks";

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

function ProjectInfo(props: AirdropInfoType) {
  const { name, social, tags, startTime, endTime, description, illustration } = props;

  return (
    <div className="items-center justify-between md:flex">
      <div>
        <div className="grid gap-y-4 md:gap-y-6">
          <h2 className="text-2xl font-bold leading-none md:text-5xl">{name}</h2>
          <Social urls={social} />
          <Tag tags={tags} />
          <p className="flex items-center gap-x-2 text-xs md:text-base">
            <Image className="w-4" src={ImgCalendar} alt="" />
            {formatTimeRange(startTime, endTime) + "(UTC)"}
          </p>
        </div>

        <div className="mt-8 md:mt-[60px]">
          <h3 className="font-bold md:text-xl">Description</h3>
          <div
            className="mt-1 text-sm md:mt-3 md:text-base"
            dangerouslySetInnerHTML={{ __html: description }}
          />
          {/* <p class="mb-4">Complete all the tasks to snag a share of the 200,000 $SUIP Reward Pool.</p>
            <p class="mb-2">🎁 Win 600 $SUIP per draw.</p>
            <p>🍀 Lucky Draw Qualifications:</p>
            <p>1. Complete all tasks to get a lucky draw chance.</p>
            <p class="mb-4">2. Every time you invite 10 friends, get an extra lucky draw opportunity!</p>
            <p>* There's no upper limit on the number of draws until all the prizes are won!</p> */}
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:gap-8">
        {/* <div className="mt-8 md:mt-[60px] md:w-[250px]">
          <h3 className="font-bold md:text-xl">Total Amount of Airdrop</h3>
          <h2 className="mt-3 text-xl font-bold md:mt-6 md:text-3xl">{totalReward}</h2>
          <p className="mt-4 text-xs md:mt-8 md:text-base">
            Rewards will be distributed after the event time is over.
          </p>
        </div> */}

        <img className="hidden select-none md:block md:w-80" src={illustration} alt="" />
      </div>
    </div>
  );
}

interface ProjectTaskType {
  jobId: string;
  taskList: TaskType[];
  airdropInfo: AirdropInfoType;
  userInfo?: UserInfoType;
  progress?: ProgressType[];
}

function ProjectTask({ jobId, taskList, airdropInfo, userInfo, progress }: ProjectTaskType) {
  if (!taskList) return <></>;

  return (
    <div className="flex-1">
      <h3 className="mb-4 text-xl font-bold md:mb-8 md:text-3xl">Missions</h3>
      <TaskList
        jobId={jobId}
        data={taskList}
        progress={progress}
        isEnd={Date.now() - airdropInfo.startTime < 0 || Date.now() - airdropInfo.endTime > 0}
      />

      <Divider className="my-6 md:my-10" />

      <div className="grid gap-y-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <p className="flex-1 text-xs md:text-[15px]">
            Invite more people and get more lottery chances. <br />
            Copy your exclusive invitation link.
          </p>
          {/* <span className="text-xs underline md:text-base">{userInfo?.inviteCode ?? "-"}</span> */}

          <div className="grid grid-cols-2 justify-items-center gap-3 md:grid-cols-1">
            <Clipboard
              className={cx(!userInfo && "pointer-events-none")}
              text={location.href + "?code=" + userInfo?.inviteCode}
              callback={() => {
                showSucc("Copied");
              }}
            >
              <Button
                className="h-8 w-[140px] rounded-full text-xs md:w-[200px] md:text-base"
                loadingClass="w-4"
                colors="active"
                disabled={!userInfo}
              >
                Copy Invitation Link
              </Button>
            </Clipboard>
            <Button
              className="h-8 w-[140px] rounded-full text-xs md:w-[200px] md:text-base"
              loadingClass="w-4"
              colors="active"
              disabled={!userInfo}
              onClick={() =>
                windowOpen(
                  airdropInfo.twitterInviteContent.replace(
                    "$invite_url$",
                    location.href + "?code=" + userInfo?.inviteCode,
                  ),
                )
              }
            >
              Share On X
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="flex-1 text-xs md:text-[15px]">Your current number of invited friends is</p>

          <div className="md:w-[200px]">
            <span className="flex h-8 w-20 items-center justify-center rounded-full bg-[#F0F0F0]">
              {userInfo?.inviteCount ?? 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RewardLabel({ label, action }: { label: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-1 flex items-center justify-between text-[15px] md:mb-4 md:text-xl">
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
  value: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={twMerge(
        "flex items-center justify-between rounded-xl bg-[#F0F0F0] px-4 py-3 text-xl font-bold leading-none md:rounded-[20px] md:px-8 md:py-5 md:text-3xl",
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

interface ProjectRewardType {
  jobId: string;
  airdropInfo: AirdropInfoType;
  userInfo?: UserInfoType;
  drawChances?: number;
}

function ProjectReward({ jobId, airdropInfo, drawChances }: ProjectRewardType) {
  const [claimed, setClaimed] = useState<string>();

  const getClaimState = useClaimState();
  const claim = useClaimReward();
  const { data } = useRewardInfo(jobId);

  const handleClaimState = async () => {
    const state = await getClaimState();
    setClaimed(state);
  };

  const handleClaim = async () => {
    const res = await claim();

    if (res) {
      handleClaimState();
      showSucc("Claim successful");
    } else {
      showError("Claim failed");
    }
  };

  useEffect(() => {
    handleClaimState();
  }, [data]);

  const token = (
    <div className="flex items-center gap-1">
      ${airdropInfo.rewardTokenName}
      <img className="w-6 md:w-[30px]" src={airdropInfo.rewardTokenLogo} alt="" />
    </div>
  );

  return (
    <div className="flex-1">
      <h3 className="mb-4 text-xl font-bold md:mb-8 md:text-3xl">Reward</h3>

      <div className="grid gap-5 md:gap-10">
        <div>
          <RewardLabel label="Total Amount of Airdrop" />
          <RewardItem value={airdropInfo.totalReward} action={token} />
          <p className="mt-1 text-xs text-gray-500 md:mt-2 md:text-sm">
            Rewards will be distributed after the event time is over.
          </p>
        </div>
        <div>
          <RewardLabel label="Earn Draw Chances" />
          <RewardItem value={drawChances ?? "-"} />
          <p className="mt-1 text-xs text-gray-500 md:mt-2 md:text-sm">
            Complete the display task, and you will receive one raffle entry. <br />
            Additionally, you can invite friends to participate in the task to earn extra raffle
            entries.
          </p>
        </div>
        <div>
          <RewardLabel label="Earn rewards" />
          <RewardItem value={formatNumber(data?.balance)} action={token} />
        </div>
        {/* 
          <RewardItem value={formatNumber(data?.totalRealse)} action={token} />

          <div>
            <RewardLabel label="Release Progress" action="67%" />
            <Progress percent={67} />
          </div>

          <div>
            <RewardLabel label="You Can Claim" />
            <RewardItem
              className="bg-transparent"
              value={formatNumber(data?.balance)}
              action={token}
            />
          </div> */}

        <Button
          className="h-11 rounded-xl text-xl font-bold md:h-[70px] md:rounded-[20px] md:text-3xl"
          colors="active"
          disabled={
            Date.now() - airdropInfo.claimStimeTime < 0 ||
            Number(data?.balance) === Number(claimed) ||
            !Number(data?.balance)
          }
          onClick={handleClaim}
        >
          {data
            ? Date.now() - airdropInfo.claimStimeTime > 0 && !Number(data.balance)
              ? "Non winner"
              : Number(data.balance) === Number(claimed)
                ? "Claimed"
                : "Claim"
            : "Claim"}
        </Button>
      </div>
    </div>
  );
}

function ProjectBox() {
  const router = useRouter();
  const param = useParams<{ project: string }>();
  const isMobile = useDevice();

  const { data, isLoading } = useAirdropInfo(param.project);
  const { data: taskList } = useTaskList(param.project);

  const { data: userInfo } = useUserInfo(param.project);
  const { data: taskinfo } = useTaskInfo(param.project);

  const { progress, drawChances } = taskinfo ?? {};

  if (!param.project) return <></>;

  return (
    <>
      <Header wallet={data && <Wallet chain={data.chain} />} />

      <div className="pb-10 pt-[100px] md:pb-[120px] md:pt-[166px]">
        <div className="mx-3 rounded-2xl bg-white px-3 md:mx-auto md:w-[1280px] md:px-[60px]">
          <div className="inline-block cursor-pointer pt-5" onClick={() => router.replace("/")}>
            <Image className="w-5 md:w-8" src={ImgBack} alt="" />
          </div>
          <div className="py-5 md:py-10">
            {isLoading || !data ? <ProjectSkeleton /> : <ProjectInfo {...data} />}

            {data && taskList && (
              <div className="mt-10 md:mt-20 md:flex">
                <ProjectTask
                  jobId={param.project}
                  airdropInfo={data}
                  userInfo={userInfo}
                  taskList={taskList}
                  progress={progress}
                />

                <Divider className="my-5 md:mx-10" direction={isMobile ? "row" : "column"} />

                <ProjectReward
                  jobId={param.project}
                  airdropInfo={data}
                  userInfo={userInfo}
                  drawChances={drawChances}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function Project() {
  return (
    <Suspense>
      <ProjectBox />
    </Suspense>
  );
}
