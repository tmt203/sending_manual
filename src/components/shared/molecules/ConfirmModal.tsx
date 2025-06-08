"use client";

import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";

type ConfirmModalState = "success" | "info" | "warning" | "danger";

export interface ConfirmModalProps {
	children?: React.ReactNode;
	isOpen: boolean;
	title?: string;
	state?: ConfirmModalState;
	confirmLabel?: string;
	cancelLabel?: string;
	setIsOpen: (value: boolean) => void;
	onConfirm?: () => void;
	onCancel?: () => void;
}

/**
 * Confirm Modal Component
 * @props ConfirmModalProps
 */
const ConfirmModal = ({
	children,
	isOpen,
	title,
	confirmLabel,
	cancelLabel,
	state = "warning",
	setIsOpen,
	onConfirm,
	onCancel,
}: ConfirmModalProps) => {
	const t = useTranslations();
	const typeIcon = useMemo(() => {
		switch (state) {
			case "warning":
				return (
					<svg
						className="shrink-0 fill-current text-warning-500 opacity-80"
						width="16"
						height="16"
						viewBox="0 0 16 16"
					>
						<path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
					</svg>
				);
			case "danger":
				return (
					<svg
						className="shrink-0 fill-current text-danger-500 opacity-80"
						width="16"
						height="16"
						viewBox="0 0 16 16"
					>
						<path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm3.5 10.1l-1.4 1.4L8 9.4l-2.1 2.1-1.4-1.4L6.6 8 4.5 5.9l1.4-1.4L8 6.6l2.1-2.1 1.4 1.4L9.4 8l2.1 2.1z" />
					</svg>
				);
			case "success":
				return (
					<svg
						className="shrink-0 fill-current text-success-500 opacity-80"
						width="16"
						height="16"
						viewBox="0 0 16 16"
					>
						<path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM7 11.4L3.6 8 5 6.6l2 2 4-4L12.4 6 7 11.4z" />
					</svg>
				);
			default:
				return (
					<svg
						className="shrink-0 fill-current text-info-500 opacity-80"
						width="16"
						height="16"
						viewBox="0 0 16 16"
					>
						<path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zM8 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
					</svg>
				);
		}
	}, [state]);

	/**
	 * Handle cancel
	 */
	const handleCancel = useCallback(() => {
		onCancel && onCancel();
		setIsOpen(false);
	}, [onCancel, setIsOpen]);

	/**
	 * Handle cancel
	 */
	const handleConfirm = useCallback(() => {
		onConfirm && onConfirm();
		setIsOpen(false);
	}, [onConfirm, setIsOpen]);

	return (
		<Transition appear show={isOpen}>
			<Dialog as="div" onClose={() => setIsOpen(false)}>
				<TransitionChild
					as="div"
					className="fixed inset-0 z-50 bg-gray-900 bg-opacity-30 transition-opacity"
					enter="transition ease-out duration-200"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition ease-out duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					aria-hidden="true"
				/>
				<TransitionChild
					as="div"
					className="fixed inset-0 z-50 my-4 flex items-center justify-center overflow-hidden px-4 sm:px-6"
					enter="transition ease-in-out duration-200"
					enterFrom="opacity-0 translate-y-4"
					enterTo="opacity-100 translate-y-0"
					leave="transition ease-in-out duration-200"
					leaveFrom="opacity-100 translate-y-0"
					leaveTo="opacity-0 translate-y-4"
				>
					<DialogPanel className="max-h-full w-full max-w-lg overflow-auto rounded-lg bg-white shadow-lg dark:bg-gray-800">
						<div className="flex space-x-4 p-5">
							{/* Icon */}
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
								{typeIcon}
							</div>
							{/* Content */}
							<div className="flex flex-col gap-4">
								{/* Area: Modal header */}
								<div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
									{title}
								</div>

								{/* Area: Modal content */}
								{children}

								{/* Area: Modal footer */}
								<div className="flex flex-wrap justify-end space-x-2">
									<button
										className="btn-sm h-8 min-w-16 text-nowrap border-gray-200 px-3 py-0 text-gray-800 hover:border-gray-300 dark:border-surface-400/30 dark:text-gray-300 dark:hover:border-gray-600"
										onClick={handleCancel}
									>
										{cancelLabel ?? t("form.cancel")}
									</button>
									<button
										className={clsx(
											"btn-sm h-8 min-w-16 text-nowrap px-3 py-0 font-semibold text-gray-100 hover:brightness-105 active:scale-x-95 active:scale-y-95 active:brightness-90 dark:text-gray-800",
											{
												"bg-info-500 dark:bg-info-100": state === "info",
												"bg-success-500 dark:bg-success-100": state === "success",
												"bg-warning-500 dark:bg-warning-100": state === "warning",
												"bg-danger-500 dark:bg-danger-100": state === "danger",
											}
										)}
										onClick={handleConfirm}
									>
										{confirmLabel ?? t("form.confirm")}
									</button>
								</div>
							</div>
						</div>
					</DialogPanel>
				</TransitionChild>
			</Dialog>
		</Transition>
	);
};

export default ConfirmModal;
