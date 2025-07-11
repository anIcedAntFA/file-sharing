import 'i18next';

import type { about, fileSharing } from '../shared/i18n/locales/en';

declare module 'i18next' {
	interface CustomTypeOptions {
		defaultNS: 'about';
		resources: {
			about: typeof about;
			fileSharing: typeof fileSharing;
		};
	}
}
