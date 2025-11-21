export interface ReactionCounts {
  up: number;
  down: number;
}

export interface ReplyInfo {
  id: string;
  username: string;
  text: string;
}

export interface Message {
  id: string;
  username: string;
  text: string;
  created_at: string;
  reply_to: ReplyInfo | null;
  reactions: ReactionCounts;
}

export interface SupabaseCredentials {
  url: string;
  key: string;
}
