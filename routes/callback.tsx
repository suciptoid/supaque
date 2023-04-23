import { Handlers } from "https://deno.land/x/fresh@1.1.5/server.ts";
import { setAuthCookie, supabase, supabaseSSR } from "../lib/supabase.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const res = new Response();
    const sup = supabaseSSR(req, res);
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (typeof code == "string") {
      const { data, error } = await sup.auth.exchangeCodeForSession(code);

      if (error) {
        console.log("auth error", error);
        return new Response("", {
          status: 303,
          headers: {
            Location: "/auth",
          },
        });
      }

      const session = data?.session;
      if (session?.access_token && session.refresh_token) {
        const user = await supabase.auth.getUser(session.access_token);
        if (!user.error) {
          const resp = new Response("", {
            status: 303,
            headers: {
              Location: "/app",
            },
          });

          setAuthCookie(resp, session.refresh_token, session.access_token);

          return resp;
        }
      }
    }

    return ctx.render({});
  },
};
