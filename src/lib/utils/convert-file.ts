/**
 * File to Unit8Array
 * @param file File
 * @returns Uint8Array
 */
export const fileToUint8Array = (file: File): Promise<Uint8Array> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			const arrayBuffer = reader.result as ArrayBuffer;
			const uint8Array = new Uint8Array(arrayBuffer);
			resolve(uint8Array);
		};

		reader.onerror = (error) => {
			reject(new Error((error.target as FileReader).error?.message ?? "An error occurred"));
		};

		reader.readAsArrayBuffer(file);
	});
};
