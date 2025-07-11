import { useWindowScroll } from '@/shared/lib/utility-hooks/use-window-scroll';

export const TestPage = () => {
	const scrollY = useWindowScroll((s) => s.scrollY);

	console.info('FileSharingPage scrollY:', scrollY);

	return (
		<div>
			<h1>About Page</h1>
			<p>This is the about page of the application.</p>
			<p>Here you can find information about the app and its features.</p>
		</div>
	);
};
