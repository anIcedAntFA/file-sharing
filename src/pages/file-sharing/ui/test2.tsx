import { useWindowScroll } from '@/shared/lib/utility-hooks/use-window-scroll';

export const TestPage2 = () => {
	const scrollX = useWindowScroll((s) => s.scrollX);

	console.info('FileSharingPage scrollX:', scrollX);

	return <div>Hello "File Sharing Page"!</div>;
};
