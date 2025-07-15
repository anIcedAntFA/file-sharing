import type z from 'zod';

import type {
	CompleteMultipartUploadSchema,
	CreateMultipartUploadResSchema,
	CreateMultipartUploadSchema,
	UploadChunkSchema,
	UploadPartResSchema,
	UploadPartSchema,
} from './upload.contract';

export type CreateMultipartUploadDTO = z.infer<
	typeof CreateMultipartUploadSchema
>;

export type CreateMultipartUploadRes = z.infer<
	typeof CreateMultipartUploadResSchema
>;

export type UploadPartDTO = z.infer<typeof UploadPartSchema>;

export type UploadPartRes = z.infer<typeof UploadPartResSchema>;

export type CompleteMultipartUploadDTO = z.infer<
	typeof CompleteMultipartUploadSchema
>;

export type UploadChunkDTO = z.infer<typeof UploadChunkSchema>;
