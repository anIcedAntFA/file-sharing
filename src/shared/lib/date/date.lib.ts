import type { Dayjs } from 'dayjs';

const isSameDay = (startDate: Dayjs, endDate: Dayjs): boolean =>
	startDate.isSame(endDate, 'day');

export const DATE_LIB = {
	isSameDay,
};
