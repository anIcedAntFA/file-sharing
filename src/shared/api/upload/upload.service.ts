import { UPLOAD_ENDPOINTS } from './upload.config';
import {
	CompleteMultipartUploadSchema,
	CreateMultipartUploadSchema,
	UploadPartSchema,
} from './upload.contract';
import type {
	CompleteMultipartUploadDTO,
	CreateMultipartUploadDTO,
	UploadPartDTO,
} from './upload.type';
import { API_CLIENT } from '../base';

const createMultipartUpload = (
	createMultipartDTO: CreateMultipartUploadDTO,
) => {
	const data = CreateMultipartUploadSchema.parse(createMultipartDTO);

	return API_CLIENT.post(UPLOAD_ENDPOINTS.createMultipartUpload, data);
};

const uploadPartURLs = (uploadPartDTO: UploadPartDTO) => {
	const data = UploadPartSchema.parse(uploadPartDTO);

	return API_CLIENT.post(UPLOAD_ENDPOINTS.uploadPart, data);
};

const completeMultipartUpload = (completeDTO: CompleteMultipartUploadDTO) => {
	const data = CompleteMultipartUploadSchema.parse(completeDTO);

	return API_CLIENT.post(UPLOAD_ENDPOINTS.complete, data);
};

export const UPLOAD_SERVICES = {
	createMultipartUpload,
	uploadPartURLs,
	completeMultipartUpload,
};
