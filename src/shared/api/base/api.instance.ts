import { ENV } from '@/shared/config/env.config';
import { createInstance } from './api.lib';

export const API_CLIENT = createInstance({
  baseURL: ENV.apiBaseURL,
  transformResponse: (response) => response.data,
});
