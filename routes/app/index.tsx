import { Handlers, PageProps } from "$fresh/server.ts";
import { User } from "https://esm.sh/v99/@supabase/gotrue-js@2.5.0/dist/module/index";
import { AppState } from "./_middleware.ts";

interface Data {
  user: User;
}

export const handler: Handlers<Data, AppState> = {
  GET(req, ctx) {
    return ctx.render({ user: ctx.state.user });
  },
};
export default function AppIndexPage({ data }: PageProps<Data>) {
  return <div>hello {data.user.email}</div>;
}
