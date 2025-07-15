import type { IFileErrorMessages, IShowErrorFlags } from './file-uploader.type';

export const DEFAULT_ERROR_MESSAGES: IFileErrorMessages = {
	type: '{fileName}: Invalid file type. Only {extensions} are supported.',
	size: '{fileName}: File is too large. Maximum size is {maxSize}MB.',
	minSize: '{fileName}: File is too small. Minimum size is {minSize}KB.',
	totalSize: 'Total size of selected files exceeds {maxSize}MB.',
	maxFiles: 'You can select a maximum of {maxFilesCount} files.',
	duplicate: '{fileName}: This file has already been selected.',
};

export const DEFAULT_SHOW_ERROR_FLAGS: IShowErrorFlags = {
	type: true,
	size: false,
	minSize: true,
	totalSize: true,
	maxFiles: true,
	duplicate: true,
};

export const DEFAULT_UPLOAD_BUTTON_TEXT = 'Browse File';
export const DEFAULT_PLACEHOLDER_TEXT =
	'Click to upload or drag files into this area';

export const MAX_NAME_PART_DISPLAY_LENGTH = 18;

export const DELAY_RESET_BLUR_FLAG = 200;
