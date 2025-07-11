import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

import { TEXT_LIB } from '../lib/text';

const I18N_CLIENT = i18next.createInstance();

const languageDetector = new LanguageDetector();

export const DEFAULT_NS = 'en' as const;

export const LOCALES = ['en', 'vi'] as const;

I18N_CLIENT.use(initReactI18next)
	.use(
		resourcesToBackend(
			(lang: string, ns: string) =>
				import(
					`./locales/${lang}/${TEXT_LIB.transformCamelCaseToKebabCase(ns)}.json`
				),
		),
	)
	.use(languageDetector)
	.init({
		debug: import.meta.env.MODE === 'development',
		lng: 'en',
		fallbackLng: 'en',
		supportedLngs: LOCALES,
		defaultNS: DEFAULT_NS,
		ns: ['about', 'fileSharing'],
		detection: {
			order: [
				'navigator',
				'querystring',
				'cookie',
				'localStorage',
				'sessionStorage',
				'htmlTag',
				'path',
				'subdomain',
			],
			lookupQuerystring: 'lng',
			lookupCookie: 'i18next',
			lookupLocalStorage: 'i18nextLng',
			caches: ['localStorage', 'cookie'],
			convertDetectedLanguage: (lng: string) => {
				if (lng.startsWith('en')) return 'en';
				if (lng.startsWith('vi')) return 'vi';
				return 'en'; // Default to English if no match
			},
		},
	});

export { I18N_CLIENT };
