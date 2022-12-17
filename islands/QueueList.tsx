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

export default function QueueList({ data }: Props) {
  return (
    <div id="queue-lists">
      <h2 class="my-3 text-lg font-semibold text-gray-800">Queue Logs</h2>
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
          {log.http_status || "000"}
        </div>
        <div class="text-sm font-semibold text-gray-700">
          {log.tasks.http_method}
        </div>
        <div className="flex-1"></div>
        <div className="text-xs text-gray-600">
          {log.completed_at || "pending"}
        </div>
      </div>
      <div>
        <div class="text-sm text-gray-600">{log.tasks.http_url}</div>
      </div>
    </div>
  );
};
