import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { User } from "https://esm.sh/v99/@supabase/gotrue-js@2.5.0/dist/module/index";
import { Org } from "../../lib/database.types.ts";
import { getUserFromSession, supabase } from "../../lib/supabase.ts";

export interface AppState {
  user: User;
  orgs: Pick<Org, "id" | "name" | "creator_id">[];
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<AppState>
) {
  const user = await getUserFromSession(req);
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
  return ctx.next();
}
