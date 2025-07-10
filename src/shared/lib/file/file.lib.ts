/**
 * Checks if a value is an instance of the File object.
 * Acts as a type guard for TypeScript.
 * @param value - The value to check.
 * @returns True if the value is a File, false otherwise.
 */
const isFile = (value: unknown): value is File => value instanceof File;

/**
 * Safely gets the name property from a value if it is a File object.
 * @param file - The value to check, expected to potentially be a File.
 * @returns The file name string if it's a File, otherwise an empty string.
 */
const getFileName = (file: unknown): string => {
  return isFile(file) ? file.name : '';
};

/**
 * Formats file size from bytes into a human-readable string (KB, MB, GB).
 * @param bytes - The file size in bytes.
 * @param decimals - The number of decimal places to include (default is 2).
 * @returns A formatted string representing the file size (e.g., "1.23 MB").
 */
const formatFileSize = (bytes: number, decimals = 2): string => {
  if (!bytes || bytes === 0) return '0 Bytes'; // Handle null/undefined/zero bytes
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  // Ensure we don't go beyond available sizes and handle potential NaN/Infinity
  if (i >= sizes.length || !Number.isFinite(bytes) || bytes < 0)
    return 'Invalid Size';
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

export const FILE_LIB = {
  isFile,
  getFileName,
  formatFileSize,
};
