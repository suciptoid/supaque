import { PageProps, Handlers } from "$fresh/server.ts";
import { User } from "https://esm.sh/v99/@supabase/gotrue-js@2.5.0/dist/module/lib/types";
import AppLayout from "../../components/AppLayout.tsx";
import CreateTask from "../../islands/CreateTask.tsx";
import { TaskInsert } from "../../lib/database.types.ts";
import { supabase } from "../../lib/supabase.ts";
import { AppState } from "./_middleware.ts";

interface Data {
  user: User;
  error?: string;
}

export const handler: Handlers<Data, AppState> = {
  GET(req, ctx) {
    const user = ctx.state.user;

    return ctx.render({ user });
  },
  async POST(req, ctx) {
    const form = await req.formData();

    const data = {
      org_id: ctx.params.org,
      http_url: form.get("url"),
      http_method: form.get("method"),
      http_body: form.get("body"),
    } as TaskInsert;

    const timing = form.get("timing");

    if (timing == "cron") {
      const cron = form.get("cron")?.toString();
      if (!cron) {
        return ctx.render({
          user: ctx.state.user,
          error: "Cron schedule cannot blank",
        });
      }
      data.cron_schedule = cron;
    } else if (timing == "once") {
      // TODO: handle delay
    }

    await supabase.from("tasks").insert(data);
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
