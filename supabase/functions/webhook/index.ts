// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.2.0/";
import { Database } from "./database.types.ts";
import { getFutureMatches } from "https://esm.sh/@datasert/cronjs-matcher";

export const supabase = createClient<Database>(
  Deno.env.get("SUPABASE_URL") as string,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
);

interface Data {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: {
    id: string;
    task_id: string;
  };
  schema: string;
}

type Tasks = Database["public"]["Tables"]["tasks"]["Row"];

serve(async (req) => {
  const data = (await req.json()) as Data;
  console.log("request data", data.record);

  const { data: task, error } = await supabase
    .from("task_runs")
    .select(
      "id,task_id,tasks(id,cron_schedule,next_run,http_method,http_body,http_url,max_retry,max_timeout)"
    )
    .eq("id", data.record.id)
    .single();

  if (task?.tasks) {
    const data = task.tasks as Tasks;
    if (data.http_url) {
      const init: RequestInit = {
        method: data.http_method,
        body: data.http_body,
      };
      const req = await fetch(data.http_url, init);

      const update = await supabase
        .from("task_runs")
        .update({
          completed_at: new Date().toISOString(),
          http_body: await req.text(),
          http_status: req.status,
          http_headers: JSON.stringify(req.headers),
        })
        .eq("id", task.id)
        .select("*");

      if (data.cron_schedule) {
        const next = getFutureMatches(data.cron_schedule, {
          matchCount: 0,
        });
        console.log("next cron schedule", next);
      }
      console.log("update", update);
    }
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});
