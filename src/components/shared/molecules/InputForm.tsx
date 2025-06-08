"use client";

import { Display, Placement, Size } from "@/src/lib/type/common.type";
import clsx from "clsx";
import * as LucideIcons from "lucide-react";
import { Asterisk, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useMemo } from "react";
import Icon from "../atoms/Icon";
import Tooltip from "../atoms/Tooltip";

export type InputType = "text" | "password" | "email" | "number" | "tel" | "url";
type InputState = "default" | "error" | "success" | "warning";

export interface InputFormProps
	extends Omit<
		React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
		"size" | "type"
	> {
	size?: Size;
	label?: string;
	type?: InputType;
	feedback?: string;
	state?: InputState;
	placement?: Display;
	errorMessage?: string;
	noTranslateLabel?: boolean;
	icon?: keyof typeof LucideIcons;
	iconDirection?: Omit<Placement, "center">;
}

/**
 * Input Form component
 * @props InputFormProps
 */
const InputForm = ({
	icon,
	value,
	disabled,
	readOnly,
	className,
	label = "",
	size = "md",
	type = "text",
	feedback = "",
	required = false,
	state = "default",
	placement = "col",
	errorMessage = "",
	iconDirection = "start",
	noTranslateLabel = false,
	onChange,
	...props
}: InputFormProps) => {
	// Hooks
	const t = useTranslations();

	const phoneNumberPattern = useMemo(() => {
		if (["tel", "number"].includes(type)) {
			return "^\\d+$";
		}
		return undefined;
	}, [type]);

	const LucideIcon = useMemo(() => {
		if (!icon) return null;
		return LucideIcons[icon];
	}, [icon]);

	return (
		<div className={clsx("flex w-full flex-col gap-1", className)}>
			<div className={clsx("flex w-full items-center justify-center gap-2", {})}>
				<div
					className={clsx("flex w-full gap-2", {
						"flex-col": placement === "col",
						"flex-row items-center": placement === "row",
					})}
				>
					{/* Area: Label */}
					{label && (
						<div className="flex justify-between gap-2">
							<label className="flex whitespace-nowrap text-base font-semibold" htmlFor={props.id}>
								{noTranslateLabel ? label : t(label)}{" "}
								{required && <Asterisk size={12} className="text-danger-500" />}
							</label>

							{/* Feedback */}
							{feedback && (
								<Tooltip content={t(feedback)} size="full">
									<Info size={18} strokeWidth={2.5} className="fill-surface-600 text-white" />
								</Tooltip>
							)}
						</div>
					)}

					<div className="relative pl-4">
						{/* Icon start placement */}
						{icon && iconDirection === "start" && (
							<div className="pointer-events-none absolute inset-0 right-auto ml-2 flex items-center">
								{LucideIcon ? <Icon name={icon} size={20} /> : null}
							</div>
						)}

						{/* Area: Input  */}
						<input
							{...props}
							id={props.id}
							type={type}
							value={value}
							autoComplete="off"
							readOnly={readOnly}
							pattern={phoneNumberPattern}
							disabled={disabled}
							className={clsx("form-input w-full", {
								"border-danger-500 hover:!border-danger-300 focus:!border-danger-500 dark:border-danger-500":
									errorMessage || state === "error",
								"border-success-500 hover:!border-success-300 focus:!border-success-500 dark:border-success-500":
									state === "success",
								"border-warning-500 hover:!border-warning-300 focus:!border-warning-500 dark:border-warning-500":
									state === "warning",
								"shadow-none disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:border-gray-700 dark:disabled:bg-gray-800 dark:disabled:text-gray-600 dark:disabled:placeholder:text-gray-600":
									disabled,
								"bg-disabled-color/10 dark:!bg-disabled-color/10": readOnly,
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
							onChange={onChange}
						/>

						{/* Icon end placement */}
						{icon && iconDirection === "end" && (
							<div className="pointer-events-none absolute inset-0 left-auto mr-3 flex items-center">
								{LucideIcon ? <Icon name={icon} size={20} /> : null}
							</div>
						)}
					</div>
				</div>
			</div>
			{errorMessage ? <p className="pl-4 text-sm italic text-danger-500">{errorMessage}</p> : null}
		</div>
	);
};

export default InputForm;
