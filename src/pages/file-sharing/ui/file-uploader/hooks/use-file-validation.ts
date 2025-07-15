import { useCallback, useEffect, useMemo, useState } from 'react';

import {
	KB_TO_BYTES,
	MB_TO_BYTES,
} from '@/pages/file-sharing/config/file.config';
import { FILE_LIB } from '@/shared/lib/file';

import {
	DEFAULT_ERROR_MESSAGES,
	DEFAULT_SHOW_ERROR_FLAGS,
} from '../file-uploader.config';
import type {
	IErrorMessageDetails,
	IFileErrorMessages,
	IFileValidationConfig,
	IShowErrorFlags,
} from '../file-uploader.type';

interface IUseFileValidationProps {
	validationConfig: IFileValidationConfig;
	onValidFilesChange: (validFiles: File[]) => void;
	initialFiles?: File[];
	errorMessagesConfig?: Partial<IFileErrorMessages>;
	showErrorFlagsConfig?: Partial<IShowErrorFlags>;
}

export const useFileValidation = ({
	validationConfig,
	onValidFilesChange,
	initialFiles = [],
	errorMessagesConfig,
	showErrorFlagsConfig,
}: IUseFileValidationProps) => {
	const [currentValidFiles, setCurrentValidFiles] =
		useState<File[]>(initialFiles);
	const [processingErrors, setProcessingErrors] = useState<string[]>([]);

	useEffect(() => {
		setCurrentValidFiles(initialFiles);
	}, [initialFiles]);

	const mergedErrorMessages: IFileErrorMessages = useMemo(
		() => ({ ...DEFAULT_ERROR_MESSAGES, ...errorMessagesConfig }),
		[errorMessagesConfig],
	);
	const mergedShowErrorFlags: IShowErrorFlags = useMemo(
		() => ({ ...DEFAULT_SHOW_ERROR_FLAGS, ...showErrorFlagsConfig }),
		[showErrorFlagsConfig],
	);

	const {
		multiple: isMultiple,
		allowedMimeTypes,
		maxFileSizeMB,
		maxFiles,
		maxTotalSizeMB,
		minFileSizeKB,
		allowedExtensionsString,
	} = validationConfig;

	const allowedExtensionsArray = allowedExtensionsString
		.split(',')
		.map((ext) => ext.trim());

	const getDisplayErrorMessage = useCallback(
		(
			type: keyof IFileErrorMessages,
			fileName: string,
			details?: IErrorMessageDetails,
		): string | null => {
			if (!mergedShowErrorFlags[type]) return null;

			let message = mergedErrorMessages[type] || DEFAULT_ERROR_MESSAGES[type];
			message = message.replace('{fileName}', fileName);

			if (details?.minSize) {
				message = message.replace('{minSize}', details.minSize.toString());
			}

			if (details?.maxSize)
				message = message.replace('{maxSize}', details.maxSize.toString());

			if (details?.maxTotalSize) {
				message = message.replace(
					'{maxTotalSize}',
					details.maxTotalSize.toString(),
				);
			}

			if (details?.maxFilesCount)
				message = message.replace(
					'{maxFilesCount}',
					details.maxFilesCount.toString(),
				);

			if (details?.extensions)
				message = message.replace('{extensions}', details.extensions);

			return message;
		},
		[mergedErrorMessages, mergedShowErrorFlags],
	);

	const processFiles = useCallback(
		(incomingFiles: File[]) => {
			const newErrorMessages: string[] = [];
			let localCurrentValidFiles = [...currentValidFiles]; // Local copy for batch

			const addError = (
				type: keyof IFileErrorMessages,
				fileName: string,
				details?: IErrorMessageDetails,
			) => {
				const msg = getDisplayErrorMessage(type, fileName, details);
				if (msg) newErrorMessages.push(msg);
			};

			if (!isMultiple && incomingFiles.length > 0) {
				const file = incomingFiles[0];
				let isValid = true;

				if (
					!FILE_LIB.isValidMimeType(file, allowedMimeTypes) ||
					!FILE_LIB.isValidExtensionName(file, allowedExtensionsArray)
				) {
					addError('type', file.name, { extensions: allowedExtensionsString });
					isValid = false;
				}

				if (isValid && minFileSizeKB !== undefined) {
					if (file.size < minFileSizeKB * KB_TO_BYTES) {
						addError('minSize', file.name, { minSize: minFileSizeKB });
						isValid = false;
					}
				}

				if (isValid && maxFileSizeMB) {
					if (!FILE_LIB.isValidFileSize(file, maxFileSizeMB * MB_TO_BYTES)) {
						addError('size', file.name, { maxSize: maxFileSizeMB });
						isValid = false;
					}
				}

				if (isValid) {
					if (
						!localCurrentValidFiles[0] ||
						!FILE_LIB.isFileDuplicated(file, localCurrentValidFiles)
					) {
						localCurrentValidFiles = [file];
					} else {
						addError('duplicate', file.name);
					}
				}
			} else if (isMultiple) {
				const filesToPotentiallyAdd: File[] = [];

				for (const file of incomingFiles) {
					let canAddThisFile = true;

					if (
						!FILE_LIB.isValidMimeType(file, allowedMimeTypes) ||
						!FILE_LIB.isValidExtensionName(file, allowedExtensionsArray)
					) {
						addError('type', file.name, {
							extensions: allowedExtensionsString,
						});
						canAddThisFile = false;
					}

					if (canAddThisFile && minFileSizeKB !== undefined) {
						if (file.size <= minFileSizeKB * KB_TO_BYTES) {
							addError('minSize', file.name, { minSize: minFileSizeKB });
							canAddThisFile = false;
						}
					}

					if (canAddThisFile && maxFileSizeMB) {
						if (!FILE_LIB.isValidFileSize(file, maxFileSizeMB * MB_TO_BYTES)) {
							addError('size', file.name, { maxSize: maxFileSizeMB });
							canAddThisFile = false;
						}
					}

					if (
						canAddThisFile &&
						FILE_LIB.isFileDuplicated(file, [
							...localCurrentValidFiles,
							...filesToPotentiallyAdd,
						])
					) {
						addError('duplicate', file.name);
						canAddThisFile = false;
					}
					if (canAddThisFile) {
						if (
							maxFiles &&
							localCurrentValidFiles.length + filesToPotentiallyAdd.length >=
								maxFiles
						) {
							addError('maxFiles', file.name, { maxFilesCount: maxFiles }); // Error for the file that would exceed
							break; // Stop processing further files for this batch
						}
						filesToPotentiallyAdd.push(file);
					}
				}

				//---Added total size validation block---
				let isBatchValid = true;

				// 1. Check total size if config is provided
				if (maxTotalSizeMB && filesToPotentiallyAdd.length > 0) {
					const maxTotalSizeBytes = maxTotalSizeMB * MB_TO_BYTES;
					const existingSize = localCurrentValidFiles.reduce(
						(sum, file) => sum + file.size,
						0,
					);
					const newFilesSize = filesToPotentiallyAdd.reduce(
						(sum, file) => sum + file.size,
						0,
					);

					if (existingSize + newFilesSize > maxTotalSizeBytes) {
						// Add a single error for the entire batch. Use empty string for fileName.
						addError('totalSize', '', { maxTotalSize: maxTotalSizeMB });
						isBatchValid = false;
					}
				}

				// 2. Only add the new files if the entire batch is valid
				if (isBatchValid) {
					localCurrentValidFiles.push(...filesToPotentiallyAdd);
				}
			}

			setProcessingErrors(newErrorMessages);

			// Only call onValidFilesChange if the list of valid files actually changed
			if (
				localCurrentValidFiles.length !== currentValidFiles.length ||
				localCurrentValidFiles.some((f, i) => f !== currentValidFiles[i])
			) {
				setCurrentValidFiles(localCurrentValidFiles);
				onValidFilesChange(localCurrentValidFiles);
			}
		},
		[
			currentValidFiles,
			isMultiple,
			getDisplayErrorMessage,
			allowedMimeTypes,
			allowedExtensionsArray,
			minFileSizeKB,
			maxFileSizeMB,
			allowedExtensionsString,
			maxTotalSizeMB,
			maxFiles,
			onValidFilesChange,
		],
	);

	const removeFile = useCallback(
		(fileToRemove: File) => {
			const updatedFiles = currentValidFiles.filter(
				(file) => file !== fileToRemove,
			);
			setCurrentValidFiles(updatedFiles);
			onValidFilesChange(updatedFiles);
			setProcessingErrors([]);
		},
		[currentValidFiles, onValidFilesChange],
	);

	const clearProcessingErrors = useCallback(() => {
		setProcessingErrors([]);
	}, []);

	const hasValidFiles = currentValidFiles.length > 0;

	return {
		currentValidFiles,
		processingErrors,
		processFiles,
		hasValidFiles,
		removeFile,
		clearProcessingErrors,
	};
};
