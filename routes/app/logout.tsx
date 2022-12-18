import { Handlers } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import { supabase } from "../../lib/supabase.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const resp = new Response("", {
      status: 303,
      headers: {
        Location: "/auth",
      },
    });

    const cookie = getCookies(req.headers);
    const token = cookie.token;
    await supabase.auth.admin.signOut(token);

    return resp;
  },
};
