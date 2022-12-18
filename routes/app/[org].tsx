import { PageProps, Handlers } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { User } from "https://esm.sh/v99/@supabase/gotrue-js@2.5.0/dist/module/lib/types";
import AppLayout from "../../components/AppLayout.tsx";
import CreateTask from "../../islands/CreateTask.tsx";
import QueueList, { QueueLog } from "../../islands/QueueList.tsx";
import { TaskInsert } from "../../lib/database.types.ts";
import { supabase } from "../../lib/supabase.ts";
import { AppState } from "./_middleware.ts";

interface Data {
  user: User;
  logs?: QueueLog[];
  error?: string;
}

export const handler: Handlers<Data, AppState> = {
  async GET(req, ctx) {
    const user = ctx.state.user;

    // get queue lists
    const { error, data } = await supabase
      .from("task_runs")
      .select(
        `
      id,task_id,http_status,http_body,created_at,completed_at,
      tasks(id,name,cron_schedule,next_run,http_method,http_url)
      `
      )
      .eq("tasks.org_id", ctx.params.org)
      .order("created_at", { ascending: false });

    return ctx.render({ user, logs: data as QueueLog[] });
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
    <>
      <Head>
        <title>Supa Que - Dashboard</title>
      </Head>
      <AppLayout user={data.user}>
        <CreateTask />
        <QueueList data={data.logs} />
      </AppLayout>
    </>
  );
}
