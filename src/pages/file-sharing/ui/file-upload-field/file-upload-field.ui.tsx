import { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { cn } from '@/shared/lib/css';

import {
	ALLOWED_EXTENSIONS_STRING,
	ALLOWED_MIME_TYPES,
	ATTACHMENT_ACCEPT,
	MAX_FILE_SIZE_MB,
	ZERO_FILE_SIZE_BYTES,
} from '../../config/form.config';
import { FileUploader, type IFileValidationConfig } from '../file-uploader';

export const FileUploadField = () => {
	const id = useId();
	const { control, clearErrors } = useFormContext();

	return (
		<Controller
			control={control}
			defaultValue={[]}
			name='fileAttachment'
			render={({ field, fieldState: { error: rhfError } }) => {
				const initialFilesForUploader = field.value
					? Array.isArray(field.value)
						? field.value
						: [field.value]
					: [];
				const validationConfig: IFileValidationConfig = {
					multiple: true,
					accept: ATTACHMENT_ACCEPT,
					allowedMimeTypes: ALLOWED_MIME_TYPES,
					allowedExtensionsString: ALLOWED_EXTENSIONS_STRING,
					minFileSizeKB: ZERO_FILE_SIZE_BYTES,
					maxTotalSizeMB: MAX_FILE_SIZE_MB,
				};

				return (
					<div className={cn('space-y-2')}>
						<div className='flex flex-col md:flex-row md:gap-2 md:items-center lang-ko:flex-row lang-ko:gap-1'>
							<label
								className='text-sm font-medium text-gray-900 dark:text-gray-100'
								htmlFor={`file-attachment-field-${id}`}
							>
								File Attachment
							</label>
							<p className='text-sm text-gray-500 dark:text-gray-400'>
								You can upload multiple files. Maximum total size:{' '}
								{MAX_FILE_SIZE_MB}MB.
							</p>
						</div>
						<FileUploader
							classWrapper='mt-3'
							clearFieldError={() => clearErrors(field.name)}
							disabled={!!field.disabled}
							draggable
							fieldError={rhfError}
							id={`file-attachment-field-${id}`}
							initialFiles={initialFilesForUploader}
							name={field.name}
							onBlur={field.onBlur}
							onValidFilesChange={field.onChange}
							pasteable
							placeholderText='Drag and drop files here'
							validationConfig={validationConfig}
						/>
					</div>
				);
			}}
		/>
	);
};
