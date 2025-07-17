import { z } from 'zod';

import { ERROR_MESSAGES } from '../config/form.config';

export const UploadFileSchema = z.object({
	fileAttachment: z.array(
		z.instanceof(File, {
			message: ERROR_MESSAGES.fileAttachment.required,
		}),
	),
});
