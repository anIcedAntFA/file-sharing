import type { z } from 'zod';

import type { APIErrorDataDTOSchema, APIErrorDataSchema } from './api.schema';

export type APIErrorDataDTO = z.infer<typeof APIErrorDataDTOSchema>;
export type APIErrorData = z.infer<typeof APIErrorDataSchema>;
