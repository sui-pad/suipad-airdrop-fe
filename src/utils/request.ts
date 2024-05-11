interface ResponseType<T = any> {
  code: number | string;
  data: T;
  message: string;
}

type HandleErrorMessage = (response: ResponseType) => any;
type HandleCatchMessage = (error: Error) => any;

export interface OptionsType extends Omit<RequestInit, "body"> {
  trim?: boolean;
  body?: Record<string, any>;
  rawJson?: Record<string, any>;
  formData?: Record<string, any>;
  formUrlencoded?: Record<string, any>;
  handleErrorMessage?: HandleErrorMessage;
  handleCatchMessage?: HandleCatchMessage;
}

export function isValid<T extends any>(val: T): boolean {
  if (Array.isArray(val)) return val.length > 0;

  return val !== "" && val !== null && val !== undefined && JSON.stringify(val) !== "{}";
}

export const trimParams = (arg: Record<string, any> = {}, callback?: (value: [string, any]) => void) => {
  const params: Record<string, any> = {};

  Object.entries(arg).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params[key] = value;
      callback?.([key, value]);
    }
  });

  return params;
};

export const encodeParams = (arg: Record<string, any> = {}, trim?: boolean) => {
  const params: string[] = [];

  trimParams(arg, ([key, value]: [string, any]) => {
    params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  });

  return params.join("&");
};

export const formDataParams = (arg: Record<string, any> = {}, trim?: boolean) => {
  const formData = new FormData();

  trimParams(arg, ([key, value]: [string, any]) => {
    if (value instanceof File) {
      if (Array.isArray(value)) {
        value.forEach(v => formData.append(key, v));
      } else {
        formData.append(key, value);
      }
    } else if (value instanceof Object) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  return formData;
};

const optionInit = (
  url: string,
  params: OptionsType,
): [
    string,
    RequestInit,
    {
      handleErrorMessage: HandleErrorMessage;
      handleCatchMessage: HandleCatchMessage;
    },
  ] => {
  const defaultConfig = {
    method: "GET",
    mode: "cors",
    headers: {},
    credentials: "include",
    redirect: "follow",
    handleErrorMessage(response: any) {
      // console.log(response);
      // showError(response.info)
      // antdMessage.error(response?.message);
    },
    handleCatchMessage(error: Error) {
      // console.log(error);
    },
  };

  const {
    trim = true,
    body,
    rawJson,
    formData,
    formUrlencoded,
    handleErrorMessage,
    handleCatchMessage,
    ...other
  } = Object.assign({}, defaultConfig, params);

  const options: RequestInit = { ...other };

  if (body) url += "?" + encodeParams(body, trim);

  if (other.method === "POST") {
    if (rawJson) {
      options.headers = { "Content-Type": "application/json; charset=utf-8" };

      options.body = JSON.stringify(trim ? trimParams(rawJson) : rawJson);
    } else if (formUrlencoded) {
      options.headers = { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" };

      options.body = encodeParams(formUrlencoded, trim);
    } else if (formData) {
      options.headers = { "Content-Type": "multipart/form-data; charset=utf-8" };

      options.body = formDataParams(formData, trim);
    }
  }

  return [
    url.match(/https?:\/\//) ? url : process.env.NEXT_PUBLIC_HTTPS_URL + url,
    options || {},
    { handleErrorMessage, handleCatchMessage },
  ];
};

export default async function request<T>(url: string, options?: OptionsType) {
  const [urls, init, callback] = optionInit(url, options ?? {});

  try {
    const response = await fetch(urls, init);

    const res: ResponseType<T> = await response.json();

    if (!response.ok) {
      throw new Error(res.message);
    }

    if (res.code === 200 || res.code === "0000") {
      return res.data;
    } else if (res.code === 404) {
      return false;
    } else {
      callback.handleErrorMessage(res);
      return false;
    }
  } catch (error: any) {
    callback.handleCatchMessage(error);
    return false;
  }
}
