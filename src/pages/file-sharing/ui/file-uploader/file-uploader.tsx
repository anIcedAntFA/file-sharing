import clsx from 'clsx';
import { Upload } from 'lucide-react';
import type {
	ChangeEvent,
	ComponentProps,
	ComponentRef,
	FocusEvent,
	KeyboardEvent,
	ReactElement,
	MouseEvent as ReactMouseEvent,
} from 'react';
import { useEffect, useRef } from 'react';
import type { FieldError } from 'react-hook-form';

import type { OverrideProps } from '@/shared/lib/shared-types/utility.type';

import { FilePreviewItem } from './file-preview-item';
import {
	DEFAULT_PLACEHOLDER_TEXT,
	DEFAULT_UPLOAD_BUTTON_TEXT,
	DELAY_RESET_BLUR_FLAG,
} from './file-uploader.config';
import type {
	IFileErrorMessages,
	IFileValidationConfig,
	IShowErrorFlags,
} from './file-uploader.type';
import { useFileDragAndDrop } from './hooks/use-file-drag-and-drop';
import { useFilePaste } from './hooks/use-file-paste';
import { useFileValidation } from './hooks/use-file-validation';

interface IFileUploaderProps
	extends OverrideProps<
		ComponentProps<'input'>,
		{
			id: string;
			name: string;
			disabled?: boolean;
			onBlur?: VoidFunction;
		}
	> {
	validationConfig: IFileValidationConfig;
	onValidFilesChange: (validFiles: File[]) => void;
	initialFiles?: File[];
	placeholderText?: string;
	uploadButtonText?: string;
	draggable?: boolean;
	pasteable?: boolean;
	fieldError?: FieldError;
	clearFieldError?: () => void;
	errorMessages?: Partial<IFileErrorMessages>;
	showErrorFlags?: Partial<IShowErrorFlags>;
	uploadIconElement?: ReactElement;
	fileIcon?: ReactElement;
	removeFileIcon?: ReactElement;
	classWrapper?: string;
}

