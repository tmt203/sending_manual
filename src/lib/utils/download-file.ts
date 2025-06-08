/**
 * Handle download file
 * @param response Response
 * @param fileName string
 */
export const handleDownloadFile = async (response: Response, fileName: string) => {
	// Convert the response to a Blob
	const blob = await response.blob();
	// Create a URL for the Blob and trigger a download
	const url = window.URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.setAttribute("download", fileName);
	document.body.appendChild(link);
	link.click();

	// Clean up
	link.parentNode?.removeChild(link);
	window.URL.revokeObjectURL(url);
};
