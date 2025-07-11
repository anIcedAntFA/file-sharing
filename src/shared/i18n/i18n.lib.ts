import { LOCALES } from './i18n.config';
import type { Locale } from './i18n.type';

const isValidLocale = (locale: unknown): locale is Locale =>
	LOCALES.includes(locale as Locale);

export const I18N_LIB = {
	isValidLocale,
};
