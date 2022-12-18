export interface QueueLog {
  id: string;
  task_id: string;
  http_status?: number;
  http_body?: string;
  created_at: string;
  completed_at?: string;
  tasks: {
    id: string;
    name: string;
    cron_schedule?: string;
    next_run?: string;
    http_method: string;
    http_url: string;
  };
}

interface Props {
  data?: QueueLog[];
}

export default function LogList({ data }: Props) {
  return (
    <div id="queue-lists">
      {data?.map((log) => (
        <QueueItem key={log.id} log={log} />
      ))}
    </div>
  );
}

interface ItemProps {
  log: QueueLog;
}

export const QueueItem = ({ log }: ItemProps) => {
  return (
    <div class="px-3 py-2 mb-1 border rounded-md">
      <div class="flex items-center gap-2">
        <div
          class={`text-xs px-2 py-1 font-medium text-white rounded-md ${
            log.http_status == 200 ? "bg-green-500" : "bg-yellow-500"
          }`}
        >
          {log.http_status || (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          )}
        </div>
        <div class="text-sm font-semibold text-gray-700">
          {log.tasks.http_method}
        </div>
        <div>
          {log.tasks.cron_schedule != null ? (
            <div
              class="p-1 border bg-gray-100 rounded-md"
              title="Triggered by cron"
            >
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
          ) : null}
        </div>
        <div className="flex-1"></div>
        <div className="text-xs text-gray-600">
          {log.completed_at
            ? new Date(log.completed_at).toLocaleString()
            : "pending"}
        </div>
      </div>
      <div>
        <div class="text-sm text-gray-600">{log.tasks.http_url}</div>
      </div>
    </div>
  );
};
