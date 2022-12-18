import { UnknownPageProps } from "$fresh/server.ts";

export default function NotFoundPage({ url }: UnknownPageProps) {
  return (
    <div className="flex items-center flex-col justify-center w-full min-h-screen">
      <h1 class="text-6xl py-2 font-bold">404</h1>
      <p class="text-gray-600">
        Page{" "}
        <span class="bg-gray-100 px-1 py-1 font-mono rounded">
          {url.pathname}
        </span>{" "}
        cannot be found{" "}
      </p>
      <a href="/" class="text-blue-500 text-sm font-semibold py-2">
        Go to main page
      </a>
    </div>
  );
}
