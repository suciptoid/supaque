import { useEffect, useState } from "preact/hooks";

export default function CreateTask() {
  const [method, setMethod] = useState("GET");
  const [timing, setTiming] = useState("cron");

  const onSubmit = async (e: Event) => {
    // MISS remix.run action/loader :(
    // e.preventDefault();
    // const target = e.target as HTMLFormElement;
    // const form = new FormData(target);
    // const submited = await fetch(target.action, {
    //   method: target.getAttribute("method") || "GET",
    //   body: form,
    // });
    // console.log("on submit", form.get("method"), submited);
  };

  return (
    <div class="py-2">
      <form
        class="py-1 flex flex-col gap-3"
        method="post"
        onSubmitCapture={onSubmit}
      >
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
          <label class="font-medium text-gray-800 py-2">Timing</label>
          <div className="flex items-center rounded-md text-sm">
            <button
              type="button"
              onClick={() => setTiming("cron")}
              class={`rounded-l-md flex-1 py-2 focus:outline-none focus:ring border font-medium ${
                timing == "cron"
                  ? "bg-blue-400 text-white border border-blue-500 shadow-inner border-l-0"
                  : "border-gray-300"
              }`}
            >
              Repeat (Cron)
            </button>
            <button
              onClick={() => setTiming("once")}
              type="button"
              class={`rounded-r-md flex-1 py-2 focus:outline-none focus:ring border font-medium ${
                timing == "once"
                  ? "bg-blue-400 text-white border border-blue-500 shadow-inner border-l-0"
                  : "border-gray-300"
              }`}
            >
              Once
            </button>
          </div>
          <input type="hidden" name="timing" value={timing} />
        </fieldset>
        {timing == "cron" && (
          <fieldset class="flex flex-col">
            <label class="font-medium text-gray-800">
              Cron Expression{" "}
              <a
                href="https://crontab.guru/"
                target="_blank"
                class="text-blue-500 text-sm mx-1"
              >
                (need help?)
              </a>{" "}
            </label>
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
                name="delay"
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
