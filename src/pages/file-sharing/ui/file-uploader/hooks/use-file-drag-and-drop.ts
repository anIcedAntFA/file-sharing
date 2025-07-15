import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
	dropTargetForExternal,
	monitorForExternal,
} from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
import {
	containsFiles,
	getFiles,
} from '@atlaskit/pragmatic-drag-and-drop/external/file';
import { preventUnhandled } from '@atlaskit/pragmatic-drag-and-drop/prevent-unhandled';
import { invariant } from '@tanstack/react-router';
import { type RefObject, useEffect, useState } from 'react';

import type { DraggableState } from '../file-uploader.type';

interface IUseFileDragAndDropProps {
	dropTargetRef: RefObject<HTMLElement | null>;
	onFilesDropped: (files: File[]) => void;
	enabled?: boolean;
	onDragInteractionStart?: VoidFunction;
}

export const useFileDragAndDrop = ({
	dropTargetRef,
	onFilesDropped,
	enabled = true,
	onDragInteractionStart,
}: IUseFileDragAndDropProps) => {
	const [draggableState, setDraggableState] = useState<DraggableState>('idle');

	useEffect(() => {
		if (!enabled) return;

		const dropTargetArea = dropTargetRef.current;
		invariant(dropTargetArea, 'Drop target area ref is not set');

		return combine(
			dropTargetForExternal({
				element: dropTargetArea,
				canDrop: containsFiles,
				onDragEnter: () => setDraggableState('over'),
				onDragLeave: () => setDraggableState('potential'), // When leaving the element but still dragging
				onDrop: ({ source }) => {
					setDraggableState('idle');

					if (containsFiles({ source })) {
						const files = getFiles({ source });

						if (files.length > 0) {
							onDragInteractionStart?.();
							onFilesDropped(files);
						}
					}
				},
			}),
			monitorForExternal({
				canMonitor: containsFiles,
				onDragStart: () => {
					onDragInteractionStart?.();
					setDraggableState('potential');
					preventUnhandled.start();
				},
				onDrop: () => {
					setDraggableState('idle');
					preventUnhandled.stop();
				},
			}),
		);
	}, [dropTargetRef, enabled, onDragInteractionStart, onFilesDropped]);

	return { draggableState };
};
