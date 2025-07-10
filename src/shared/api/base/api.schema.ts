import { z } from 'zod';

export const APIErrorDataDTOSchema = z.object({
	errors: z.record(z.string(), z.array(z.string())),
});

export const APIErrorDataSchema = z.array(z.string());
