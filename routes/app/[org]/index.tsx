import { PageProps, Handlers } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { User } from "https://esm.sh/v99/@supabase/gotrue-js@2.5.0/dist/module/lib/types";
import AppLayout from "../../../components/AppLayout.tsx";
import LogList, { QueueLog } from "../../../islands/LogList.tsx";
import { Task, TaskInsert } from "../../../lib/database.types.ts";
import { supabase } from "../../../lib/supabase.ts";
import { AppState } from "../_middleware.ts";
import { Cron } from "https://deno.land/x/croner@5.3.4/src/croner.js";
import PendingList from "../../../islands/PendingList.tsx";

interface Data {
  user: User;
  logs?: QueueLog[];
  pendings?: Task[];
  error?: string;
  count?: {
    logs: number;
    pending: number;
  };
}

export const handler: Handlers<Data, AppState> = {
  async GET(req, ctx) {
    const user = ctx.state.user;

    // get queue lists
    const {
      error,
      data,
      count: log_count,
    } = await supabase
      .from("task_runs")
      .select(
        `
      id,task_id,http_status,http_body,created_at,completed_at,
      tasks!inner(
        id,name,cron_schedule,next_run,http_method,http_url,org_id
        )
      `,
        { count: "exact" }
      )
      .eq("tasks.org_id", ctx.params.org)
      .order("created_at", { ascending: false })
      .limit(5);

    const pendings = await supabase
      .from("tasks")
      .select("*", { count: "exact" })
      .eq("org_id", ctx.params.org)
      .gte("next_run", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(5);

    const count = {
      logs: log_count || 0,
      pending: pendings.count || 0,
    };

    return ctx.render({
      user,
      count,
      logs: data as QueueLog[],
      pendings: pendings.data || [],
    });
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

    return new Response(null, { status: 302, headers: { Location: req.url } });
  },
};

export default function AppIndexPage({ data, params }: PageProps<Data>) {
  return (
    <>
      <Head>
        <title>Supa Que - Dashboard</title>
      </Head>
      <AppLayout user={data.user}>
        <div id="overview-card" class="grid grid-cols-2 mt-3 gap-2">
          <div class="border rounded-md px-4 py-4">
            <div class="text-4xl font-extrabold text-gray-900">
              {data.count?.pending.toLocaleString()}
            </div>

            <div class="text-gray-500 text-sm font-medium mt-2">
              Pending Tasks
            </div>
          </div>
          <div class="border rounded-md px-4 py-3">
            <div class="text-4xl font-extrabold text-gray-900">
              {data.count?.logs.toLocaleString()}
            </div>
            <div class="text-gray-500 text-sm font-medium mt-2">
              Executed Tasks
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="my-3 w-full">
            <div className="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-800">Queued Task</h2>
              <a
                href={`/app/${params.org}/create`}
                class="px-3 py-1.5 text-sm text-white bg-blue-500 rounded-md"
              >
                Create Task
              </a>
            </div>
            <p class="text-xs text-gray-600">
              Pending task and scheduled task will shown here
            </p>
          </div>
          <a
            href={`/app/${params.org}/queue`}
            class="text-sm font-medium text-blue-500 flex items-center hidden"
          >
            All Tasks
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </a>
        </div>

        <PendingList data={data.pendings || []} />

        <div className="flex items-center justify-between">
          <div class="my-3 ">
            <h2 class="text-lg font-semibold text-gray-800">Queue Logs</h2>
            <p class="text-xs text-gray-600">
              Your latest running task will be shown here
            </p>
          </div>
          <a
            href={`/app/${params.org}/logs`}
            class="text-sm font-medium text-blue-500 flex items-center hidden"
          >
            See more
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </a>
        </div>
        <LogList data={data.logs || []} />
      </AppLayout>
    </>
  );
}
