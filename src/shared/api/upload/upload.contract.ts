import z from 'zod';

export const CreateMultipartUploadSchema = z.object({
	fileName: z.string(),
	contentType: z.string(),
});

export const CreateMultipartUploadResSchema = z.object({
	uploadId: z.string(),
	key: z.string(),
});

export const UploadPartSchema = z.object({
	key: z.string(),
	uploadId: z.string(),
	partCount: z.number(),
});

export const UploadPartResSchema = z.array(
	z.object({
		partNumber: z.number(),
		url: z.string(),
	}),
);

export const UploadChunkSchema = z.object({
	fileChunk: z.instanceof(Blob),
	presignedURL: z.string(),
});

export const CompleteMultipartUploadSchema = z.object({
	key: z.string(),
	uploadId: z.string(),
	parts: z.array(
		z.object({
			ETag: z.string(),
			PartNumber: z.number(),
		}),
	),
});
