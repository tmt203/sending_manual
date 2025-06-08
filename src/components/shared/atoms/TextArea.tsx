"use client";

import { Display } from "@/src/lib/type/common.type";
import clsx from "clsx";
import * as LucideIcons from "lucide-react";
import { Asterisk, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { DetailedHTMLProps, TextareaHTMLAttributes } from "react";
import Tooltip from "./Tooltip";

type InputState = "default" | "error" | "success" | "warning";

export interface TextAreaProps
	extends Omit<
		DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>,
		"size"
	> {
	label?: string;
	feedback?: string;
	state?: InputState;
	placement?: Display;
	errorMessage?: string;
	icon?: keyof typeof LucideIcons;
}

/**
 * TextArea component
 * @props TextAreaProps
 */
const TextArea = ({
	value,
	disabled,
	readOnly,
	className,
	label = "",
	feedback = "",
	required = false,
	state = "default",
	placement = "col",
	errorMessage = "",
	onChange,
	...props
}: TextAreaProps) => {
	// Hooks
	const t = useTranslations();

	return (
		<div className={clsx("flex flex-col gap-1 w-full", className)}>
			<div className={clsx("flex gap-2 items-center justify-center w-full", {})}>
				<div
					className={clsx("flex gap-2 w-full", {
						"flex-col": placement === "col",
						"flex-row items-center": placement === "row",
					})}
				>
					{/* Area: Label */}
					{label && (
						<div className="flex gap-2 justify-between">
							<label className="whitespace-nowrap flex text-base font-semibold">
								{t(label)} {required && <Asterisk size={12} className="text-danger-500" />}
							</label>

							{/* Feedback */}
							{feedback && (
								<Tooltip content={t(feedback)} size="full">
									<Info size={18} strokeWidth={2.5} className="text-white fill-surface-600" />
								</Tooltip>
							)}
						</div>
					)}

					<div className="relative pl-4">
						{/* Area: Input  */}
						<textarea
							{...props}
							value={value}
							autoComplete="off"
							readOnly={readOnly}
							disabled={disabled}
							className={clsx("form-textarea w-full", {
								"border-danger-500 focus:!border-danger-500 hover:!border-danger-300 dark:border-danger-500":
									errorMessage || state === "error",
								"border-success-500 focus:!border-success-500 hover:!border-success-300 dark:border-success-500":
									state === "success",
								"border-warning-500 focus:!border-warning-500 hover:!border-warning-300 dark:border-warning-500":
									state === "warning",
								"dark:disabled:placeholder:text-gray-600 disabled:border-gray-200 dark:disabled:border-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed shadow-none":
									disabled,
								"bg-disabled-color/10 dark:!bg-disabled-color/10": readOnly,
							})}
							onChange={onChange}
						/>
					</div>
				</div>
			</div>
			{errorMessage ? <p className="text-sm italic text-danger-500 pl-4">{errorMessage}</p> : null}
		</div>
	);
};

export default TextArea;
