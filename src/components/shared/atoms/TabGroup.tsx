"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

type TabVariant = "simple" | "underline" | "icons" | "container";

export interface Tab {
	key: string;
	label: string;
	href?: string;
	icon?: React.ReactNode;
	noTranslate?: boolean;
}

export interface TabGroupProps {
	variant: TabVariant;
	tabs: Tab[];
	currentTab: string;
	children: React.ReactNode;
	onChangeTab: (key: string) => void;
}

/**
 * Tabs Component
 */
const TabGroup = ({ variant, tabs, currentTab, children, onChangeTab }: TabGroupProps) => {
	const t = useTranslations();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	/**
	 * Handle change tab
	 * @param key string
	 */
	const handleChangeTab = useCallback(
		(key: string) => () => {
			onChangeTab(key);
		},
		[onChangeTab]
	);

	// Keep current tab when F5 or refresh page
	useEffect(() => {
		if (typeof window !== "undefined" && window.location.hash) {
			onChangeTab(window.location.hash.replace("#", ""));
		}
	}, [pathname, searchParams]);

	return (
		<div className="w-full">
			{/* Area: Tab header */}
			<div className="relative my-4">
				<div
					className="absolute bottom-0 w-full h-px bg-gray-200 dark:bg-gray-700/60"
					aria-hidden="true"
				/>
				<ul className="w-full relative text-sm font-medium flex flex-nowrap -mx-4 sm:-mx-6 lg:-mx-8 overflow-x-scroll no-scrollbar">
					{tabs?.map((tab) => (
						<li
							key={tab.key}
							className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8"
						>
							<a
								href={tab.href ?? "#"}
								className={clsx("block pb-3 whitespace-nowrap", {
									"text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300":
									tab.key === currentTab,
									"text-primary-500": tab.key === currentTab,
									"border-b-2 border-primary-500":
									tab.key === currentTab && variant === "underline",
								})}
								onClick={handleChangeTab(tab.key)}
							>
								{tab.noTranslate ? tab.label : t(tab.label)}
							</a>
						</li>
					))}
				</ul>
			</div>

			{/* Area: Tab content */}
			{children}
		</div>
	);
};

export default TabGroup;
