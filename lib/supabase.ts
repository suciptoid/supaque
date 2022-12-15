import { createClient } from "$supabase";
import { getCookies } from "$std/http/cookie.ts";

export const supabase = createClient(
  Deno.env.get("SUPABASE_URL") as string,
  Deno.env.get("SUPABASE_KEY") as string
);

export const getUserFromSession = async (request: Request) => {
  const cookies = getCookies(request.headers);

  if (cookies.sup_session) {
    const token = cookies.sup_session;
    const { data } = await supabase.auth.getUser(token);
    return data.user;
  }

  return null;
};
