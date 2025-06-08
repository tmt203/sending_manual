"use client";

import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { CheckIcon, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

export interface StepItem {
	key: string;
	title: string;
	description?: string;
	onClick?: () => void;
	status: "init" | "error" | "completed" | "disabled";
}

export interface StepperItemProps {
	isLast: boolean;
	step: StepItem;
	children?: React.ReactNode;
	currentStep: string;
	setCurrentStep: (step: string) => void;
}

/**
 * Stepper Item Component
 * @props StepperItemProps
 */
const StepperItem = ({ step, isLast, children, currentStep, setCurrentStep }: StepperItemProps) => {
	const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
	const t = useTranslations();

	/**
	 * Handle set current step
	 * @param step string
	 * @param isDisabled booleans
	 */
	const handleStepChange = useCallback(
		(step: string, isDisabled: boolean) => () => {
			if (isDisabled) return;
			setCurrentStep(step);
		},
		[currentStep, setCurrentStep]
	);

	const handleShowTooltip = useCallback(
		(open: boolean) => () => {
			setTooltipOpen(open);
		},
		[setTooltipOpen]
	);

	return (
		<li key={step.key} className="w-full relative flex items-center justify-center">
			<div className="flex flex-col items-center justify-center">
				<div className="relative flex items-center justify-center w-6 h-6 shadow-primary-500 drop-shadow-2xl">
					<button
						className={clsx(
							"absolute top-0 z-10",
							"flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold border",
							"hover:brightness-105 active:scale-x-95 active:scale-y-95 active:brightness-90",
							"bg-white dark:bg-gray-900/60 text-gray-500 dark:text-gray-200",
							{
								"!bg-primary-500 !text-white":
									step.key === currentStep && !["completed", "error"].includes(step.status),
								"!bg-success-500 !text-white": step.status === "completed",
								"!bg-danger-500 !text-white": step.status === "error",
								"drop-shadow-[0_1px_3px_rgb(77_176_219)]": step.key === currentStep,
							}
						)}
						onClick={handleStepChange(step.key, step.status === "disabled")}
					>
						{step.key < currentStep && step.status === "completed" ? (
							<CheckIcon strokeWidth={3} size={14} />
						) : (
							children
						)}
					</button>
				</div>
				<div
					className={clsx("whitespace-nowrap flex gap-1 items-center text-base", {
						"font-semibold text-primary-500":
							step.key === currentStep && !["completed", "error"].includes(step.status),
						"font-semibold text-success-500": step.status === "completed",
						"font-semibold text-danger-500": step.status === "error",
					})}
				>
					{step.description && (
						<button
							className="relative"
							onMouseEnter={handleShowTooltip(true)}
							onMouseLeave={handleShowTooltip(false)}
							onFocus={handleShowTooltip(true)}
							onBlur={handleShowTooltip(false)}
							aria-haspopup="true"
							aria-expanded={tooltipOpen}
							onClick={(e) => e.preventDefault()}
						>
							<Info size={14} strokeWidth={2.5} className="fill-gray-400 stroke-white" />

							<div className="z-10 absolute top-full left-1/2 -translate-x-1/2">
								<Transition
									show={tooltipOpen}
									as="div"
									className="rounded-lg border overflow-hidden shadow-lg px-3 py-2 text-gray-600 bg-white border-gray-200 mt-2 text-left
								dark:bg-gray-800 dark:text-gray-100 dark:border-surface-400/30"
									enter="transition ease-out duration-200 transform"
									enterFrom="opacity-0 -translate-y-2"
									enterTo="opacity-100 translate-y-0"
									leave="transition ease-out duration-200"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
									unmount={false}
								>
									<span className="whitespace-nowrap text-xs font-normal">
										{t(step.description)}
									</span>
								</Transition>
							</div>
						</button>
					)}

					{t(step.title)}
				</div>
			</div>
			{!isLast && (
				<div className="px-4 hidden lg:block absolute w-full left-1/2 top-3">
					<div
						key={`${step.key}-line`}
						aria-hidden="true"
						className={clsx(
							"w-full h-[1px] transition-all duration-300 ease-in-out bg-gray-200 dark:bg-gray-300",
							{
								"!bg-primary-500 dark:!bg-primary-700/60 !h-0.5":
									step.key < currentStep && step.status !== "completed",
								"!bg-success-500 dark:!bg-success-700/60 !h-0.5":
									step.key < currentStep && step.status === "completed",
							}
						)}
					/>
				</div>
			)}
		</li>
	);
};

export default StepperItem;
