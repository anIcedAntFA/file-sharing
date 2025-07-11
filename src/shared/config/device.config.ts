export const DEVICE_ORIENTATION_VALUE = {
	landscape: 90,
	portrait: 0,
	reverse_landscape: 270,
};

export const CHECK_DEVICE = {
	isIpad: navigator.userAgent.includes('iPad') || navigator.maxTouchPoints > 1,
};

export const ORIENTATION_API: ScreenOrientation | undefined =
	window.screen?.orientation;
