"use client";

import clsx from "clsx";
import { useCallback, useState } from "react";
import StepperItem, { StepItem } from "../atoms/StepperItem";

export interface StepperProps {
	currentStep: string;
	steps: StepItem[];
	className?: string;
	onStepChange: (step: string) => void;
}

/**
 * Stepper Component
 * @props StepperProps
 */
const Stepper = ({ currentStep, steps, className, onStepChange }: StepperProps) => {
	return (
		<div className={clsx("mx-auto w-full", className)}>
			<ul className="relative flex justify-around items-center w-full mt-1">
				{steps.map((step, index) => (
					<StepperItem
						key={`stepper-item-${step.key}`}
						step={step}
						isLast={index === steps.length - 1}
						currentStep={currentStep}
						setCurrentStep={onStepChange}
					>
						{index + 1}
					</StepperItem>
				))}
			</ul>
		</div>
	);
};

export default Stepper;
