import { ErrorPageProps } from "$fresh/server.ts";

export default function NotFoundPage({ url }: ErrorPageProps) {
  return (
    <div className="flex items-center flex-col justify-center w-full min-h-screen">
      <h1 class="text-6xl py-2 font-bold">500</h1>
      <p class="text-gray-600">
        500 Internal Server error, please try again later
      </p>
      <a href="/" class="text-blue-500 text-sm font-semibold py-2">
        Go to main page
      </a>
    </div>
  );
}
