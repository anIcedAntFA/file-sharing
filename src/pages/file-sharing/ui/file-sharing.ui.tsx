import { FormProvider, useForm } from 'react-hook-form';

import { FileUploadField } from './file-upload-field/file-upload-field.ui';
import {
	useCompleteMultipartUpload,
	useCreateMultipartUpload,
	useUploadChunk,
	useUploadPartURLs,
} from '../api/upload-file.mutation';
import type { UploadFile } from '../model/file-sharing.type';

const CHUNK_SIZE = 50 * 1024 * 1024; // 50 MB

export const FileSharingPage = () => {
	const methods = useForm<UploadFile>({
		defaultValues: {
			fileAttachment: [],
		},
	});

	const { mutateAsync: initUpload } = useCreateMultipartUpload({});
	const { mutateAsync: uploadParts } = useUploadPartURLs({});

	const { mutateAsync: uploadChunk } = useUploadChunk({});

	const { mutateAsync: complete } = useCompleteMultipartUpload({});

	const onSubmit = async (data: UploadFile) => {
		console.info('Form Submitted:', data);
		const initData = await initUpload({
			fileName: data.fileAttachment[0]?.name,
			contentType: data.fileAttachment[0]?.type,
		});

		console.info('Multipart Upload Initialized:', initData);

		const uploadPartData = await uploadParts({
			key: initData.key,
			uploadId: initData.uploadId,
			partCount: Math.ceil(data.fileAttachment[0].size / (50 * 1024 * 1024)),
		});

		// Create array of upload promises
		const uploadPromises = [];

		for (const { partNumber, url } of uploadPartData) {
			const file = data.fileAttachment[0];

			const index = partNumber - 1; // partNumber starts from 1

			const chunkFile = file.slice(
				index * CHUNK_SIZE,
				Math.min(file.size, (index + 1) * CHUNK_SIZE), // 1024MB - 1050MB => 1024MB
			);

			// Create promise that resolves to the expected format
			const uploadPromise = uploadChunk({
				fileChunk: chunkFile,
				presignedURL: url,
			}).then((etag) => ({
				ETag: etag,
				PartNumber: partNumber,
			}));

			uploadPromises.push(uploadPromise);
		}

		// Wait for all uploads to complete and get the parts array
		const totalChunks = await Promise.all(uploadPromises);

		console.info('All chunks uploaded:', totalChunks);

		await complete({
			key: initData.key,
			uploadId: initData.uploadId,
			parts: totalChunks,
		});

		console.info('Multipart Upload Completed:', {
			key: initData.key,
			uploadId: initData.uploadId,
			parts: totalChunks,
		});
	};

	return (
		<div className='bg-white dark:bg-black min-h-screen p-4 sm:p-8'>
			<FormProvider {...methods}>
				<form
					className='mx-auto p-6 border rounded-lg dark:border-gray-700'
					onSubmit={methods.handleSubmit(onSubmit)}
				>
					<h1 className='text-xl font-bold mb-6 text-gray-900 dark:text-white'>
						Request Form
					</h1>
					<FileUploadField />
					<button
						className='mt-6 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700'
						type='submit'
					>
						Submit Request
					</button>
				</form>
			</FormProvider>
		</div>
	);
};
