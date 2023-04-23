import { createClient } from "$supabase";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import { Database } from "./database.types.ts";
import {
  decode,
  encode,
} from "https://deno.land/std@0.165.0/encoding/base64.ts";

export const supabase = createClient<Database>(
  Deno.env.get("SUPABASE_URL") as string,
  Deno.env.get("SUPABASE_KEY") as string
);
export const supabaseSSR = (req: Request, res: Response) =>
  createClient<Database>(
    Deno.env.get("SUPABASE_URL") as string,
    Deno.env.get("SUPABASE_KEY") as string,
    {
      auth: {
        flowType: "pkce",
        storage: {
          setItem: (key, value) => {
            const val = encode(value.replaceAll('"', "")); //value.replaceAll('"', "");
            console.log("set items", { key, value: val });
            setCookie(res.headers, {
              name: key,
              value: val,
              sameSite: "Lax",
              path: "/",
            });
          },
          getItem: (key) => {
            const cok = getCookies(req.headers);
            const val = cok[key];
            if (!val) {
              return null;
            }
            const decoded = decode(val);
            const decodedStr = new TextDecoder("utf-8").decode(decoded);
            console.log("getitem", {
              decodedStr,
            });
            return decodedStr;
          },
          removeItem: (key) => {
            console.log("remove item", { key });
          },
        },
      },
    }
  );

export const getUserFromSession = async (request: Request) => {
  const cookies = getCookies(request.headers);

  const access = cookies.token;

  if (access) {
    const { data } = await supabase.auth.getUser(access);
    return data.user;
  }

  return null;
};

export const accessTokenExpired = (request: Request) => {
  const cookies = getCookies(request.headers);
  const token = cookies.token;
  if (!token) return true;
  const jwt = token.split(".")[1];
  const decoded = JSON.parse(atob(jwt));
  const exp = decoded.exp;
  const now = new Date().getTime() / 1000;
  return exp < now;
};

export const refreshAccessToken = async (request: Request) => {
  const cookies = getCookies(request.headers);

  const refresh = cookies.refresh;

  if (refresh) {
    const { data } = await supabase.auth.refreshSession({
      refresh_token: refresh,
    });
    return data;
  }

  return null;
};

export const setAuthCookie = (
  response: Response,
  refresh: string,
  access: string
) => {
  const expires = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);
  setCookie(response.headers, {
    name: "token",
    value: access,
    path: "/",
    httpOnly: true,
    expires,
  });
  setCookie(response.headers, {
    name: "refresh",
    value: refresh,
    path: "/",
    httpOnly: true,
    expires,
  });
};
