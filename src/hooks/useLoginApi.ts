import useSWRMutation from "swr/mutation";

import request from "@/utils/request";

export function useCheckLogin() {
  return useSWRMutation<{ walletAddress: string } | false, any, string>(
    "/user/check_login",
    (url, { arg }) => request(url, { body: arg }),
  );
}

interface LoginParams {
  addr: string;
  sign: string;
  code: string | null;
}

export function useEvmLogin() {
  return useSWRMutation<boolean, any, string, LoginParams>("/user/login", (url, { arg }) =>
    request(url, { body: arg }),
  );
}

export function useSuiLogin() {
  return useSWRMutation<boolean, any, string, LoginParams>("/user/sui_login", (url, { arg }) =>
    request(url, { body: arg }),
  );
}

export function useLogout() {
  return useSWRMutation<boolean, any, string>("/user/logout", url => request(url));
}
