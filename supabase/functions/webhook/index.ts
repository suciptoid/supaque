// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

interface Data {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: {
    id: string;
    task_id: string;
  };
  schema: string;
}

serve(async (req) => {
  const data = (await req.json()) as Data;
  console.log("request data", data.record);

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});
