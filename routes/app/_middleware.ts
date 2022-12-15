import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { User } from "https://esm.sh/v99/@supabase/gotrue-js@2.5.0/dist/module/index";
import { getUserFromSession } from "../../lib/supabase.ts";

export interface AppState {
  user: User;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<AppState>
) {
  // do something
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

  return ctx.next();
}
