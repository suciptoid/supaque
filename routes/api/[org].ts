import { Handlers } from "$fresh/server.ts";
import { Cron } from "https://deno.land/x/croner@5.3.4/src/croner.js";
import { TaskInsert } from "../../lib/database.types.ts";
import { supabase } from "../../lib/supabase.ts";

interface ApiPayload extends TaskInsert {
  timing?: "cron" | "once";
  delay?: number;
}

export const handler: Handlers = {
  async POST(req, ctx) {
    // get api key from header
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];
    // get api key from query param
    const url = new URL(req.url);
    const apiKey = url.searchParams.get("api_key");

    let key: null | string = null;
    if (authHeader) {
      key = authHeader;
    } else if (apiKey) {
      key = apiKey;
    } else {
      return Response.json(
        { error: "No API key provided" },
        {
          status: 401,
        }
      );
    }

    const { data: org, error } = await supabase
      .from("orgs")
      .select("*")
      .eq("id", ctx.params.org)
      .eq("api_key", key)
      .single();

    if (error) {
      return Response.json(
        { error: "Provided API key is invalid" },
        {
          status: 401,
        }
      );
    }

    // Handle form input data
    let data: ApiPayload;
    try {
      data = (await req.json()) as ApiPayload;
    } catch {
      return Response.json(
        {
          error: "Invalid JSON",
        },
        { status: 400 }
      );
    }

    // update org
    data.org_id = org.id;

    if (data.timing == "cron") {
      if (!data.cron_schedule) {
        return Response.json(
          {
            error: "Cron schedule cannot blank",
          },
          { status: 400 }
        );
      }

      // Calculate next run
      const croner = new Cron(data.cron_schedule, { maxRuns: 1 });
      const nextRun = croner.next();
      if (nextRun) {
        data.next_run = nextRun.toISOString();
      } else {
        return Response.json({
          error: "Invalid cron schedule",
        });
      }

      // Cleanup
      delete data.delay;
      delete data.timing;
      const repeatedtask = await supabase
        .from("tasks")
        .insert(data)
        .select()
        .single();

      return Response.json(repeatedtask.data);
    } else if (data.timing == "once") {
      // if task need delayed, we need to insert into task_runs
      if (data.delay) {
        // date now + delay minutes
        const nextRun = new Date(Date.now() + data.delay * 60 * 1000);
        data.next_run = nextRun.toISOString();

        // Cleanup
        delete data.delay;
        delete data.timing;
        // Insert delayed task, and cron will handle the rest
        const delayedTasks = await supabase
          .from("tasks")
          .insert(data)
          .select()
          .single();

        if (delayedTasks.error) {
          return Response.json(
            {
              error: delayedTasks.error.message,
            },
            { status: 400 }
          );
        }
        return Response.json(delayedTasks.data);
      } else {
        // Insert into task_runs immediately
        // Cleanup
        delete data.delay;
        delete data.timing;
        const delayedTasks = await supabase
          .from("tasks")
          .insert(data)
          .select()
          .single();
        if (delayedTasks.error) {
          return Response.json(
            {
              error: delayedTasks.error.message,
            },
            { status: 400 }
          );
        }
        // insert to task_runs
        const taskRun = await supabase.from("task_runs").insert({
          task_id: delayedTasks.data.id,
        });
        if (taskRun.error) {
          return Response.json(
            {
              user: ctx.state.user,
              error: taskRun.error.message,
            },
            { status: 400 }
          );
        }

        return Response.json(delayedTasks.data);
      }
    }

    return Response.json(
      { message: "Bad request!" },
      {
        status: 400,
      }
    );
  },
};
