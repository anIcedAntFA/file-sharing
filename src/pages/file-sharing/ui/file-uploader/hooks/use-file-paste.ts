import { invariant } from '@tanstack/react-router';
import { type RefObject, useEffect } from 'react';

interface IUseFilePasteProps {
	pasteTargetRef: RefObject<HTMLElement | null>;
	onFilesPasted: (files: File[]) => void;
	enabled?: boolean;
}

export const useFilePaste = ({
	pasteTargetRef,
	onFilesPasted,
	enabled = true,
}: IUseFilePasteProps) => {
	useEffect(() => {
		if (!enabled) return;

		const pasteTarget = pasteTargetRef.current;
		invariant(pasteTarget, 'Paste target ref is not defined');

		const handlePaste = (event: ClipboardEvent) => {
			const files = event.clipboardData?.files;

			if (files && files.length > 0) {
				event.preventDefault();
				const pastedFiles = Array.from(files);
				onFilesPasted(pastedFiles);
			}
		};

		pasteTarget.addEventListener('paste', handlePaste);

		return () => {
			pasteTarget.removeEventListener('paste', handlePaste);
		};
	}, [enabled, onFilesPasted, pasteTargetRef]);
};
