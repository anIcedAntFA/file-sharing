import type z from 'zod';

import type { UploadFileSchema } from './file-sharing.contract';

export type UploadFile = z.infer<typeof UploadFileSchema>;
