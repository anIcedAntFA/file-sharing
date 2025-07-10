import { createFileRoute } from "@tanstack/react-router";
import { FileSharingPage } from "@/pages/file-sharing";

export const Route = createFileRoute("/$locale/file-sharing")({
	component: FileSharingPage,
});
