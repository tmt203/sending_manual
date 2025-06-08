"use client";

import { useAppProvider } from "@/src/app/app-provider";
import Logo from "@components/ui/logo";
import { Transition } from "@headlessui/react";
import { getBreakpoint } from "@utils/format-value";
import clsx from "clsx";
import * as LucideIcons from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon, LanguageToggle, ProfileDropdownMenu, ThemeToggle } from "../atoms";
import { SidebarMenu } from "../molecules";
import { SidebarMenuProps } from "../molecules/SidebarMenu";

export interface SidebarMenu
	extends Omit<SidebarMenuProps, "expandOnly" | "onToggleSidebar" | "sidebarOpen"> {}

export interface SidebarProps {
	variant?: "default" | "v2";
	menu: SidebarMenu[];
}

export interface Action {
	icon: keyof typeof LucideIcons;
	label: string;
	action?: () => void;
}

/**
 * Sidebar Component
 * @props SidebarComponent
 */
const Sidebar = ({ variant = "default", menu }: SidebarProps) => {
	// Hooks
	const t = useTranslations();

	// Provider
	const { sidebarOpen, setSidebarOpen } = useAppProvider();

	// State
	const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
	const [breakpoint, setBreakpoint] = useState<string | undefined>(getBreakpoint());

	// Ref
	const sidebar = useRef<HTMLDivElement>(null);

	const expandOnly = useMemo(
		() => !sidebarExpanded && (breakpoint === "lg" || breakpoint === "xl"),
		[sidebarExpanded, breakpoint]
	);
	const profiles = useMemo<Action[]>(
		() => [
			{ label: t("profile.account_info"), icon: "UserRoundCog", action: () => {} },
			{
				label: t("profile.logout"),
				icon: "LogOut",
				action: () => {},
			},
		],
		[t]
	);

	/**
	 * Handle breakpoint
	 */
	const handleBreakpoint = useCallback(() => {
		setBreakpoint(getBreakpoint());
	}, []);

	/**
	 * Handle toggle sidebar
	 */
	const handleToggleSidebar = useCallback(() => {
		setSidebarOpen((prev) => !prev);
	}, [sidebarOpen]);

	// Close if the esc key is pressed
	useEffect(() => {
		const handleToggleKeydown = ({ key, ctrlKey }: { key: string; ctrlKey: boolean }) => {
			if (key === "m" && ctrlKey) {
				setSidebarOpen(!sidebarOpen);
			}
		};
		document.addEventListener("keydown", handleToggleKeydown);
		return () => document.removeEventListener("keydown", handleToggleKeydown);
	});

	useEffect(() => {
		window.addEventListener("resize", handleBreakpoint);
		return () => {
			window.removeEventListener("resize", handleBreakpoint);
		};
	}, [breakpoint]);

	return (
		<div className={clsx("group min-w-fit", { "sidebar-expanded": sidebarExpanded })}>
			{/* Sidebar backdrop (mobile only) */}
			<Transition
				as="div"
				className="fixed inset-0 z-40 bg-gray-900 bg-opacity-30 lg:z-auto lg:hidden"
				show={sidebarOpen}
				enter="transition-opacity ease-out duration-200"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity ease-out duration-100"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
				aria-hidden="true"
			/>
			{/* Sidebar */}
			<Transition
				show={sidebarOpen}
				unmount={false}
				as="div"
				id="sidebar"
				ref={sidebar}
				className={clsx(
					"no-scrollbar absolute left-0 top-0 z-40 flex h-[100dvh] w-64 shrink-0 flex-col overflow-y-scroll bg-white p-4 transition-all duration-200 ease-in-out dark:bg-gray-800 lg:static lg:left-auto lg:top-auto lg:!flex lg:translate-x-0 lg:overflow-y-auto",
					{
						"border-r border-gray-200 dark:border-surface-400/30": variant === "v2",
						"rounded-r-2xl shadow-sm": variant === "default",
						"!w-20 hover:!w-64": !sidebarOpen,
					}
				)}
				enterFrom="-translate-x-full"
				enterTo="translate-x-0"
				leaveFrom="translate-x-0"
				leaveTo="-translate-x-full"
			>
				{/* Sidebar header */}
				<div
					className={clsx("mb-3 flex items-center", {
						"justify-between pr-3 sm:px-2": sidebarOpen,
						"justify-center px-0 group-hover:justify-between group-hover:sm:!px-2": !sidebarOpen,
					})}
				>
					<div className="flex items-center gap-2">
						{/* Logo */}
						<Logo />

						{/* Tenant */}
						<div
							className={clsx("transition-all", {
								"block w-10": sidebarOpen,
								"hidden w-0 group-hover:block": !sidebarOpen,
							})}
						>
							<h1 className="text-nowrap font-medium">SNS SERVICE</h1>
							<span className="text-nowrap text-xs font-normal italic">tenant-main.tel4vn.com</span>
						</div>
					</div>

					{/* Close button */}
					<button
						className={clsx("text-gray-500 hover:text-gray-400", {
							"!hidden group-hover:!block": !sidebarOpen,
						})}
						onClick={() => {}}
						aria-controls="sidebar"
						aria-expanded={sidebarOpen}
					>
						<span className="sr-only">Open sidebar</span>
						<Icon name="Menu" size={16} onClick={handleToggleSidebar} />
					</button>
				</div>

				{/* Profile */}
				<div
					className={clsx("mb-3 flex items-center", {
						"justify-between pr-3 sm:px-2": sidebarOpen,
						"justify-center px-0 group-hover:justify-between group-hover:sm:!px-2": !sidebarOpen,
					})}
				>
					<ProfileDropdownMenu sidebarOpen={sidebarOpen} actions={profiles} />

					{/* Notification */}
					<div
						className={clsx("relative", {
							"!hidden group-hover:!block": !sidebarOpen,
						})}
					>
						<Icon name="Bell" size={16} />

						<span className="absolute -right-2 -top-[6px] flex size-[10px] items-center justify-center rounded-full bg-red-500 text-[6px] text-surface-50">
							12
						</span>
					</div>
				</div>

				<div className="space-y-3">
					{/* Pages group */}
					{menu.map((item, index) => {
						return (
							<SidebarMenu
								key={`${item.groupName}-${index}`}
								{...item}
								className="[&_.group-name-header]:group-hover:!block [&_.group-name-icon]:group-hover:!hidden [&_.menu-chevron-down-icon]:group-hover:!block [&_.menu-title]:group-hover:!block [&_.sub-menu-content]:group-hover:!block"
								sidebarOpen={sidebarOpen}
								expandOnly={expandOnly}
								onToggleSidebar={() => setSidebarExpanded(true)}
							/>
						);
					})}
				</div>
				<div className="flex h-full flex-col items-start justify-end">
					{/* Actions group */}
					<ul className="w-full">
						<ThemeToggle sidebarOpen={sidebarOpen} />
						<LanguageToggle>
							<span
								className={clsx(
									"ml-4 text-nowrap font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100",
									{
										"!hidden group-hover:!block": !sidebarOpen,
									}
								)}
							>
								{t("sidebar.language")}
							</span>
						</LanguageToggle>
						<li className="relative mb-0.5 animate-[sidebar-animation_ease-in-out] cursor-pointer rounded-lg bg-[linear-gradient(135deg,var(--tw-gradient-stops))] py-2 pl-4 pr-3 duration-300 last:mb-0">
							<button className="flex items-center justify-between" onClick={handleToggleSidebar}>
								<div className="flex grow items-center">
									<Icon
										size={16}
										strokeWidth={3}
										name={sidebarOpen ? "ArrowLeftFromLine" : "ArrowRightFromLine"}
										className="stroke-secondary-text-color"
									/>
									<span
										className={clsx(
											"ml-4 text-nowrap font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100",
											{
												"!hidden group-hover:!block": !sidebarOpen,
											}
										)}
									>
										{t(sidebarOpen ? "sidebar.collapse" : "sidebar.expand")}
									</span>
								</div>
							</button>
						</li>
					</ul>
				</div>
			</Transition>
		</div>
	);
};
export default Sidebar;
