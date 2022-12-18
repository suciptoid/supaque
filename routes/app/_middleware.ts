import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { User } from "https://esm.sh/v99/@supabase/gotrue-js@2.5.0/dist/module/index";
import { Session } from "https://esm.sh/v99/@supabase/gotrue-js@2.5.0/dist/module/lib/types";
import { Org } from "../../lib/database.types.ts";
import {
  accessTokenExpired,
  getUserFromSession,
  refreshAccessToken,
  setAuthCookie,
  supabase,
} from "../../lib/supabase.ts";

export interface AppState {
  user: User;
  orgs: Pick<Org, "id" | "name" | "creator_id">[];
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<AppState>
) {
  let user = await getUserFromSession(req);
  let session: Session | null = null;

  // check if access token is expired
  if (!user && accessTokenExpired(req)) {
    const refresh = await refreshAccessToken(req);

    if (!refresh?.session) {
      console.log("unable to refresh session");
      return new Response("", {
        status: 303,
        headers: {
          Location: `/auth`,
        },
      });
    }

    if (refresh?.user) {
      user = refresh.user;
    }

    if (refresh?.session) {
      session = refresh.session;
    }
  }

  const url = new URL(req.url);

  if (!user) {
    return new Response("", {
      status: 303,
      headers: {
        Location: `/auth?next=${url.pathname}`,
      },
    });
  }
  ctx.state.user = user;

  // Fetch orgs
  const orgs = await supabase
    .from("orgs")
    .select("name,id,creator_id", {
      count: "exact",
    })
    .eq("creator_id", user.id);

  if (!orgs.error && orgs.data.length > 0) {
    ctx.state.orgs = orgs.data;
  } else if (orgs.count == 0 || orgs.count == null) {
    const created = await supabase
      .from("orgs")
      .insert({
        name: "Personal",
        creator_id: user.id,
      })
      .select("*");

    if (!created.error) {
      ctx.state.orgs = created.data;
      return new Response("", {
        status: 303,
        headers: {
          location: `/app/${created.data[0]?.id}}`,
        },
      });
    }
  }

  const next = await ctx.next();
  if (session?.access_token) {
    setAuthCookie(next, session?.refresh_token, session?.access_token);
  }
  return next;
}
