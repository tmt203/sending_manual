"use client";

import { Variant } from "@type/common.type";
import clsx from "clsx";
import { useTranslations } from "next-intl";

export interface RadioProps
	extends Omit<
		React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
		"type"
	> {
	label?: string;
	variant?: Variant;
}

/**
 * Radio Component
 * @props RadioProps
 */
const Radio = ({ className, variant, label, ...props }: RadioProps) => {
	const t = useTranslations();

	return (
		<label className={clsx(className, "flex gap-2 items-center")}>
			<input
				{...props}
				type="radio"
				className={clsx({
					"text-primary-500 focus:ring-primary-500 checked:!bg-primary-500 checked:border-primary-500":
						variant === "primary",
					"text-secondary-500 focus:ring-secondary-500 checked:!bg-secondary-500 checked:border-secondary-500":
						variant === "secondary",
					"text-success-500 focus:ring-success-500 checked:!bg-success-500 checked:border-success-500":
						variant === "success",
					"text-info-500 focus:ring-info-500 checked:!bg-info-500 checked:border-info-500":
						variant === "info",
					"text-warning-500 focus:ring-warning-500 checked:!bg-warning-500 checked:border-warning-500":
						variant === "warning",
					"text-danger-500 focus:ring-danger-500 checked:!bg-danger-500 checked:border-danger-500":
						variant === "danger",
				})}
			/>
			{label && (
				<span className="whitespace-nowrap flex text-base font-semibold">{t(label)}</span>
			)}
		</label>
	);
};

export default Radio;
