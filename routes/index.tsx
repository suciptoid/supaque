import { Head } from "$fresh/runtime.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>Supa Que - Serverless worker powered by Supabase</title>
      </Head>
      <header class="flex items-center container m-auto">
        <a href="/" class="flex items-center px-3 py-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-green-500 mr-2"
          >
            <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875z" />
            <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 001.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 001.897 1.384C6.809 12.164 9.315 12.75 12 12.75z" />
            <path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 15.914 9.315 16.5 12 16.5z" />
            <path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 19.664 9.315 20.25 12 20.25z" />
          </svg>

          <h1 class="font-semibold text-xl text-gray-800">Supa Que</h1>
        </a>
        <div class="flex-grow"></div>
        <a
          href="/app"
          class="text-green-600 border border-green-600 text-sm  font-medium rounded-md px-6 py-1.5"
        >
          Sign In
        </a>
      </header>
      <main class="container m-auto w-full min-h-screen">
        <div class="flex justify-center mt-12">
          <div class=" my-12 px-8 text-center w-1/2">
            <h1 class="text-5xl md:text-6xl font-extrabold mb-4">
              Serverless Queue Worker powered by{" "}
              <span class="bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-500">
                Supabase
              </span>
            </h1>
          </div>
        </div>
        <div className="flex justify-center">
          <a
            href="/auth"
            class="px-6 py-3 my-8 rounded-md bg-green-500 text-white"
          >
            Get Started
          </a>
        </div>
      </main>
    </>
  );
}