export const FileUploader = ({
	id,
	name,
	initialFiles = [],
	onValidFilesChange,
	validationConfig,
	fieldError,
	clearFieldError,
	errorMessages: customErrorMessages,
	showErrorFlags: customShowErrorFlags,
	disabled = false,
	draggable = false,
	pasteable = false,
	placeholderText = DEFAULT_PLACEHOLDER_TEXT,
	uploadButtonText = DEFAULT_UPLOAD_BUTTON_TEXT,
	uploadIconElement = <Upload />,
	fileIcon,
	removeFileIcon,
	classWrapper,
	onBlur: rhfOnBlur,
	...inputProps
}: IFileUploaderProps) => {
	// Ref for the outermost div of the component, used to manage overall component blur.
	const uploaderWrapperRef = useRef<ComponentRef<'div'>>(null);
	// Ref for the interactive drop target area.
	const dropTargetRef = useRef<ComponentRef<'div'>>(null);
	// Ref for the hidden file input element.
	const fileInputRef = useRef<ComponentRef<'input'>>(null);

	// Ref to flag if a blur event is triggered by an internal action (e.g., opening file dialog),
	// to prevent RHF's onBlur from firing prematurely.
	const isInternalActionBlurRef = useRef(false);

	const {
		currentValidFiles,
		processingErrors,
		processFiles,
		hasValidFiles,
		removeFile,
		clearProcessingErrors,
	} = useFileValidation({
		initialFiles,
		validationConfig,
		onValidFilesChange,
		errorMessagesConfig: customErrorMessages,
		showErrorFlagsConfig: customShowErrorFlags,
	});

	const clearAllErrors = () => {
		clearProcessingErrors();
		clearFieldError?.();
	};

	const { draggableState } = useFileDragAndDrop({
		dropTargetRef,
		onFilesDropped: processFiles,
		enabled: draggable && !disabled,
		onDragInteractionStart: clearAllErrors,
	});

	useFilePaste({
		pasteTargetRef: dropTargetRef,
		onFilesPasted: (pastedFiles) => {
			clearAllErrors();
			processFiles(pastedFiles);
		},
		enabled: pasteable && !disabled,
	});

	const handleNativeInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		// File dialog has been interacted with (selected files or cancelled); reset internal blur flag.
		isInternalActionBlurRef.current = false;
		const files = event.target.files ? Array.from(event.target.files) : [];

		if (files.length > 0) {
			clearAllErrors();
			processFiles(files);
		}

		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleFileRemove = (fileToRemove: File) => {
		if (disabled) return;
		removeFile(fileToRemove);
	};

	const handleClickUpload = (
		event:
			| ReactMouseEvent<HTMLElement, MouseEvent>
			| KeyboardEvent<HTMLDivElement>,
	) => {
		if (disabled || !fileInputRef.current) return;
		event.stopPropagation();
		clearAllErrors();

		// Set flag: The upcoming blur event on uploaderWrapperRef is expected
		// because the native file dialog will take focus.
		isInternalActionBlurRef.current = true;
		fileInputRef.current.click();

		// Reset the flag after a short delay. This allows the immediate blur event (from dialog opening)
		// to see the flag as true, but subsequent "natural" blurs will see it as false.
		// Also handled by window focus listener if dialog is cancelled.
		setTimeout(() => {
			isInternalActionBlurRef.current = false;
		}, DELAY_RESET_BLUR_FLAG);
	};

	const handleDropAreaKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleClickUpload(event);
		}
	};

	// Main onBlur handler for the entire FileUploader component (attached to uploaderWrapperRef).
	// This determines if RHF's onBlur should be triggered.
	const handleBlurWrapper = (event: FocusEvent<HTMLDivElement>) => {
		// If the blur was caused by an internal action (like opening the file dialog),
		// do not trigger RHF's onBlur. The flag is managed by handleClickUpload/handleNativeInputChange/window focus.
		if (isInternalActionBlurRef.current) return;

		// Check if the element receiving focus (event.relatedTarget) is still
		// *within* the FileUploader component's outermost div (uploaderWrapperRef).
		// If relatedTarget is null (focus left the document/browser) OR
		// if relatedTarget is not a child of uploaderWrapperRef, then it's a "genuine" blur
		// out of the component.
		if (
			uploaderWrapperRef.current &&
			!uploaderWrapperRef.current.contains(event.relatedTarget)
		) {
			// Focus has moved completely outside the FileUploader component.
			rhfOnBlur?.();
		} else if (!event.relatedTarget && !isInternalActionBlurRef.current) {
			// Focus left the document entirely (e.g., user clicked outside browser, devtools),
			// and it wasn't an internal action that should have already reset the flag.
			rhfOnBlur?.();
		}
		// If focus moves to another element *inside* uploaderWrapperRef, rhfOnBlur is not called.
	};

	// Effect to robustly reset the isInternalActionBlurRef flag,
	// especially if the user cancels the native file dialog.
	useEffect(() => {
		const handleWindowFocus = () => {
			// If the window regains focus and the flag was true (file dialog was likely open):
			if (isInternalActionBlurRef.current) {
				// And if no files were actually selected (input is still empty),
				// it implies the dialog was cancelled. Reset the flag.
				if (
					fileInputRef.current &&
					(!fileInputRef.current.files ||
						fileInputRef.current.files.length === 0)
				) {
					isInternalActionBlurRef.current = false;
				}
			}
		};

		if (!disabled) {
			window.addEventListener('focus', handleWindowFocus);
		}
		return () => {
			window.removeEventListener('focus', handleWindowFocus);
		};
	}, [disabled]);

	const { accept, multiple: isMultiple } = validationConfig;

	const displayError =
		processingErrors.length > 0 ? processingErrors[0] : fieldError?.message;

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
		<div
			className={clsx('flex flex-col gap-1', classWrapper)}
			onBlur={handleBlurWrapper}
			ref={uploaderWrapperRef}
		>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
			<div
				className={clsx(
					'p-3 border border-dashed border-gray-200 rounded-md transition-colors',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
					'data-[drag-potential=true]:border-blue-500',
					'data-[drag-over=true]:border-blue-500',
					{ 'border-red-500': processingErrors.length > 0 || !!fieldError },
					{ 'cursor-pointer': !disabled },
					{ 'opacity-50 bg-gray-50': disabled },
				)}
				data-drag-over={draggableState === 'over'}
				data-drag-potential={draggableState === 'potential'}
				onClick={handleClickUpload}
				onKeyDown={handleDropAreaKeyDown}
				ref={dropTargetRef}
				tabIndex={disabled ? -1 : 0}
			>
				<input
					accept={accept}
					disabled={disabled}
					hidden
					id={id}
					multiple={isMultiple}
					name={name}
					onChange={handleNativeInputChange}
					ref={fileInputRef}
					type='file'
					{...inputProps}
				/>
				<div className='flex flex-col items-center justify-center gap-3 py-2'>
					<span className='w-6 h-6 text-gray-500'>{uploadIconElement}</span>
					<p className='whitespace-pre-line text-center text-base text-gray-600'>
						{placeholderText}
					</p>
					<button
						className='px-6 h-10 text-sm font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md'
						disabled={disabled}
						onClick={handleClickUpload}
						type='button'
					>
						{uploadButtonText}
					</button>
				</div>

				{/* File Previews */}
				{hasValidFiles && !isMultiple && currentValidFiles[0] && (
					<div className='w-full mt-8'>
						<FilePreviewItem
							disabled={disabled}
							fileIcon={fileIcon}
							fileName={currentValidFiles[0].name}
							onRemove={() => handleFileRemove(currentValidFiles[0])}
							removeFileIcon={removeFileIcon}
						/>
					</div>
				)}

				{isMultiple && hasValidFiles && (
					<div className='flex flex-col gap-2 w-full mt-8'>
						{currentValidFiles.map((file, index) => (
							<FilePreviewItem
								disabled={disabled}
								fileIcon={fileIcon}
								fileName={file.name}
								key={index}
								onRemove={() => handleFileRemove(file)}
								removeFileIcon={removeFileIcon}
							/>
						))}
					</div>
				)}
			</div>

			{displayError && (
				<div className='mt-1'>
					<p className='text-red-500 text-sm font-normal leading-tight'>
						{displayError}
					</p>
				</div>
			)}
		</div>
	);
};
