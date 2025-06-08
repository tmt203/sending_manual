"use client";

import { Size, Variant } from "@/src/lib/type/common.type";
import { Content, Portal, Root, Trigger } from "@radix-ui/react-popover";
import clsx from "clsx";
import * as LucideIcons from "lucide-react";
import { Loader } from "lucide-react";
import { ButtonHTMLAttributes, DetailedHTMLProps, MouseEvent, useMemo, useState } from "react";
import Icon from "../atoms/Icon";

type ButtonRounded = Omit<Size, "2xs" | "xs">;

export interface IconButtonProps
	extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	icon: keyof typeof LucideIcons;
	iconSize?: number;
	size?: Size;
	variant?: Variant;
	outline?: boolean;
	className?: string;
	rounded?: ButtonRounded;
	isLoading?: boolean;
	showTooltip?: boolean;
	tooltipContent?: string;
	type?: "button" | "submit" | "reset";
	onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * IconButton config state
 * @param state ButtonStates
 */
const getStateClassNames = (outline: boolean, disabled?: boolean, isLoading?: boolean) => {
	return {
		"!bg-disabled-color pointer-events-none": disabled && !outline,
		"!bg-white !text-disabled-color border !border-disabled-color pointer-events-none":
			disabled && outline,
		"pointer-events-none": isLoading,
	};
};

/**
 * IconButton config variant
 * @param variant Variant
 */
const getVariantClassNames = (variant: Variant, outline: boolean) => {
	return {
		"bg-primary-500 text-white": variant === "primary" && !outline,
		"bg-secondary-500 text-white": variant === "secondary" && !outline,
		"bg-success-500 text-white": variant === "success" && !outline,
		"bg-info-500 text-white": variant === "info" && !outline,
		"bg-warning-500 text-white": variant === "warning" && !outline,
		"bg-danger-500 text-white": variant === "danger" && !outline,
		"bg-surface-500 text-white": variant === "surface" && !outline,
	};
};

/**
 * IconButton config outline
 * @param outline boolean
 */
const getOutlineClassNames = (variant: Variant, outline: boolean) => {
	return {
		"bg-white dark:bg-surface-300/5 border border-primary-500 dark:border-primary-700/60 text-primary-500":
			outline && variant === "primary",
		"bg-white dark:bg-surface-300/5 border border-secondary-500 dark:border-secondary-700/60 text-secondary-500":
			outline && variant === "secondary",
		"bg-white dark:bg-surface-300/5 border border-success-500 dark:border-success-700/60 text-success-500":
			outline && variant === "success",
		"bg-white dark:bg-surface-300/5 border border-info-500 dark:border-info-700/60 text-info-500":
			outline && variant === "info",
		"bg-white dark:bg-surface-300/5 border border-warning-500 dark:border-warning-700/60 text-warning-500":
			outline && variant === "warning",
		"bg-white dark:bg-surface-300/5 border border-danger-500 dark:border-danger-700/60 text-danger-500":
			outline && variant === "danger",
		"bg-white dark:bg-surface-300/5 border border-surface-700 dark:border-surface-700/60 text-surface-700":
			outline && variant === "surface",
	};
};

/**
 * IconButton config rounded
 * @param rounded ButtonRounded
 */
const getRoundedClassNames = (rounded: ButtonRounded) => {
	return {
		"rounded-sm": rounded === "sm",
		"rounded-md": rounded === "md",
		"rounded-lg": rounded === "lg",
		"rounded-xl": rounded === "xl",
		"rounded-2xl": rounded === "2xl",
		"rounded-full": rounded === "full",
	};
};

/**
 * IconButton config size
 * @param size Size
 */
const getSizeClassNames = (size: Size) => {
	return {
		"size-6 text-sm": size === "2xs",
		"size-7 text-base": size === "xs",
		"size-8 text-base": size === "sm",
		"size-9 text-base": size === "md",
		"size-10 text-lg": size === "lg",
		"size-11 text-lg": size === "xl",
		"size-12 text-2xl": size === "2xl",
	};
};

/**
 * IconButton config classnames
 * @param size Size
 * @param outline boolean
 * @param variant Variant
 * @param className string
 * @param state ButtonStates
 * @param rounded ButtonRounded
 * @returns string
 */
const getIconButtonClassNames = (
	className: string,
	outline: boolean,
	variant: Variant,
	rounded: ButtonRounded,
	size: Size,
	isLoading?: boolean,
	disabled?: boolean
) => {
	return clsx(
		className,
		"btn p-0 hover:brightness-105 active:scale-x-95 active:scale-y-95 active:brightness-90",
		getStateClassNames(outline, disabled, isLoading),
		getVariantClassNames(variant, outline),
		getOutlineClassNames(variant, outline),
		getRoundedClassNames(rounded),
		getSizeClassNames(size)
	);
};

/**
 * IconButton component
 * @param props IconButtonProps
 * @returns JSX.Element
 */
const IconButton = ({
	icon,
	iconSize = 14,
	size = "md",
	className = "",
	isLoading = false,
	outline = false,
	variant = "primary",
	type = "button",
	rounded = "md",
	disabled,
	showTooltip = true,
	tooltipContent = "",
	onClick = () => {},
}: IconButtonProps) => {
	const [open, setOpen] = useState<boolean>(false);

	/**
	 * Handle mouse enter
	 */
	const handleMouseEnter = () => {
		setOpen(true);
	};

	/**
	 * Handle mouse leave
	 */
	const handleMouseLeave = () => {
		setOpen(false);
	};

	// Render button element
	const ButtonElement = useMemo(() => {
		const computedClassName = getIconButtonClassNames(
			className,
			outline,
			variant,
			rounded,
			size,
			isLoading,
			disabled
		);

		return (
			<button
				type={type}
				disabled={disabled}
				className={computedClassName}
				onClick={onClick}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				{isLoading ? (
					<div className="mr-2">
						<Loader className="animate-spin shrink-0" size={iconSize} />
					</div>
				) : null}
				<Icon name={icon} size={iconSize} color="currentColor" strokeWidth={3} />
			</button>
		);
	}, [
		type,
		disabled,
		className,
		outline,
		variant,
		rounded,
		size,
		isLoading,
		icon,
		iconSize,
		onClick,
		handleMouseEnter,
		handleMouseLeave,
	]);

	// Show tooltip
	if (showTooltip && tooltipContent) {
		return (
			<Root open={open} onOpenChange={setOpen}>
				<Trigger asChild>
					<div className="relative inline-flex items-center justify-center">{ButtonElement}</div>
				</Trigger>

				<Portal>
					<Content
						side="top"
						sideOffset={6}
						align="center"
						alignOffset={0}
						className="z-50 px-2 py-1 text-sm text-black bg-white border border-gray-200 dark:text-white  dark:bg-black rounded shadow-lg w-max"
					>
						{tooltipContent}
					</Content>
				</Portal>
			</Root>
		);
	}

	return ButtonElement;
};

export default IconButton;
