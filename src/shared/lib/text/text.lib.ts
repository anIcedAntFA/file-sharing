/**
 * Copies the provided text to the clipboard using the Clipboard API.
 *
 * @param {string} text - The text to copy to the clipboard.
 * @returns A promise that resolves to `true` if the copy was successful,
 *          or `false` if the Clipboard API is unavailable or the copy fails.
 *
 * - If the Clipboard API is not supported, logs a warning and returns `false`.
 * - If an error occurs during copying, logs the error and returns `false`.
 *
 * @example
 * ```ts
 * const copied = await copyToClipboard('Hello, world!');
 * console.info(copied ? 'Copied!' : 'Failed to copy'); // 'Copied!' or 'Failed to copy'
 * ```
 */
const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!navigator.clipboard) {
    console.error('Clipboard API not available');
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

const transformCamelCaseToKebabCase = (str: string): string => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

export const TEXT_LIB = {
  copyToClipboard,
  transformCamelCaseToKebabCase,
};
