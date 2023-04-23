import { PageProps, Handlers } from "$fresh/server.ts";
import { User } from "https://esm.sh/v116/@supabase/gotrue-js@2.23.0/dist/module/index.js";
import AppLayout from "../../../components/AppLayout.tsx";
import { Org } from "../../../lib/database.types.ts";
import { supabase } from "../../../lib/supabase.ts";
import { AppState } from "../_middleware.ts";

interface PageData {
  user?: User;
  org?: Org;
  origin?: string;
}

const sample = (org: string, key: string, host = "http://localhost:8000") => `
curl --request POST \\
  --url ${host}/api/${org} \\
  --header 'Authorization: Bearer ${key}' \\
  --header 'Content-Type: application/json' \\
  --data '{
	"http_url":"https://httpbin.org/post?id=xyzabc",
	"http_method": "POST",
	"timing": "cron",
	"cron_schedule": "*/10 * * * *"
}'
`;

export const handler: Handlers<PageData, AppState> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const org = await supabase
      .from("orgs")
      .select("*")
      .eq("id", ctx.params.org)
      .single();
    return ctx.render({
      user: ctx.state.user,
      org: org.data as Org,
      origin: url.origin || "http://localhost:8000",
    });
  },
  async POST(req, ctx) {
    const data = await req.formData();
    const url = new URL(req.url);
    const host = url.origin || "http://localhost:8000";
    if (data.get("generate")) {
      // random unique key based on UUID crypto
      const key = crypto.randomUUID().replaceAll("-", "");
      const { data, error } = await supabase
        .from("orgs")
        .update({ api_key: key })
        .eq("id", ctx.params.org)
        .select()
        .single();

      if (error) {
        return ctx.render({ user: ctx.state.user, origin });
      } else {
        return ctx.render({ user: ctx.state.user, org: data, origin });
      }
    }

    const org = await supabase
      .from("orgs")
      .select("*")
      .eq("id", ctx.params.org)
      .single();

    return ctx.render({
      user: ctx.state.user,
      org: org.data as Org,
      origin,
    });
  },
};

export default function ApiPage({ data, params }: PageProps<PageData>) {
  return (
    <AppLayout user={data.user} org={params.org}>
      <form method="post" class="my-3">
        <fieldset class="flex flex-col gap-2">
          <label class="text-gray-700 text-sm font-medium">API Key</label>
          <div className="flex items-center gap-1">
            <input
              type="text"
              readOnly
              value={data.org?.api_key || ""}
              placeholder="Generate api key"
              class="text-sm border rounded-md px-3 py-2 flex-1 text-gray-600"
            />

            <button
              type="submit"
              name="generate"
              value={data.org?.api_key ? "regenerate" : "generate"}
              class="px-3 py-2 text-sm bg-blue-500 text-white rounded-md"
            >
              {data.org?.api_key ? "Regenerate" : "Create"} Api Key
            </button>
          </div>
        </fieldset>
      </form>
      <h2 class="text-lg font-bold text-gray-700">Usage Example</h2>
      <div>
        <pre class="bg-gray-100 p-3 rounded-md whitespace-pre-wrap text-sm font-mono">
          {sample(
            params.org,
            data.org?.api_key || "xyzssssssssssssssssss",
            data.origin
          )}
        </pre>
      </div>
    </AppLayout>
  );
}
