import { useEffect, useState } from "preact/hooks";

export default function CreateTask() {
  const [method, setMethod] = useState("GET");
  const [timing, setTiming] = useState("cron");

  return (
    <div class="py-2">
      <form class="py-1 flex flex-col gap-3" method="post">
        <fieldset class="flex flex-col">
          <label class="font-medium text-gray-800">URL</label>
          <div class="flex items-center gap-1 w-full">
            <select
              class="border px-3 py-2 rounded"
              value={method}
              name="method"
              onChange={(e) => setMethod((e.target as HTMLSelectElement).value)}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
            </select>
            <input
              type="text"
              name="url"
              id="url"
              placeholder="https://yourdomain.com/endpoint"
              class="border px-3 py-2 rounded flex-1"
            />
          </div>
        </fieldset>
        {method == "POST" && (
          <fieldset class="flex-col flex">
            <label>
              Body <span className="text-gray-500 text-sm">(Optional)</span>
            </label>
            <input type="text" name="body" class="border px-3 py-2" />
          </fieldset>
        )}
        <fieldset>
          <label class="font-medium text-gray-800">Timing</label>
          <div className="flex items-center border rounded-md text-sm">
            <button
              onClick={() => setTiming("once")}
              type="button"
              class={`rounded-l-md flex-1 py-2 focus:outline-none focus:ring ${
                timing == "once" ? "bg-gray-200" : ""
              }`}
            >
              Once
            </button>
            <button
              type="button"
              onClick={() => setTiming("cron")}
              class={`rounded-r-md flex-1 py-2 focus:outline-none focus:ring ${
                timing == "cron" ? "bg-gray-200" : ""
              }`}
            >
              Repeat (Cron)
            </button>
          </div>
          <input type="hidden" name="timing" value={timing} />
        </fieldset>
        {timing == "cron" && (
          <fieldset class="flex flex-col">
            <label class="font-medium text-gray-800">Cron Expression</label>
            <input
              type="text"
              name="cron"
              placeholder="* * * * *"
              class="px-3 py-2 rounded border"
            />
          </fieldset>
        )}
        {timing == "once" && (
          <fieldset class="flex flex-col">
            <label class="font-medium text-gray-800">
              Delay <span className="text-gray-500 text-sm">(Optional)</span>
            </label>
            <label>
              <input
                type="text"
                name="cron"
                placeholder="0"
                class="px-3 py-2 rounded border"
              />{" "}
              Minute
            </label>
          </fieldset>
        )}
        <fieldset>
          <button
            type="submit"
            class="px-3 py-2 text-white bg-blue-500 rounded-md"
          >
            Create Task
          </button>
        </fieldset>
      </form>
    </div>
  );
}
