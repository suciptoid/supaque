import { PageProps, Handlers } from "$fresh/server.ts";
import { User } from "https://esm.sh/v99/@supabase/gotrue-js@2.5.0/dist/module/lib/types";
import AppLayout from "../../components/AppLayout.tsx";
import CreateTask from "../../islands/CreateTask.tsx";
import { AppState } from "./_middleware.ts";

interface Data {
  user: User;
}

export const handler: Handlers<Data, AppState> = {
  GET(req, ctx) {
    const user = ctx.state.user;

    return ctx.render({ user });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    console.log("post form", Object.fromEntries(form));
    return ctx.render({ user: ctx.state.user });
  },
};
export default function AppIndexPage({ data }: PageProps<Data>) {
  return (
    <AppLayout user={data.user}>
      <CreateTask />
    </AppLayout>
  );
}
