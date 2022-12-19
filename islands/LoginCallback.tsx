import { useEffect, useState } from "preact/hooks";

export default function LoginCallback() {
  const [message, setMessage] = useState("Logging in...");
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    const url = new URL(window.location.href);
    const param = new URLSearchParams(url.hash);

    const token = param.get("#access_token");
    param.delete("#access_token");
    if (token) {
      param.set("access_token", token);
      globalThis.location.replace(`/auth?${param.toString()}`);
    } else if (param.get("error_code")) {
      setMessage(param.get("error_description") || "Unable to login");
      setIsError(true);
    }
  }, []);

  return (
    <div className="flex items-center flex-col justify-center w-full min-h-screen">
      {isError && <h1 class="text-6xl py-2 font-bold">Oops!</h1>}
      <p class="text-gray-600">{message}</p>

      {isError && (
        <a href="/auth" class="text-blue-500 text-sm font-semibold py-2">
          Go to login page
        </a>
      )}
    </div>
  );
}
