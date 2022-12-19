export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      orgs: {
        Row: {
          id: string;
          name: string;
          creator_id: string;
          created_at: string | null;
          api_key: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          creator_id: string;
          created_at?: string | null;
          api_key?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          creator_id?: string;
          created_at?: string | null;
          api_key?: string | null;
        };
      };
      task_runs: {
        Row: {
          id: string;
          task_id: string | null;
          http_status: number | null;
          http_body: string | null;
          http_headers: string | null;
          created_at: string | null;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          task_id?: string | null;
          http_status?: number | null;
          http_body?: string | null;
          http_headers?: string | null;
          created_at?: string | null;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          task_id?: string | null;
          http_status?: number | null;
          http_body?: string | null;
          http_headers?: string | null;
          created_at?: string | null;
          completed_at?: string | null;
        };
      };
      tasks: {
        Row: {
          id: string;
          created_at: string | null;
          name: string | null;
          cron_schedule: string | null;
          next_run: string | null;
          http_method: string;
          http_body: string | null;
          http_url: string | null;
          max_retry: number;
          max_timeout: number;
          org_id: string;
          http_headers: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string | null;
          name?: string | null;
          cron_schedule?: string | null;
          next_run?: string | null;
          http_method?: string;
          http_body?: string | null;
          http_url?: string | null;
          max_retry?: number;
          max_timeout?: number;
          org_id: string;
          http_headers?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          name?: string | null;
          cron_schedule?: string | null;
          next_run?: string | null;
          http_method?: string;
          http_body?: string | null;
          http_url?: string | null;
          max_retry?: number;
          max_timeout?: number;
          org_id?: string;
          http_headers?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Org = Database["public"]["Tables"]["orgs"]["Row"];
export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
