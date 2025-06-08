"use client";

import { Display, Placement, Size } from "@/src/lib/type/common.type";
import clsx from "clsx";
import * as LucideIcons from "lucide-react";
import { Asterisk, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useMemo } from "react";
import Icon from "../atoms/Icon";
import Tooltip from "../atoms/Tooltip";

type InputState = "default" | "error" | "success" | "warning" | "disabled" | "readonly";

export interface InputFormProps
	extends Omit<
		React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
		"size" | "type" | "readonly" | "disabled"
	> {
	size?: Size;
	label?: string;
	feedback?: string;
	state?: InputState;
	placement?: Display;
	errorMessage?: string;
	icon?: keyof typeof LucideIcons;
	iconDirection?: Omit<Placement, "center">;
}

/**
 * Input Form component
 * @props InputFormProps
 */
const TimePicker = ({
	icon,
	className,
	label = "",
	size = "md",
	feedback = "",
	required = false,
	state = "default",
	placement = "col",
	errorMessage = "",
	iconDirection = "start",
	...props
}: InputFormProps) => {
	// Hooks
	const t = useTranslations();

	const LucideIcon = useMemo(() => {
		if (!icon) return null;
		return LucideIcons[icon];
	}, [icon]);

	return (
		<div className={clsx("flex flex-col gap-1 relative", className)}>
			<div className="flex gap-2 items-center justify-center w-full">
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
									<Info size={16} strokeWidth={2.5} className="text-white fill-surface-600" />
								</Tooltip>
							)}
						</div>
					)}

					<div className="relative">
						{/* Icon start placement */}
						{icon && iconDirection === "start" && (
							<div className="absolute inset-0 right-auto flex items-center pointer-events-none ml-2">
								{LucideIcon ? <Icon name={icon} size={20} /> : null}
							</div>
						)}

						{/* Area: Input  */}
						<input
							{...props}
							type="time"
							autoComplete="off"
							readOnly={state === "readonly"}
							disabled={state === "disabled"}
							className={clsx("form-input w-full min-w-32", {
								"border-danger-500 focus:!border-danger-500 hover:!border-danger-300 dark:border-danger-500":
									errorMessage || state === "error",
								"border-success-500 focus:!border-success-500 hover:!border-success-300 dark:border-success-500":
									state === "success",
								"border-warning-500 focus:!border-warning-500 hover:!border-warning-300 dark:border-warning-500":
									state === "warning",
								"bg-disabled-color/30 dark:!bg-disabled-color/30": state === "disabled",
								"bg-disabled-color/10 dark:!bg-disabled-color/10": state === "readonly",
								"pl-9": icon && iconDirection === "start",
								"pr-9": icon && iconDirection === "end",
								"h-6 text-sm": size === "2xs",
								"h-7 text-base": size === "xs",
								"h-8 text-base": size === "sm",
								"h-9 text-base": size === "md",
								"h-10 text-base": size === "lg",
								"h-11 text-lg": size === "xl",
								"h-12 text-xl": size === "2xl",
							})}
						/>

						{/* Icon end placement */}
						{icon && iconDirection === "end" && (
							<div className="absolute inset-0 left-auto flex items-center pointer-events-none mr-3">
								{LucideIcon ? <Icon name={icon} size={20} /> : null}
							</div>
						)}
					</div>
				</div>
			</div>
			{errorMessage ? (
				<p
					className={clsx("text-sm italic text-nowrap absolute text-danger-500", {
						"top-6": size === "2xs",
						"top-7": size === "xs",
						"top-8": size === "sm",
						"top-9": size === "md",
						"top-10": size === "lg",
						"top-11": size === "xl",
						"top-12": size === "2xl",
					})}
				>
					{errorMessage}
				</p>
			) : null}
		</div>
	);
};

export default TimePicker;
