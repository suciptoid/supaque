import { Handlers, PageProps } from "$fresh/server.ts";
import { User } from "https://esm.sh/v99/@supabase/gotrue-js@2.5.0/dist/module/index";
import AppLayout from "../../components/AppLayout.tsx";
import { supabase } from "../../lib/supabase.ts";
import { AppState } from "./_middleware.ts";

interface Data {
  user: User;
}

export const handler: Handlers<Data, AppState> = {
  GET(req, ctx) {
    const user = ctx.state.user;
    const orgs = ctx.state.orgs;

    if (orgs.length > 0) {
      return new Response("", {
        status: 303,
        headers: {
          location: `/app/${orgs[0]?.id}`,
        },
      });
    }

    return ctx.render({ user: ctx.state.user as User });
  },
};
export default function AppIndexPage({ data }: PageProps<Data>) {
  return (
    <AppLayout>
      <div>redirecting</div>
    </AppLayout>
  );
}
