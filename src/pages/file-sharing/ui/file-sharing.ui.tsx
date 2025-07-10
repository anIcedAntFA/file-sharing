// import { useWindowScroll } from "@/shared/lib/utility-hooks/use-window-scroll";
import { useTranslation } from "react-i18next";
import { TestPage } from "./test";
import { TestPage2 } from "./test2";

export const FileSharingPage = () => {
	const { t } = useTranslation("fileSharing");
	// const { scrollX } = useWindowScroll();

	// console.log("FileSharingPage scrollX:", scrollX);

	return (
		<div>
			<TestPage2 />
			Hello "File Sharing Page"!
			{t("head.description")}
			<TestPage />
		</div>
	);
};
