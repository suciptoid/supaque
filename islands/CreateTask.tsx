import { useEffect, useState } from "preact/hooks";

export default function CreateTask() {
  const [method, setMethod] = useState("GET");
  const [timing, setTiming] = useState("cron");

  return (
    <div>
      <form class="py-1 flex flex-col gap-3" method="post">
        <fieldset class="flex flex-col">
          <label class="font-medium text-gray-800">URL</label>
          <div class="flex items-center gap-1 w-full">
            <select
              class="border px-3 py-2 rounded"
              value={method}
              onChange={(e) => setMethod((e.target as HTMLSelectElement).value)}
            >
              <option value="POST">POST</option>
              <option value="GET">GET</option>
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
          <div className="flex items-center gap-3">
            <label>
              <input
                defaultChecked={timing == "once"}
                type="radio"
                name="timing"
                value="once"
              />
              Once
            </label>
            <label>
              <input
                defaultChecked={timing == "cron"}
                type="radio"
                name="timing"
                value="cron"
              />
              Cron
            </label>
          </div>
        </fieldset>
        <fieldset class="flex flex-col">
          <label class="font-medium text-gray-800">Cron Expression</label>
          <input
            type="text"
            name="cron"
            placeholder="* * * * *"
            class="px-3 py-2 rounded border"
          />
        </fieldset>
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
