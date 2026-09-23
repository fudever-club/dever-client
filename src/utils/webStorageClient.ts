import _ from "lodash";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import Cookies from "js-cookie";

import { constants } from "@/settings";

const COOKIE_DEFAULT_OPTIONS = {
  path: "/",
  maxAge: 30 * 24 * 60 * 60, // 30 days
  sameSite: "lax" as const,
};

const webStorageClient = {
  set(key: string, rawValue: any, option?: any) {
    const value = _.isString(rawValue) ? rawValue : JSON?.stringify(rawValue);
    setCookie(key, value, { ...COOKIE_DEFAULT_OPTIONS, ...option });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(key, value);
      } catch {}
    }
  },

  get(key: string) {
    let value: string = (getCookie(key, { path: "/" }) as string) || "";
    if (!value && typeof window !== "undefined") {
      try {
        value = localStorage.getItem(key) || "";
      } catch {}
    }
    try {
      return JSON?.parse(value);
    } catch {
      return value;
    }
  },

  remove(key: string) {
    deleteCookie(key, { path: "/" });
    Cookies.remove(key, { path: "/" });
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(key);
      } catch {}
    }
  },

  removeAll() {
    // Session cleanup must not erase unsent drafts or locale preferences.
    [constants.ACCESS_TOKEN, constants.REFRESH_TOKEN, constants.USER_INFO,
      constants.AVT, constants.MAIL, constants.FN, constants.LN,
      constants.IS_AUTH, constants.NICK_NANE, constants.SUB_ACCOUNT_ID,
      constants.SUB_ACCOUNT_INFO].forEach((key) => this.remove(key));
  },

  setToken(value: string, option?: any) {
    this.set(constants.ACCESS_TOKEN, value, option);
  },

  getToken() {
    return this.get(constants.ACCESS_TOKEN);
  },
};

export default webStorageClient;
