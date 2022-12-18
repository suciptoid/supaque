import { Task } from "../lib/database.types.ts";

interface Props {
  data?: Task[];
}
export default function PendingList({ data }: Props) {
  return (
    <>
      {data?.length == 0 && (
        <div className="border p-6 rounded-md text-gray-400 text-center text-sm font-medium ">
          No pending tasks
        </div>
      )}

      {data?.map((task) => (
        <div class="px-3 py-2 mb-1 border rounded-md">
          <div class="">
            <div className="flex items-center">
              <div class="method font-medium text-sm">{task.http_method}</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 px-1"
              >
                <path
                  fillRule="evenodd"
                  d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-xs text-gray-600">
                {task.next_run
                  ? new Date(task.next_run).toLocaleString()
                  : "pending"}
              </div>

              {task.cron_schedule != null ? (
                <>
                  <div class="px-1.5" title="Triggered by cron">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-3 h-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>
                  </div>
                  <div class="text-xs px-1.5 font-medium py-0 border rounded-md bg-gray-100">
                    {task.cron_schedule}
                  </div>
                </>
              ) : null}
            </div>

            <div class="url text-sm text-gray-700">{task.http_url}</div>
          </div>
        </div>
      ))}
    </>
  );
}
