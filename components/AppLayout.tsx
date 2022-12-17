import { User } from "https://esm.sh/v99/@supabase/gotrue-js@2.5.0/dist/module/lib/types";
import { ComponentChildren } from "preact";

interface Props {
  children: ComponentChildren;
  user?: User;
}
export default function AppLayout({ children, user }: Props) {
  return (
    <main class="w-full max-w-4xl m-auto">
      <header class="flex items-center justify-between">
        <h1 class=" py-2 text-xl font-semibold">Supa Que</h1>
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