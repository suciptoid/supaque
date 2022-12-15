import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";

export const handler: Handlers = {
  GET(req, ctx) {
    const resp = new Response("", {
      status: 303,
      headers: {
        Location: "/auth",
      },
    });
    setCookie(resp.headers, {
      name: "sup_session",
      value: "",
      path: "/",
      httpOnly: true,
      expires: new Date(0),
    });
    return resp;
  },
};
