export type GoogleSSOObject = {
  accessToken: string;
  refreshToken: string;
  photos?: { ['value']: string }[];
  email: string;
  name: string;
  provider: AuthProvider;
  providerId: string;
};

export enum AuthProvider {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  GITHUB = 'github',
}

export type SQLQueryOptions = {
  relations?: string[];
};

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginationResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};
