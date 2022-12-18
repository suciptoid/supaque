import { PageProps, Handlers } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { User } from "https://esm.sh/v99/@supabase/gotrue-js@2.5.0/dist/module/lib/types";
import AppLayout from "../../components/AppLayout.tsx";
import CreateTask from "../../islands/CreateTask.tsx";
import QueueList, { QueueLog } from "../../islands/QueueList.tsx";
import { TaskInsert } from "../../lib/database.types.ts";
import { supabase } from "../../lib/supabase.ts";
import { AppState } from "./_middleware.ts";
import { Cron } from "https://deno.land/x/croner@5.3.4/src/croner.js";

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

      // Calculate next run
      const croner = new Cron(cron, { maxRuns: 1 });
      const nextRun = croner.next();
      if (nextRun) {
        data.next_run = nextRun.toISOString();
      } else {
        return ctx.render({
          user: ctx.state.user,
          error: "Invalid cron schedule",
        });
      }
      await supabase.from("tasks").insert(data);
    } else if (timing == "once") {
      // if task need delayed, we need to insert into task_runs
      const delay = form.get("delay")?.toString();
      if (delay) {
        // date now + delay minutes
        const nextRun = new Date(Date.now() + parseInt(delay) * 60 * 1000);
        data.next_run = nextRun.toISOString();

        // Insert delayed task, and cron will handle the rest
        const delayedTasks = await supabase.from("tasks").insert(data).select();

        if (delayedTasks.error) {
          return ctx.render({
            user: ctx.state.user,
            error: delayedTasks.error.message,
          });
        }
      } else {
        // Insert into task_runs immediately
        const delayedTasks = await supabase.from("tasks").insert(data).select();
        if (delayedTasks.error) {
          return ctx.render({
            user: ctx.state.user,
            error: delayedTasks.error.message,
          });
        }
        // insert to task_runs
        const taskRun = await supabase.from("task_runs").insert({
          task_id: delayedTasks.data[0].id,
        });
        if (taskRun.error) {
          return ctx.render({
            user: ctx.state.user,
            error: taskRun.error.message,
          });
        }
      }
    }

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
