import z from 'zod';

export const CreateMultipartUploadSchema = z.object({
	fileName: z.string(),
	contentType: z.string(),
});

export const CreateMultipartUploadResponseSchema = z.object({
	uploadId: z.string(),
	key: z.string(),
});

export const UploadPartSchema = z.object({
	key: z.string(),
	uploadId: z.string(),
	partCount: z.number(),
});

export const UploadPartResponseSchema = z.array(
	z.object({
		url: z.string(),
		partNumber: z.number(),
	}),
);

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

export const CompleteMultipartUploadResponseSchema = z.object({
	location: z.string(),
	key: z.string(),
	bucket: z.string(),
	eTag: z.string(),
});
