import Image from "next/image";
import { cx } from "cva";

import Button, { ButtonType } from "@/components/Button";

import {
  TaskType as ApiTaskType,
  useTaskCheckWallet,
  useTaskConnectTwitter,
  useTaskConnectTelegram,
  useTaskJoinTelegram,
  useTaskFollowTwitter,
  useTaskShareTwitter,
  useTaskLikeCommentTwitter,
} from "@/hooks/useTaskApi";

import ImgSuccess from "@/app/assets/success.png";

interface TaskBaseType {
  jobId: string;
  taskId: number;
  step: number;
  content: string;
  action: string;
  progress: -1 | 0 | 1 | 2;
}

interface TaskType {
  step: number;
  content: string;
  progress: -1 | 0 | 1 | 2;
  buttonProps: ButtonType;
}

export function TaskList(props: { jobId: string, data: ApiTaskType[], progress: (0 | 1 | 2)[], }) {
  const { jobId, data, progress } = props;

  return (
    <div className="mt-8 grid gap-y-7">
      {data.map((item, index) => {
        const { taskType, ...other } = item;

        let currentProgress: -1 | 0 | 1 | 2 = -1;

        if (progress) {
          if (index === 0 && progress.length === 0) {
            currentProgress = 0;
          } else if (progress[index]) {
            currentProgress = progress[index];
          } else if (progress[index - 1] && !progress[index]) {
            currentProgress = progress[index] ?? 0;
          }
        }

        if (taskType === "check") {
          return (
            <CheckWallet {...other} jobId={jobId} progress={currentProgress} key={other.taskId} />
          );
        }

        if (taskType === "connect_twitter") {
          return (
            <ConnectTwitter
              {...other}
              jobId={jobId}
              progress={currentProgress}
              key={other.taskId}
            />
          );
        }

        if (taskType === "follow_twitter") {
          return (
            <FollowTwitter {...other} jobId={jobId} progress={currentProgress} key={other.taskId} />
          );
        }

        if (taskType === "share_twitter") {
          return (
            <ShareTwitter {...other} jobId={jobId} progress={currentProgress} key={other.taskId} />
          );
        }

        if (taskType === "join_tg_group") {
          return (
            <JoinTelegram {...other} jobId={jobId} progress={currentProgress} key={other.taskId} />
          );
        }

        if (taskType === "like_comment_twitter") {
          return (
            <LikeCommentTweet
              {...other}
              jobId={jobId}
              progress={currentProgress}
              key={other.taskId}
            />
          );
        }

        return <></>;
      })}
    </div>
  );
}

export function CheckWallet(props: TaskBaseType) {
  const { jobId, taskId, action, ...other } = props;
  const { trigger: checkWallet } = useTaskCheckWallet(jobId, taskId);

  return <Task {...other} buttonProps={{ children: "Check Wallet", onClick: checkWallet }} />;
}

export function ConnectTwitter(props: TaskBaseType) {
  const { jobId, taskId, action, ...other } = props;
  const { trigger: connectTwitter } = useTaskConnectTwitter(jobId);

  return <Task {...other} buttonProps={{ children: "Connect", onClick: connectTwitter }} />;
}

export function FollowTwitter(props: TaskBaseType) {
  const { jobId, taskId, action, ...other } = props;
  const { trigger: followTwitter } = useTaskFollowTwitter(jobId, taskId, action);

  return <Task {...other} buttonProps={{ children: "Follow", onClick: followTwitter }} />;
}

export function ShareTwitter(props: TaskBaseType) {
  const { jobId, taskId, action, ...other } = props;
  const { trigger: shareTwitter } = useTaskShareTwitter(jobId, taskId, action);

  return <Task {...other} buttonProps={{ children: "Share", onClick: shareTwitter }} />;
}

export function JoinTelegram(props: TaskBaseType) {
  const { jobId, taskId, action, ...other } = props;
  const { trigger: connectTelegram } = useTaskConnectTelegram(jobId, other.step);
  const joinTelegram = useTaskJoinTelegram(jobId, other.step, action);

  return (
    <Task
      {...other}
      buttonProps={{
        children: other.progress === 2 ? "Join" : "Connect Telegram",
        onClick: other.progress === 2 ? joinTelegram : connectTelegram,
      }}
    />
  );
}

export function LikeCommentTweet(props: TaskBaseType) {
  const { jobId, taskId, action, ...other } = props;
  const { trigger: connectTelegram } = useTaskLikeCommentTwitter(jobId, taskId, action);

  return <Task {...other} buttonProps={{ children: "Like & Comment", onClick: connectTelegram }} />;
}

export default function Task(props: TaskType) {
  const { step, content, progress, buttonProps } = props;
  const { children, ...other } = buttonProps;

  return (
    <div className="flex items-center">
      <span className="flex h-6 w-6 select-none items-center justify-center rounded-full bg-[#6DE0E5] text-lg text-white">
        {step}
      </span>

      <p className="mx-3 flex-1">{content}</p>

      <Button
        className={cx(
          "test-base h-8 w-[200px] rounded-full",
          progress === 1 && "gap-x-2 bg-[#4ec3c9]",
        )}
        loadingClass="w-4"
        colors="secondary"
        disabled={progress === -1 || progress === 1}
        {...other}
      >
        {progress === 1 ? <Image className="w-5" src={ImgSuccess} alt="" /> : children}
      </Button>
    </div>
  );
}
