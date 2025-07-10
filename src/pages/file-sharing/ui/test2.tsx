import { useWindowScroll } from "@/shared/lib/utility-hooks/use-window-scroll";

export const TestPage2 = () => {
	const scrollX = useWindowScroll((s) => s.scrollX);

	console.log("FileSharingPage scrollX:", scrollX);

	return <div>Hello "File Sharing Page"!</div>;
};
