"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { SelectOption } from "@type/common.type";
import clsx from "clsx";
import { Check, ChevronDown } from "lucide-react";
import { useCallback } from "react";

const PAGE_SIZE_OPTIONS: SelectOption[] = [
	{
		value: "5",
		label: "5",
	},
	{
		value: "10",
		label: "10",
	},
	{
		value: "20",
		label: "20",
	},
	{
		value: "50",
		label: "50",
	},
	{
		value: "100",
		label: "100",
	},
];

export interface PageSizeDropdownProps {
	pagesize?: number;
	onSetPageSize: (value: number) => void;
}

/**
 * Page Size Dropdown Component
 * @props PageSizeDropdownProps
 * @returns
 */
const PageSizeDropdown = ({ pagesize = 50, onSetPageSize }: PageSizeDropdownProps) => {
	/**
	 * Handle set page size
	 * @param value number
	 */
	const handleSetPageSize = useCallback(
		(value: number) => () => {
			onSetPageSize(value);
		},
		[onSetPageSize]
	);

	return (
		<Menu as="div" className="relative inline-flex">
			{({ open }) => (
				<>
					{/* Area: Page Size Dropdown Button */}
					<MenuButton
						className="btn min-w-[5.5rem] justify-between border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-800 dark:border-surface-400/30 dark:bg-surface-300/5 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-100"
						aria-label="Select date range"
					>
						<span className="flex items-center">
							<svg
								className="mr-2 shrink-0 fill-current text-gray-400 dark:text-gray-500"
								width="16"
								height="16"
								viewBox="0 0 16 16"
							>
								<path d="M5 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z" />
								<path d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4ZM2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z" />
							</svg>
							<span>{pagesize}</span>
						</span>

						{/* Area: Caret */}
						<ChevronDown
							size={16}
							strokeWidth={3}
							className={clsx("ml-1 shrink-0 text-gray-400 transition-all dark:text-gray-500", {
								"rotate-180": open,
							})}
						/>
					</MenuButton>

					{/* Area: Dropdown */}

					<MenuItems
						transition
						anchor="bottom start"
						className="z-[99] mt-1 w-20 overflow-hidden rounded-lg border border-gray-200 bg-white py-1.5 text-sm font-medium text-gray-600 shadow-lg focus:outline-none dark:border-surface-400/30 dark:bg-gray-800 dark:text-gray-300"
					>
						{PAGE_SIZE_OPTIONS.map((option) => (
							<MenuItem key={`page-size-${option.label}`}>
								{({ focus }) => (
									<button
										className={`flex w-full cursor-pointer items-center gap-2 px-3 py-1 ${focus ? "bg-gray-50 dark:bg-gray-700/20" : ""} ${Number(option.value) === pagesize && "text-primary-500"}`}
										onClick={handleSetPageSize(Number(option.value))}
									>
										<Check
											size={12}
											strokeWidth={4}
											className={clsx("text-primary-500", {
												invisible: Number(option.value) !== pagesize,
											})}
										/>
										<span>{option.label}</span>
									</button>
								)}
							</MenuItem>
						))}
					</MenuItems>
				</>
			)}
		</Menu>
	);
};

export default PageSizeDropdown;
