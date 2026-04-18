export type ApiResult<T> = {
  code: number;
  message: string;
  data: T;
};

export type PostSummary = {
  id: number;
  title: string;
  summary: string;
  createdAt: string;
};

export type Post = PostSummary & {
  content: string;
  published: boolean;
};

export type LoginData = {
  token: string;
  tokenType: string;
};
