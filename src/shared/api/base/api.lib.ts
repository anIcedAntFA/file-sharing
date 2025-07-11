import type { AxiosResponse, CreateAxiosDefaults } from 'axios';
import axios, { AxiosError, isAxiosError } from 'axios';
import qs from 'query-string';
import { ZodError, type ZodType } from 'zod';

import { SECOND } from '@/shared/config/date.config';

import { APIErrorDataDTOSchema } from './api.schema';
import type { APIErrorData, APIErrorDataDTO } from './api.type';

interface ICreateInstanceProps extends CreateAxiosDefaults {
	apiKey?: string;
	clientId?: string;
}

export const createInstance = ({
	baseURL,
	apiKey,
	...config
}: ICreateInstanceProps) => {
	const instance = axios.create({
		baseURL,
		timeout: SECOND * 10,
		headers: {
			'Content-Type': 'application/json',
			...(apiKey ? { 'x-inface-api-key': apiKey } : {}),
		},
		paramsSerializer: (params) =>
			qs.stringify(params, {
				skipEmptyString: true,
				skipNull: true,
			}),
		...config,
	});

	instance.interceptors.response.use(
		(response) => response,
		(error) => {
			if (!isAxiosError(error)) return Promise.reject(error);

			const validation = APIErrorDataDTOSchema.safeParse(error.response?.data);
			if (!validation.success) return Promise.reject(error);

			const normalizedErrorResponse = {
				// biome-ignore lint/style/noNonNullAssertion: <>
				...error.response!,
				data: normalizeValidationErrors(validation.data),
			};

			return Promise.reject(
				new AxiosError(
					error.message,
					error.code,
					error.config,
					error.request,
					normalizedErrorResponse,
				),
			);
		},
	);

	return instance;
};

export const responseContract =
	<Data>(schema: ZodType<Data>) =>
	(response: AxiosResponse<unknown>): AxiosResponse<Data> => {
		// Use safeParse to validate the response data without throwing on failure
		const validationResult = schema.safeParse(response.data);

		if (!validationResult.success) {
			// If validation fails, reject the promise with the ZodError
			// This allows error handlers (e.g., react-query onError) to access validation details
			console.error(
				'Response contract validation failed:',
				validationResult.error.issues,
			);
			throw new ZodError(validationResult.error.issues); // Throw the ZodError
		}

		// If validation succeeds, return the response with the parsed data
		const data = validationResult.data; // Access the successfully parsed data
		return { ...response, data };
	};

const normalizeValidationErrors = (data: APIErrorDataDTO): APIErrorData =>
	Object.entries(data.errors).flatMap(([field, messages]) =>
		messages.map((message) => `${field} ${message}`),
	);
