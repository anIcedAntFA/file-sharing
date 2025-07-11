import { useTranslation } from 'react-i18next';

import { useWindowScroll } from '@/shared/lib/utility-hooks/use-window-scroll';

export const AboutPage = () => {
	const { scrollY } = useWindowScroll();

	const { t } = useTranslation('about');

	console.info('FileSharingPage scrollY:', scrollY);

	return (
		<div>
			<h1>About Page</h1>
			<p>This is the about page of the application {t('head.title')}.</p>
			<p>Here you can find information about the app and its features.</p>
		</div>
	);
};
