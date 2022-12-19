import { User } from "https://esm.sh/v99/@supabase/gotrue-js@2.5.0/dist/module/lib/types";
import { ComponentChildren } from "preact";

interface Props {
  children: ComponentChildren;
  user?: User;
  org?: string;
}
export default function AppLayout({ children, user, org }: Props) {
  return (
    <main class="w-full max-w-4xl m-auto">
      <header class="flex items-center justify-between py-3 border-b">
        <h1 class=" py-2 text-xl font-semibold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-7 h-7 text-green-500 mr-2"
          >
            <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875z" />
            <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 001.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 001.897 1.384C6.809 12.164 9.315 12.75 12 12.75z" />
            <path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 15.914 9.315 16.5 12 16.5z" />
            <path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 19.664 9.315 20.25 12 20.25z" />
          </svg>
        </h1>
        <div class="flex-grow text-sm font-medium px-3">
          <a
            href={`/app/${org}`}
            class={`px-3 py-2 text-gray-600 rounded-md hover:bg-gray-50`}
          >
            Overview
          </a>
          <a
            href={`/app/${org}/api`}
            class={`px-3 py-2 text-gray-600 rounded-md hover:bg-gray-50`}
          >
            API
          </a>
        </div>
        <nav class="flex items-center gap-2">
          <div class="text-gray-800 font-medium text-sm">{user?.email}</div>
          <a href="/app/logout" class="px-3 py-2 text-sm text-blue-500">
            Logout
          </a>
        </nav>
      </header>
      {children}
    </main>
  );
}
