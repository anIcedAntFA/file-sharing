export const ZERO_FILE_SIZE_BYTES = 0;
export const MAX_FILE_SIZE_MB = 100000000;
// Using MIME types is generally more reliable than just extensions
export const ALLOWED_MIME_TYPES = [
	'application/pdf', // .pdf
	'application/vnd.ms-powerpoint', // .ppt
	'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
	'application/msword', // .doc
];
export const ALLOWED_EXTENSIONS_STRING = '.pdf, .ppt, .pptx, .doc'; // For user display

export const ATTACHMENT_ACCEPT = '.pdf,.ppt,.pptx,.doc';

export const DEFAULT_FORM_VALUE = {
	company: '',
	contact: '',
	email: '',
	platforms: [],
	genres: [],
	fileAttachment: [],
	hasFileAttachmentViaEmail: false,
	policyAgreement: false,
};

export const MAX_TEXT_LENGTH_50 = 50;
export const MAX_TEXT_LENGTH_255 = 255;

export const VALID_EMAIL_PATTERN =
	'^(?!.*\\.\\.)[a-z0-9](?:[a-z0-9._-]*[a-z0-9_-])?@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])$';

export const ERROR_MESSAGES = {
	company: {
		required: 'request.form.fields.company.errorMessage.required',
		maxLength: 'request.form.fields.company.errorMessage.maxLength',
	},
	contact: {
		required: 'request.form.fields.contact.errorMessage.required',
		maxLength: 'request.form.fields.contact.errorMessage.maxLength',
	},
	email: {
		required: 'request.form.fields.email.errorMessage.required',
		invalid: 'request.form.fields.email.errorMessage.invalid',
	},
	platforms: {
		required: 'request.form.fields.platforms.errorMessage.required',
	},
	genres: {
		required: 'request.form.fields.genres.errorMessage.required',
	},
	fileAttachment: {
		required: 'request.form.fields.fileAttachment.errorMessage.required',
		invalidTypes:
			'request.form.fields.fileAttachment.errorMessage.invalidTypes',
		invalidSize: 'request.form.fields.fileAttachment.errorMessage.invalidSize',
		invalidTotalSize:
			'request.form.fields.fileAttachment.errorMessage.invalidTotalSize',
	},
	policyAgreement: {
		required: 'request.form.fields.policyAgreement.errorMessage.required',
	},
};
