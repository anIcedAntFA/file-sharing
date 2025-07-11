import type z from 'zod';

import type {
	CompleteMultipartUploadSchema,
	CreateMultipartUploadSchema,
	UploadPartSchema,
} from './upload.contract';

export type CreateMultipartUploadDTO = z.infer<
	typeof CreateMultipartUploadSchema
>;

export type UploadPartDTO = z.infer<typeof UploadPartSchema>;

export type CompleteMultipartUploadDTO = z.infer<
	typeof CompleteMultipartUploadSchema
>;
