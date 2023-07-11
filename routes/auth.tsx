import { Handlers, PageProps } from "$fresh/server.ts";
import {
  getUserFromSession,
  setAuthCookie,
  supabase,
  supabaseSSR,
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
    const res = new Response();
    const sup = supabaseSSR(req, res);

    if (form.get("oauth") == "google") {
      const google = await sup.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${url.origin}/callback`,
        },
      });
      if (!google.error) {
        const headers = res.headers;
        headers.append("Location", google.data.url);
        return new Response("", {
          status: 303,
          headers,
        });
      } else {
        return ctx.render({ error: google.error.message });
      }
    }
    const { error } = await sup.auth.signInWithOtp({
      email: form.get("email") as string,
      options: {
        emailRedirectTo: `${url.origin}/callback`,
      },
    });

    if (!error) {
      const rendered = await ctx.render({
        message: "Check your email for the login link",
      });
      return new Response(rendered.body, {
        headers: res.headers,
      });
    } else {
      return ctx.render({ error: error.message });
    }
  },
  async GET(req, ctx) {
    const url = new URL(req.url);

    const user = await getUserFromSession(req);
    if (user) {
      return new Response("", {
        status: 303,
        headers: {
          Location: "/app",
        },
      });
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
        <div
          id="login-container"
          className="max-w-lg px-5 pt-4 pb-3 w-full bg-gray-100 shadow-sm rounded"
        >
          <h1 class="text-lg font-bold">Login to Supa Que</h1>
          {message || error ? message || error : null}
          <form method="post" class="">
            <fieldset class="flex flex-col">
              <label for="email" class="py-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                class="border px-3 py-2 text-sm"
                placeholder="you@company.org"
              />
            </fieldset>

            <fieldset>
              <button
                type="submit"
                class="px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded w-full my-2"
              >
                Send me login link
              </button>
            </fieldset>

            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-scale-700"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 text-sm bg-gray-100 text-scale-1200 px-3">
                  or
                </span>
              </div>
            </div>

            <button
              type="submit"
              name="oauth"
              value="google"
              class="px-3 py-2 bg-red-500 text-white text-sm font-medium rounded w-full my-2"
            >
              Login with Google
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
