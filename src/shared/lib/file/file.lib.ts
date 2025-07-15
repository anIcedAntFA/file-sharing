/**
 * Checks if a value is an instance of the File object.
 * Acts as a type guard for TypeScript.
 * @param value - The value to check.
 * @returns True if the value is a File, false otherwise.
 */
const isFile = (value: unknown): value is File => value instanceof File;

/**
 * Safely gets the name property from a value if it is a File object.
 * @param file - The value to check, expected to potentially be a File.
 * @returns The file name string if it's a File, otherwise an empty string.
 */
const getFileName = (file: unknown): string => {
	return isFile(file) ? file.name : '';
};

/**
 * Formats file size from bytes into a human-readable string (KB, MB, GB).
 * @param bytes - The file size in bytes.
 * @param decimals - The number of decimal places to include (default is 2).
 * @returns A formatted string representing the file size (e.g., "1.23 MB").
 */
const formatFileSize = (bytes: number, decimals = 2): string => {
	if (!bytes || bytes === 0) return '0 Bytes'; // Handle null/undefined/zero bytes
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	// Ensure we don't go beyond available sizes and handle potential NaN/Infinity
	if (i >= sizes.length || !Number.isFinite(bytes) || bytes < 0)
		return 'Invalid Size';
	return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

const splitFilenameParts = (
	fullName: string,
): { name: string; extension: string } => {
	if (!fullName) {
		return { name: '', extension: '' };
	}

	const lastDotIndex = fullName.lastIndexOf('.');

	// A "valid" extension means the dot is present,
	// is not the first character, and is not the last character.
	if (lastDotIndex > 0 && lastDotIndex < fullName.length - 1) {
		return {
			name: fullName.substring(0, lastDotIndex + 1), // Include the dot in the name part
			extension: fullName.substring(lastDotIndex + 1), // Extension part without the dot
		};
	} else {
		// No valid extension found.
		// This covers cases like:
		// - "filename" (no dot)
		// - ".hiddenfile" (dot is first character)
		// - "filename." (dot is last character)
		// In these cases, the entire string is considered the name, and there's no extension.
		return {
			name: fullName,
			extension: '',
		};
	}
};

/**
 * Validates if the file size is within the allowed maximum limit.
 * Returns true if the file is null/undefined (considered valid for this check)
 * or if the file size is less than or equal to the max size.
 * @param file - The File object or null/undefined.
 * @param maxSizeInBytes - The maximum allowed file size in bytes. Defaults to value from config.
 * @returns True if the file size is valid or if no file is present, false otherwise.
 */
const isValidFileSize = (
	file: File | null | undefined,
	maxSizeInBytes: number,
): boolean => {
	// If no file is passed, it's considered valid for *this specific check*
	// The 'required' check should be handled separately if needed.
	if (!isFile(file)) {
		return true;
	}

	return file.size <= maxSizeInBytes;
};

/**
 * Validates if the file's MIME type is within the allowed list.
 * Returns true if the file is null/undefined (considered valid for this check)
 * or if the file type is included in the allowed types.
 * @param file - The File object or null/undefined.
 * @param allowedTypes - An array of allowed MIME type strings. Defaults to value from config.
 * @returns True if the file type is valid or if no file is present, false otherwise.
 */
const isValidMimeType = (
	file: File | null | undefined,
	allowedTypes: readonly string[],
): boolean => {
	// If no file is passed, it's considered valid for *this specific check*
	if (!isFile(file)) return true;

	// Ensure file.type exists and is included in the allowed list
	return !!file.type && allowedTypes.includes(file.type);
};

const isValidExtensionName = (
	file: File | null | undefined,
	allowedExtensions: readonly string[],
): boolean => {
	if (!isFile(file)) return true;

	const fileNameParts = splitFilenameParts(file.name);
	const fileExtension = fileNameParts.extension.toLowerCase();

	return allowedExtensions
		.map((ext) => ext.replace(/^\./, ''))
		.includes(fileExtension);
};

/**
 * Checks if a file is duplicated in the existing files array.
 * Compares based on name, size, type, and last modified date.
 * @param file - The File object to check for duplication.
 * @param existingFiles - An array of existing File objects to compare against.
 * @returns True if the file is duplicated, false otherwise.
 */
const isFileDuplicated = (file: File, existingFiles: File[]): boolean => {
	return existingFiles.some(
		(existingFile) =>
			existingFile.name === file.name &&
			existingFile.size === file.size &&
			existingFile.type === file.type &&
			existingFile.lastModified === file.lastModified,
	);
};

export const FILE_LIB = {
	isFile,
	getFileName,
	formatFileSize,
	isValidFileSize,
	isValidMimeType,
	isValidExtensionName,
	isFileDuplicated,
};
