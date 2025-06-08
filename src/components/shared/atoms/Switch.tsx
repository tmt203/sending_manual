"use client";

import { Placement, Size, Variant } from "@type/common.type";
import clsx from "clsx";
import { useTranslations } from "next-intl";

export interface SwitchProps
	extends Omit<
		React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
		"size" | "type"
	> {
	size?: Size;
	variant?: Variant;
	label?: string;
	display?: Omit<Placement, "center">;
}

/**
 * Switch Component
 * @props SwitchProps
 */
const Switch = ({
	label,
	size = "md",
	display = "end",
	variant = "primary",
	className,
	...props
}: SwitchProps) => {
	const t = useTranslations();

	return (
		<div className={clsx("flex items-center", className)}>
			{/* Area: Label Display Start */}
			{display === "start" && (
				<div className="mr-4 text-base font-semibold dark:text-gray-500">{t(label)}</div>
			)}

			<div className="relative w-11 select-none">
				<input {...props} type="checkbox" id={props.id} className="peer sr-only" />
				<label
					className={clsx("block rounded-full bg-gray-400 dark:bg-gray-700", {
						// Variant
						"peer-checked:!bg-primary-500": variant == "primary",
						"peer-checked:!bg-secondary-500": variant == "secondary",
						"peer-checked:!bg-success-500": variant == "success",
						"peer-checked:!bg-info-500": variant == "info",
						"peer-checked:!bg-warning-500": variant == "warning",
						"peer-checked:!bg-danger-500": variant == "danger",

						// Size
						"h-5 peer-checked:[&>span:first-child]:!left-7": size === "sm",
						"h-6 peer-checked:[&>span:first-child]:!left-6": size === "md",
						"h-7 peer-checked:[&>span:first-child]:!left-5": size === "lg",
					})}
					htmlFor={props.id}
				>
					<span
						className={clsx(
							"block rounded-full bg-white shadow-sm transition-all duration-300 ease-in-out",
							{
								"absolute left-1 top-1 h-3 w-3": size === "sm",
								"absolute left-1 top-1 h-4 w-4": size === "md",
								"absolute left-1 top-1 h-5 w-5": size === "lg",
							}
						)}
						aria-hidden="true"
					/>
					<span className="sr-only">Switch label</span>
				</label>
			</div>

			{/* Area: Label Display End */}
			{display === "end" && (
				<div className="ml-4 text-base font-semibold dark:text-gray-500">{t(label)}</div>
			)}
		</div>
	);
};

export default Switch;
