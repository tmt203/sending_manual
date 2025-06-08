import clsx from "clsx";
import { FileUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import {
	DropzoneInputProps,
	DropzoneRootProps,
	FileRejection,
	FileWithPath,
	useDropzone,
} from "react-dropzone";

export interface DropzoneProps {
	dropzoneProps?: DropzoneRootProps;
	dropzoneInputProps?: DropzoneInputProps;
	acceptedDescription?: string;
	className?: string;
	onSelectedFile?: (acceptedFiles: readonly FileWithPath[]) => void;
	onRejectionFile?: (fileRejections: readonly FileRejection[]) => void;
}

/**
 * Dropzone Component
 * @props DropzoneProps
 */
const Dropzone = ({
	acceptedDescription,
	dropzoneProps,
	dropzoneInputProps,
	className,
	onSelectedFile,
	onRejectionFile,
}: DropzoneProps) => {
	// Hooks
	const t = useTranslations();
	const { getInputProps, getRootProps } = useDropzone({
		onDrop(acceptedFiles, fileRejections, _event) {
			onSelectedFile && onSelectedFile(acceptedFiles);
			onRejectionFile && onRejectionFile(fileRejections);
		},
	});

	const dropzoneCompareProps = useMemo(() => {
		const defaultProps = getRootProps();
		return {
			...defaultProps,
			...dropzoneProps,
		};
	}, [dropzoneProps, getRootProps]);

	const inputProps = useMemo(() => {
		const defaultProps = getInputProps();
		return {
			...defaultProps,
			...dropzoneInputProps,
		};
	}, [dropzoneInputProps, getInputProps]);

	return (
		<div
			{...dropzoneCompareProps}
			className={clsx(
				className,
				"flex flex-col items-center p-5 rounded-lg border-2 border-dashed outline-none",
				"transition-[border] ease-in-out duration-300",
				"focus:border-primary-500",
				{
					"text-surface-500 dark:text-surface-500 focus:!border-gray-300 cursor-default":
						inputProps.disabled,
					"cursor-pointer text-surface-900 border-surface-400  bg-surface-200 dark:bg-gray-700 dark:border-gray-400":
						!inputProps.disabled,
				}
			)}
		>
			<input {...inputProps} />
			<div className="text-base my-1 text-center">
				<div className="flex gap-2 items-center">
					<FileUp size={14} />
					<p>{t("dropzone.description")}</p>
				</div>
				{acceptedDescription && <p className="mt-1 italic text-sm">({t(acceptedDescription)})</p>}
			</div>
		</div>
	);
};

export default Dropzone;
