"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Variant } from "@type/common.type";
import clsx from "clsx";
import { ChevronDown, LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export type ActionMenuItem = {
	key: string;
	label: string;
	disabled?: boolean;
	icon: LucideIcon;
	variant?: Variant;
	action?: () => void;
};

export interface ActionMenuProps {
	label: string;
	actions: ActionMenuItem[];
}

/**
 * Actions Menu Component
 * @prop ActionMenuProps
 */
const ActionMenu = ({ label, actions }: ActionMenuProps) => {
	const t = useTranslations();
	return (
		<Menu as="div" className="relative inline-flex">
			{({ open }) => (
				<>
					<MenuButton className="btn rounded-md !py-0 justify-between min-w-[5.5rem] bg-white dark:bg-gray-800 border-gray-200 dark:border-surface-400/30 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100">
						{t(label)}
						<ChevronDown
							size={16}
							strokeWidth={3}
							className={clsx(
								"shrink-0 ml-1 text-gray-400 dark:text-gray-500 transition-all duration-300",
								{
									"rotate-180": open,
								}
							)}
						/>
					</MenuButton>

					<MenuItems
						transition
						anchor="bottom end"
						className="font-medium mt-1 text-sm z-[99] text-gray-600 dark:text-gray-300 focus:outline-none w-fit bg-white dark:bg-gray-800 border border-gray-200 dark:border-surface-400/30 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1s"
					>
						{actions.map((item) => (
							<MenuItem as="div" key={item.key} disabled={item.disabled} className="group px-1.5">
								<button
									disabled={item.disabled}
									className={clsx("flex w-full items-center gap-2 rounded py-1.5 px-3", {
										"text-primary-500": item.variant === "primary",
										"text-info-500": item.variant === "info",
										"text-danger-500": item.variant === "danger",
										"text-success-500": item.variant === "success",
										"text-warning-500": item.variant === "warning",
										"bg-gray-300 cursor-default": item.disabled,
										"group-hover:dark:bg-white/10 group-hover:bg-primary-500/10": !item.disabled,
									})}
									onClick={item.action}
								>
									<item.icon size={14} />
									{t(item.label)}
								</button>
							</MenuItem>
						))}
					</MenuItems>
				</>
			)}
		</Menu>
	);
};

export default ActionMenu;
