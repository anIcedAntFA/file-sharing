import { useMutation } from '@tanstack/react-query';

import {
	type CreateMultipartUploadRes,
	UPLOAD_SERVICES,
} from '@/shared/api/upload';
import type {
	MutateOptions,
	Todo,
} from '@/shared/lib/shared-types/utility.type';

interface ICreateMultipartMutationVariables {
	fileName: string;
	contentType: string;
}

export const useCreateMultipartUpload = (
	options: MutateOptions<CreateMultipartUploadRes>,
) => {
	const { mutationKey = [], onMutate, onError, onSettled, onSuccess } = options;

	return useMutation({
		mutationKey: ['init', ...mutationKey],
		mutationFn: async ({
			fileName,
			contentType,
		}: ICreateMultipartMutationVariables) => {
			const { data } = await UPLOAD_SERVICES.createMultipartUpload({
				fileName,
				contentType,
			});

			return data;
		},
		onMutate,
		onError,
		onSettled,
		onSuccess: (data, variables, context) => {
			onSuccess?.(data, variables, context);
		},
	});
};

interface IUploadPartURLsMutationVariables {
	key: string;
	uploadId: string;
	partCount: number;
}

export const useUploadPartURLs = (options: MutateOptions<Todo>) => {
	const { mutationKey = [], onMutate, onError, onSettled, onSuccess } = options;

	return useMutation({
		mutationKey: ['part', ...mutationKey],
		mutationFn: async ({
			key,
			uploadId,
			partCount,
		}: IUploadPartURLsMutationVariables) => {
			const { data } = await UPLOAD_SERVICES.uploadPartURLs({
				key,
				uploadId,
				partCount,
			});

			return data;
		},
		onMutate,
		onError,
		onSettled,
		onSuccess: (data, variables, context) => {
			onSuccess?.(data, variables, context);
		},
	});
};

interface IUseUploadChunkMutationVariables {
	fileChunk: Blob;
	presignedURL: string;
	// partCount: number;
}

export const useUploadChunk = (options: MutateOptions<Todo>) => {
	const { mutationKey = [], onMutate, onError, onSettled, onSuccess } = options;

	return useMutation({
		mutationKey: ['presignedURL', ...mutationKey],
		mutationFn: async ({
			fileChunk,
			presignedURL,
		}: IUseUploadChunkMutationVariables) => {
			const data = await UPLOAD_SERVICES.uploadChunk({
				fileChunk,
				presignedURL,
			});
			console.debug('Chunk uploaded, response:', data);

			return data.headers.etag || data.headers.ETag;
		},
		onMutate,
		onError,
		onSettled,
		onSuccess: (data, variables, context) => {
			onSuccess?.(data, variables, context);
		},
	});
};

interface ICompleteMultipartUploadVariables {
	key: string;
	uploadId: string;
	parts: {
		ETag: string;
		PartNumber: number;
	}[];
}

export const useCompleteMultipartUpload = (options: MutateOptions<Todo>) => {
	const { mutationKey = [], onMutate, onError, onSettled, onSuccess } = options;

	return useMutation({
		mutationKey: ['complete', ...mutationKey],
		mutationFn: async ({
			key,
			parts,
			uploadId,
		}: ICompleteMultipartUploadVariables) => {
			const { data } = await UPLOAD_SERVICES.completeMultipartUpload({
				key,
				uploadId,
				parts,
			});
			return data;
		},
		onMutate,
		onError,
		onSettled,
		onSuccess: (data, variables, context) => {
			onSuccess?.(data, variables, context);
		},
	});
};
