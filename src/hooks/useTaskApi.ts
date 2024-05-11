import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { ConnectionState, useWalletStore } from "@/sections/Wallet/hooks";
import request from "@/utils/request";

export interface AirdropType {
  jobId: string;
  name: string;
  description: string;
  startTime: number;
  endTime: number;
  claimStimeTime: number;
  coverImage: string;
  logo: string;
  illustration: string;
  tags: string[];
  state?: string;
}

export interface TaskType {
  taskId: number;
  taskType:
    | "check"
    | "connect_twitter"
    | "follow_twitter"
    | "share_twitter"
    | "join_tg_group"
    | "like_comment_twitter";
  step: number;
  content: string;
  action: string;
}

function windowOpen(url: string) {
  return window.open(url, "", "width=1080,height=700,left=200,top=200");
}

function windowListener(url: string, callback: () => Promise<any>) {
  return new Promise<boolean>((reslove, reject) => {
    const childWindow = windowOpen(url);

    const listener = async (event: MessageEvent<any>) => {
      if (event.source === childWindow) {
        childWindow?.close();
        window.removeEventListener("message", listener);

        if (event.data === "success") {
          await callback();
          reslove(true);
        }

        reject(false);
      }
    };

    window.addEventListener("message", listener);
  });
}

function progressLoop(url: string, loop: () => Promise<any>, callback: (data: any) => boolean) {
  windowOpen(url);

  return new Promise<boolean>((reslove, reject) => {
    async function check() {
      const res = await loop();

      if (callback(res)) reslove(true);

      setTimeout(() => {
        check();
      }, 3000);
    }

    check();
  });
}

export function useAirdropList() {
  return useSWR<AirdropType[]>(["/task/airdrop_list"]);
}

export function useAirdropInfo(jobId: string) {
  return useSWR<AirdropType>(["/task/airdrop_info", { body: { jobId } }]);
}

export function useUserInfo(jobId: string) {
  const { connectionState } = useWalletStore();

  return useSWR<{
    inviteCode: string;
    inviteCount: number;
  }>(["/user/info", { body: connectionState === ConnectionState.CONNECTED ? { jobId } : {} }]);
}

export function useTaskList(jobId: string) {
  return useSWR<TaskType[]>(["/task/task_list", { body: { jobId } }]);
}

export function useTaskProgress(jobId: string) {
  const { connectionState } = useWalletStore();

  return useSWR<(0 | 1 | 2)[]>([
    "/task/progress",
    { body: connectionState === ConnectionState.CONNECTED ? { jobId } : {} },
  ]);
}

export function useTaskConnectTwitter(jobId: string) {
  const { mutate } = useTaskProgress(jobId);

  return useSWRMutation<boolean, any, string>("/twitter/oauth_url", async url => {
    const res = await request<{ authUrl: string }>(url);

    if (res) return windowListener(res.authUrl, mutate);

    return res;
  });
}

export function useTaskConnectTelegram(jobId: string, step: number) {
  const { mutate } = useTaskProgress(jobId);

  return useSWRMutation<boolean, any, string>("/bot/connect_tg_bot_url", async url => {
    const res = await request<{ url: string }>(url);

    if (res) {
      return progressLoop(res.url, mutate, res => res[step] === 2);
    }

    return false;
  });
}

export function useTaskJoinTelegram(jobId: string, step: number, action: string) {
  const { mutate } = useTaskProgress(jobId);

  return () => progressLoop(action, mutate, res => res[step] === 1);
}

export function useTaskCheckWallet(jobId: string, taskId: number) {
  const { mutate } = useTaskProgress(jobId);

  return useSWRMutation<boolean, any, string>("/task/check_wallet", async url => {
    const res = await request<boolean>(url, { body: { taskId } });

    if (res) await mutate();

    return res;
  });
}

export function useTaskFollowTwitter(jobId: string, taskId: number, action: string) {
  const { mutate } = useTaskProgress(jobId);

  return useSWRMutation<boolean, any, string>("/task/follow_twitter", async url => {
    windowOpen(action);
    const res = await request<boolean>(url, { body: { taskId } });

    if (res) await mutate();

    return res;
  });
}

export function useTaskShareTwitter(jobId: string, taskId: number, action: string) {
  const { mutate } = useTaskProgress(jobId);

  return useSWRMutation<boolean, any, string>("/task/share_twitter", async url => {
    windowOpen(action);
    const res = await request<boolean>(url, { body: { taskId } });

    if (res) await mutate();

    return res;
  });
}

export function useTaskLikeCommentTwitter(jobId: string, taskId: number, action: string) {
  const { mutate } = useTaskProgress(jobId);

  return useSWRMutation<boolean, any, string>("/task/like_comment_twitter", async url => {
    windowOpen(action);
    const res = await request<boolean>(url, { body: { taskId } });

    if (res) await mutate();

    return res;
  });
}
