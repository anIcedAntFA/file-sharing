export interface IFileErrorMessages {
	type: string; // e.g., "{fileName}: Invalid file type. Only {extensions} are allowed."
	size: string; // e.g., "{fileName}: File exceeds max size of {maxSize}MB."
	minSize: string; // e.g., "{fileName}: File is too small. Minimum size is {minSize}KB."
	totalSize: string; // e.g., "Total size of selected files exceeds {maxSize}MB."
	maxFiles: string; // e.g., "Cannot upload more than {maxFilesCount} files."
	duplicate: string; // e.g., "{fileName}: This file is already selected."
	// You can add more specific errors if needed
}

export interface IShowErrorFlags {
	type: boolean;
	size: boolean;
	minSize: boolean;
	totalSize: boolean;
	maxFiles: boolean;
	duplicate: boolean;
}

export interface IFileValidationConfig {
	multiple: boolean;
	accept: string; // For native input filtering
	allowedMimeTypes: readonly string[]; // For precise validation
	allowedExtensionsString: string; // For display in messages (e.g., ".pdf, .docx")
	maxFileSizeMB?: number;
	maxTotalSizeMB?: number;
	minFileSizeKB?: number;
	maxFiles?: number;
}

export interface IErrorMessageDetails {
	minSize?: number;
	maxSize?: number;
	maxTotalSize?: number;
	maxFilesCount?: number;
	extensions?: string;
}

export type DraggableState = 'idle' | 'potential' | 'over';
