import clsx from 'clsx';
import { FileIcon, XIcon } from 'lucide-react';
import type { ReactElement } from 'react';

interface IFilePreviewItemProps {
	fileName: string;
	onRemove: VoidFunction;
	disabled?: boolean;
	fileIcon?: ReactElement;
	removeFileIcon?: ReactElement;
}

export const FilePreviewItem = ({
	fileName,
	onRemove,
	disabled = false,
	fileIcon = <FileIcon />,
	removeFileIcon = <XIcon />,
}: IFilePreviewItemProps) => {
	return (
		<div
			className={clsx(
				'group flex items-center gap-2 h-[30px] py-2.5 px-2 rounded bg-gray-100 select-none animate-fade-in-up',
				'dark:bg-gray-700',
			)}
		>
			<span className='w-5 h-5 text-gray-500 dark:text-gray-400'>
				{fileIcon}
			</span>

			<p
				className='flex-1 basis-0 truncate text-left font-sans text-base leading-relaxed text-gray-800 dark:text-gray-200'
				title={fileName}
			>
				{fileName}
			</p>

			<button
				aria-label={`Remove ${fileName}`}
				className={clsx(
					'w-4 h-4 text-gray-700 transition-colors duration-200 ease-in-out',
					'hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
					'disabled:cursor-not-allowed disabled:opacity-50',
				)}
				disabled={disabled}
				onClick={onRemove}
				type='button'
			>
				{removeFileIcon}
			</button>
		</div>
	);
};
