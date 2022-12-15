import { ComponentChildren } from "preact";

interface Props {
  children: ComponentChildren;
}
export default function AppLayout({ children }: Props) {
  return (
    <main class="w-full max-w-4xl m-auto">
      <header class="flex items-center justify-between">
        <h1 class=" py-2 text-xl font-semibold">Supa Que</h1>
        <nav>
          <a href="/app/logout" class="px-3 py-2 text-sm text-blue-500">
            Logout
          </a>
        </nav>
      </header>
      {children}
    </main>
  );
}
