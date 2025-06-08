"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { MouseEvent, ReactNode } from "react";

export type ActionButton = "confirm" | "cancel";

export interface ModalActionProps {
	children?: ReactNode;
	actionButtons?: ActionButton[];
	confirmLabel?: string;
	cancelLabel?: string;
	cancelClassName?: string;
	confirmClassName?: string;
	onCancel?: (event: MouseEvent<HTMLButtonElement>) => void;
	onConfirm?: () => void;
}

/**
 * Modal Action Component
 * @props ModalActionProps
 */
const ModalAction = ({
	children,
	cancelLabel,
	confirmLabel,
	cancelClassName,
	confirmClassName,
	actionButtons = ["confirm", "cancel"],
	onConfirm = () => {},
	onCancel = () => {},
}: ModalActionProps) => {
	const t = useTranslations();
	return (
		<>
			{/* Area: Modal Action */}
			<div className="border-t border-gray-200 px-5 py-4 dark:border-surface-400/30">
				<div className="flex flex-wrap justify-end space-x-2">
					{/* Area: Cancel Button */}
					{actionButtons.includes("cancel") && (
						<button
							type="button"
							className={clsx(
								cancelClassName,
								"btn-sm h-8 min-w-20 text-nowrap border-gray-200 px-3 py-0 text-gray-800 hover:border-gray-300 hover:brightness-105 active:scale-x-95 active:scale-y-95 active:brightness-90 dark:border-surface-400/30 dark:text-gray-300 dark:hover:border-gray-600"
							)}
							onClick={onCancel}
						>
							{cancelLabel ?? t("form.cancel")}
						</button>
					)}

					{/* Area: Children content */}
					{children}

					{/* Area: Confirm Button */}
					{actionButtons.includes("confirm") && (
						<button
							type="button"
							className={clsx(
								confirmClassName,
								"btn-sm h-8 min-w-20 text-nowrap bg-secondary-500 px-3 py-0 text-white hover:brightness-105 active:scale-x-95 active:scale-y-95 active:brightness-90"
							)}
							onClick={onConfirm}
						>
							{confirmLabel ?? t("form.confirm")}
						</button>
					)}
				</div>
			</div>
		</>
	);
};

export default ModalAction;
