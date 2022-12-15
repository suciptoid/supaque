import { useEffect } from "preact/hooks";

export default function LoginCallback() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const param = new URLSearchParams(url.hash);
    const token = param.get("#access_token");
    if (token) {
      console.log("has access token callback", token);
      globalThis.location.replace(`/auth?access_token=${token}`);
    }
  }, []);

  return <div>Logging in...</div>;
}
