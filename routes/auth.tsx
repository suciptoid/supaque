import { Handlers, PageProps } from "$fresh/server.ts";
import {
  getUserFromSession,
  setAuthCookie,
  supabase,
} from "../lib/supabase.ts";
import { setCookie } from "$std/http/cookie.ts";
import { Head } from "$fresh/runtime.ts";

interface AuthData {
  message?: string;
  error?: string;
}

export const handler: Handlers<AuthData> = {
  async POST(req, ctx) {
    const form = await req.formData();

    const url = new URL(req.url);
    const { error } = await supabase.auth.signInWithOtp({
      email: form.get("email") as string,
      options: {
        emailRedirectTo: `${url.origin}/callback`,
      },
    });

    if (!error) {
      return ctx.render({ message: "Check your email for the login link" });
    } else {
      return ctx.render({ error: error.message });
    }
  },
  async GET(req, ctx) {
    const url = new URL(req.url);

    const access = url.searchParams.get("access_token");
    const refresh = url.searchParams.get("refresh_token");

    if (access && refresh) {
      const user = await supabase.auth.getUser(access);
      if (!user.error) {
        const resp = new Response("", {
          status: 303,
          headers: {
            Location: "/app",
          },
        });

        setAuthCookie(resp, refresh, access);

        return resp;
      }
    } else {
      const user = await getUserFromSession(req);
      if (user) {
        return new Response("", {
          status: 303,
          headers: {
            Location: "/app",
          },
        });
      }
    }
    return ctx.render({});
  },
};

export default function AuthPage({ data }: PageProps<AuthData>) {
  const { message, error } = data;
  return (
    <>
      <Head>
        <title>Supa Que - Auth</title>
      </Head>
      <div class="w-full min-h-screen flex flex-col items-center justify-center">
        <h1 class="text-lg font-bold">Login</h1>
        {message || error ? message || error : null}
        <form method="post" class="">
          <fieldset class="flex flex-col">
            <label for="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              class="border px-3 py-2 text-sm"
              placeholder="you@company.org"
            />
          </fieldset>

          <fieldset>
            <button type="submit" class="px-3 py-2 bg-gray-300 w-full my-2">
              Send me login link
            </button>
          </fieldset>
        </form>
      </div>
    </>
  );
}
