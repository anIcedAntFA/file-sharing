import { UPLOAD_ENDPOINTS } from './upload.config';
import {
	CompleteMultipartUploadSchema,
	CreateMultipartUploadSchema,
	// UploadChunkSchema,
	UploadPartResSchema,
	UploadPartSchema,
} from './upload.contract';
import type {
	CompleteMultipartUploadDTO,
	CreateMultipartUploadDTO,
	UploadChunkDTO,
	UploadPartDTO,
} from './upload.type';
import { API_CLIENT, responseContract } from '../base';

const createMultipartUpload = (
	createMultipartDTO: CreateMultipartUploadDTO,
) => {
	const data = CreateMultipartUploadSchema.parse(createMultipartDTO);

	return API_CLIENT.post(UPLOAD_ENDPOINTS.createMultipartUpload, data);
};

const uploadPartURLs = (uploadPartDTO: UploadPartDTO) => {
	console.debug('Uploading Part URLs:', uploadPartDTO);
	const data = UploadPartSchema.parse(uploadPartDTO);

	return API_CLIENT.post(UPLOAD_ENDPOINTS.uploadPart, data).then(
		responseContract(UploadPartResSchema),
	);
};

const completeMultipartUpload = (completeDTO: CompleteMultipartUploadDTO) => {
	const data = CompleteMultipartUploadSchema.parse(completeDTO);

	return API_CLIENT.post(UPLOAD_ENDPOINTS.complete, data);
};

const uploadChunk = (uploadChunkDTO: UploadChunkDTO) => {
	// const data = UploadChunkSchema.parse(uploadChunkDTO);
	return API_CLIENT.put(uploadChunkDTO.presignedURL, uploadChunkDTO.fileChunk);
};

export const UPLOAD_SERVICES = {
	createMultipartUpload,
	uploadPartURLs,
	uploadChunk,
	completeMultipartUpload,
};
