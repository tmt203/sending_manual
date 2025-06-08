"use client";

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { X } from "lucide-react";
import { useCallback, useEffect } from "react";

export interface NotifyModalProps {
	children?: React.ReactNode;
	title: string;
	isOpen: boolean;
	type: "success" | "error" | "warning" | "info";
	setIsOpen: (value: boolean) => void;
	duration?: number;
}

const typeColors = {
	success: "bg-green-600 hover:bg-green-500 text-white",
	error: "bg-red-600 hover:bg-red-500 text-white",
	warning: "bg-yellow-600 hover:bg-yellow-500 text-white",
	info: "bg-blue-600 hover:bg-blue-500 text-white",
};

const NotifyModal = ({ children, title, isOpen, type, setIsOpen, duration }: NotifyModalProps) => {
	const handleOutsideClick = useCallback(() => {
		setIsOpen(false);
	}, [setIsOpen]);

	const handleCloseModal = useCallback(
		(event: React.MouseEvent) => {
			event.stopPropagation();
			setIsOpen(false);
		},
		[setIsOpen]
	);

	useEffect(() => {
		if (isOpen && duration) {
			const timer = setTimeout(() => setIsOpen(false), duration);
			return () => clearTimeout(timer);
		}
	}, [isOpen, duration, setIsOpen]);

	return (
		<Transition appear show={isOpen}>
			<Dialog as="div" onClose={handleOutsideClick}>
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
						<div className="border-b border-gray-200 px-5 py-3 dark:border-surface-400/30">
							<div className="flex items-center justify-between">
								<DialogTitle className="font-semibold text-gray-800 dark:text-gray-100">
									{title}
								</DialogTitle>
								<button
									className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
									onClick={handleCloseModal}
								>
									<div className="sr-only">Close</div>
									<X size={20} />
								</button>
							</div>
						</div>

						{children}

						<div className="px-5 py-4">
							<div className="flex flex-wrap justify-end space-x-2">
								<button className={`btn-sm ${typeColors[type]}`} onClick={handleCloseModal}>
									OK
								</button>
							</div>
						</div>
					</DialogPanel>
				</TransitionChild>
			</Dialog>
		</Transition>
	);
};
export default NotifyModal;
