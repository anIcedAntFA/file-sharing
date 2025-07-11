import {
	CHECK_DEVICE,
	DEVICE_ORIENTATION_VALUE,
	ORIENTATION_API,
} from '@/shared/config/device.config';

/**
 * Determines if the device is in a physical landscape orientation.
 *
 * @description
 * This function robustly checks for landscape mode by prioritizing the Screen Orientation API
 * (`screen.orientation.angle`). This is the most reliable method as it reflects the device's
 * actual physical orientation, which is critical for modern devices like foldables
 * (e.g., Samsung Galaxy Fold) where viewport dimensions can be misleading.
 *
 * If the Screen Orientation API is not supported (e.g., on any browser on iOS),
 * it provides a reliable fallback to using CSS media queries.
 *
 * @returns {boolean} Returns `true` if the device is in landscape orientation, otherwise `false`.
 */
const getIsLandscape = (): boolean => {
	if (CHECK_DEVICE.isIpad && ORIENTATION_API) {
		return ORIENTATION_API.type.includes('landscape');
	}

	// First, attempt to use the Screen Orientation API if the browser supports it.
	// This is the most accurate method for determining physical orientation.
	if (ORIENTATION_API) {
		return (
			ORIENTATION_API.angle === DEVICE_ORIENTATION_VALUE.landscape || // Typically 90 degrees
			ORIENTATION_API.angle === DEVICE_ORIENTATION_VALUE.reverse_landscape // Typically -90 or 270 degrees
		);
	}

	// --- Fallback for unsupported browsers ---
	// If `screen.orientation.angle` is not available (e.g., on iOS/iPadOS),
	// fall back to checking the viewport's orientation via media query.
	// Note: This can be inaccurate on some foldable devices.
	return window.matchMedia('(orientation: landscape)').matches;
};

export const DEVICE_LIB = {
	getIsLandscape,
};
