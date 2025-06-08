"use client";

import { Transition } from "@headlessui/react";
import { SearchParams } from "@type/common.type";
import clsx from "clsx";
import { formatISO } from "date-fns";
import { Filter, FilterX, Loader, RefreshCcw, X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
	ChangeEvent,
	ChangeEventHandler,
	KeyboardEvent,
	MouseEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { DateRange } from "react-day-picker";
import { Icon } from "../atoms";
import RangeDatePicker from "../atoms/RangeDatePicker";
import { FilterItemConfig } from "./Filter";

export interface FilterDrawerProps {
	id: string;
	open?: boolean;
	className?: string;
	param: Record<string, any>;
	filters: Record<string, FilterItemConfig>;
	toggle?: (open: boolean) => void;
	onFilter: () => void;
	onParamChange: (value: Record<string, any>) => void;
}

/**
 * Render Search Input
 * @param open boolean
 * @param value FilterItemConfig
 */
const RenderFilterSelect = (
	param: Record<string, any>,
	value: FilterItemConfig,
	handleSingleFilterChange: (key: string, value: string) => ChangeEventHandler<HTMLInputElement>,
	handleMultiFIlterChange: (key: string, value: string) => ChangeEventHandler<HTMLInputElement>,
	key: string = "",
	open: boolean = false
) => {
	const t = useTranslations();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [searchParams, setSearchParams] = useState<SearchParams>({
		searchOffset: 0,
		limit: 0,
		key: "",
	});

	/**
	 * Handle debounce filter
	 * @param event ChangeEvent<HTMLInputElement>
	 */
	const handleDebounceFilter = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const target = event.target;
			const { value: dataSearch } = target;
			const newParams: SearchParams = {
				...searchParams,
				key: dataSearch,
				searchOffset: 0,
			};

			setSearchParams(newParams);
			value.onDebounceFilter && value.onDebounceFilter(newParams);
		},
		[value.onDebounceFilter]
	);

	/**
	 * Handle load more
	 */
	const handleLoadMore = useCallback(() => {
		const newParams: SearchParams = {
			...searchParams,
			searchOffset: searchParams.searchOffset + 10,
		};
		setSearchParams(newParams);
		value.onDebounceFilter && value.onDebounceFilter(newParams);
	}, [value.onDebounceFilter, searchParams]);

	// Update loading state
	useEffect(() => {
		if (!value.options) return;
		if (searchParams.searchOffset >= value.options?.length) {
			setIsLoading(true);
		} else {
			setIsLoading(false);
		}
	}, [value.options, searchParams.searchOffset]);

	return (
		<>
			{/* Area: Search Input */}
			{value.onDebounceFilter && (
				<div className="relative px-3 pb-2">
					{/* Area: Input  */}
					<input
						id={key}
						name={key}
						key={key}
						type="text"
						autoComplete="off"
						placeholder="Search..."
						className="form-input h-8 w-full pr-9 text-base"
						onChange={handleDebounceFilter}
					/>

					{/* Icon end placement */}
					<div className="pointer-events-none absolute inset-0 left-auto ml-3 flex items-center">
						{value.isLoading ? (
							<div className="mr-2">
								<Loader className="shrink-0 animate-spin" size={20} />
							</div>
						) : null}
					</div>
				</div>
			)}

			{/* Area: Filter select */}
			{value.type === "select" && value.options && (
				<ul className="scrollbar-thin max-h-60 overflow-auto">
					{value.options.length ? (
						value.options.map((option, optionIndex) => (
							<li key={`${option.value}-${optionIndex}`} className="px-3 py-1">
								<label className="flex items-center">
									<input
										type="radio"
										className="form-radio"
										name={key}
										checked={param[key] === option.value}
										onChange={handleSingleFilterChange(key, option.value)}
									/>
									<span className="ml-2 text-sm font-medium">
										{option.noTranslate ? t(option.label) : option.label}
									</span>
								</label>
							</li>
						))
					) : (
						<li className="mt-2 text-center text-sm">{t("filter_component.no_data")}</li>
					)}
				</ul>
			)}

			{/* Area: Filter Multi */}
			{value.type === "multiple" && value.options && (
				<ul className="scrollbar-thin max-h-60 overflow-auto">
					{value.options.length ? (
						value.options.map((option, optionIndex) => (
							<li key={`${option.value}-${optionIndex}`} className="px-3 py-1">
								<label className="flex items-center">
									<input
										type="checkbox"
										className="form-checkbox"
										checked={(param[key] || []).includes(option.value)}
										onChange={handleMultiFIlterChange(key, option.value)}
									/>
									<span className="ml-2 text-sm font-medium">
										{option.noTranslate ? t(option.label) : option.label}
									</span>
								</label>
							</li>
						))
					) : (
						<li className="mt-2 text-center text-sm">{t("filter_component.no_data")}</li>
					)}
				</ul>
			)}

			{/* Area: Load More Button */}
			{value.onDebounceFilter && (
				<div className="flex items-center justify-center">
					{value.loadMore &&
						(isLoading ? (
							<Loader className="shrink-0 animate-spin" size={20} />
						) : (
							<button
								onClick={handleLoadMore}
								className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500"
							>
								{t("filter_component.load_more")}
							</button>
						))}
				</div>
			)}
		</>
	);
};

/**
 * Filter Drawer Component
 * @props
 */
const FilterDrawer = ({
	id,
	open,
	param,
	filters,
	className,
	toggle,
	onFilter,
	onParamChange,
}: FilterDrawerProps) => {
	// Hooks
	const t = useTranslations();

	// State
	const [openDrawer, setOpenDrawer] = useState<boolean>(open ?? false);

	// UseRef
	const clearDateButtonRef = useRef<HTMLButtonElement>(null); // Ref for trigger clear date button

	/**
	 * Handle toggle filter drawer
	 */
	const toggleDrawer = useCallback(() => {
		setOpenDrawer(!openDrawer);
		toggle && toggle(openDrawer);
	}, [openDrawer, toggle]);

	/**
	 * Handle run Filter
	 * @param close void
	 */
	const handleFilterData = useCallback(() => {
		onFilter && onFilter();
		toggleDrawer();
	}, [onFilter, toggleDrawer]);

	/**
	 * Handle Input Filter change (Filter type `text` | `number` | `range-number`)
	 * @param key string
	 * @param event ChangeEvent
	 */
	const handleChangeFilter = useCallback(
		(key: string) => (event: ChangeEvent) => {
			const target = event.target as HTMLInputElement;
			if (!target) return;
			const value = target.value;
			const newParam = {
				...param,
				[key]: value,
			};
			onParamChange(newParam);
		},
		[param, onParamChange]
	);

	/**
	 * Handle Multi Filter change
	 * @param key string
	 * @param value string
	 * @param event ChangeEvent
	 */
	const handleMultiFilterChange = useCallback(
		(key: string, value: string) => (event: ChangeEvent<HTMLInputElement>) => {
			let newValue: string[] = [];
			const target = event.target;
			const listParam = param[key] ? param[key].split(",") : [];
			const addNewValue = [...listParam, value];
			const removeExistValue = listParam.filter((item: string) => item !== value);
			if (!target) return;
			newValue = target.checked ? addNewValue : removeExistValue;
			const newParam = {
				...param,
				[key]: newValue.join(","),
			};
			onParamChange(newParam);
		},
		[param, onParamChange]
	);

	/**
	 * Handle Single Filter change
	 * @param key string
	 * @param value string
	 * @param event ChangeEvent
	 */
	const handleSingleFilterChange = useCallback(
		(key: string, value: string) => (event: ChangeEvent) => {
			const target = event.target as HTMLInputElement;
			if (!target?.checked) return;
			const newParam = {
				...param,
				[key]: value,
			};
			onParamChange(newParam);
		},
		[param, onParamChange]
	);

	/**
	 * Handle Date Filter change
	 * @param key string
	 * @param date DateRange
	 */
	const handleDateFilterChange = useCallback(
		(key: string) => (data?: DateRange) => {
			if (!data) return;
			let newParam: Record<string, any>;
			if (!data.from || !data.to) {
				newParam = Object.entries(param).filter(([keyParam, _]) => keyParam !== key);
			} else {
				newParam = {
					...param,
					[`${filters[key].keyStart}`]: formatISO(data.from, { representation: "complete" }),
					[`${filters[key].keyEnd}`]: formatISO(new Date(data.to).setHours(23, 59, 59, 999), {
						representation: "complete",
					}),
				};
			}

			onParamChange(newParam);
		},
		[param, onParamChange]
	);

	/**
	 * Handle refresh filter
	 */
	const handleRefreshFilter = useCallback(
		(key: string) => (event: MouseEvent<SVGSVGElement>) => {
			event.stopPropagation();
			let newParam = {
				...param,
				[key]: "",
			};

			// Remove empty/null/undefined param
			newParam = Object.fromEntries(Object.entries(newParam).filter(([_key, value]) => value));
			onParamChange(newParam);
		},
		[param, onParamChange]
	);

	/**
	 * Handle clear data filter
	 */
	const handleClearDataFilter = useCallback(() => {
		param = {};
		clearDateButtonRef.current && clearDateButtonRef.current.click();
		onParamChange(param);
		onFilter && onFilter();
	}, [param, onParamChange, onFilter]);

	/**
	 * Handle Keydown for run Filter
	 * @param close () => void
	 * @param event KeyboardEvent<HTMLInputElement>
	 */
	const handleKeydownFilter = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			if (event.key === "Enter") {
				onFilter && onFilter();
			}
		},
		[onFilter]
	);

	return (
		<>
			<button
				className="btn h-8 text-nowrap rounded-md border border-gray-200 bg-white px-2 py-1 text-sm shadow hover:border-gray-300 hover:text-gray-800 hover:brightness-105 focus-visible:outline-0 active:scale-x-95 active:scale-y-95 active:brightness-90 dark:border-surface-400/30 dark:bg-surface-300/5 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-100"
				onClick={toggleDrawer}
			>
				<Filter size={14} className="mr-2" />
				{t("filter_drawer.more_filter")}
			</button>

			<Transition
				id={`${id}-filter-drawer`}
				as="div"
				show={true}
				unmount={false}
				enterTo="translate-x-0"
				leaveFrom="translate-x-0"
				leaveTo="-translate-x-full"
				enterFrom="-translate-x-full"
				className={clsx(
					"fixed right-0 top-0 z-50 flex h-[100dvh] flex-col overflow-y-scroll shadow-lg lg:!flex lg:translate-x-0",
					"no-scrollbar w-96 shrink-0 bg-white transition-all duration-500 ease-in-out dark:border-l dark:border-surface-400/30 dark:bg-gray-800 lg:overflow-y-auto",
					{ "!w-0 !p-0": !openDrawer }
				)}
			>
				<div className={clsx("flex h-full w-full flex-col", { hidden: !openDrawer })}>
					<div className="flex w-full items-center justify-between px-4 pt-4">
						<h4 className="text-lg font-semibold">{t("filter_drawer.filter")}</h4>
						<X size={18} className="cursor-pointer" onClick={toggleDrawer} />
					</div>

					<hr className="my-3 dark:border-surface-400/30" />

					<div
						className={clsx(
							"scrollbar-thin mr-2 flex h-full flex-col gap-4 overflow-auto px-4 pb-2 pr-0",
							className
						)}
					>
						{Object.entries(filters).map(([key, value], index) => (
							<div key={`${key}-${index}`} className="flex flex-col">
								{/* Area: Filter Label */}
								<div className="flex gap-2 pb-2 pt-1.5 text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">
									<Icon size={14} name={value.icon} />
									{value.noTranslate ? t(value.name) : value.name}
									{value.type === "select" && (
										<RefreshCcw
											size={14}
											className="cursor-pointer stroke-primary-500"
											onClick={handleRefreshFilter(key)}
										/>
									)}
								</div>

								{/* Area: Filter Select */}
								{RenderFilterSelect(
									param,
									value,
									handleSingleFilterChange,
									handleMultiFilterChange,
									key,
									open
								)}

								{/* Area: Type Filter Text */}
								{value.type === "text" && (
									<div className="flex justify-center px-3 py-1">
										<input
											type="text"
											className="form-input w-full"
											value={String(param[key] || "")}
											onChange={handleChangeFilter(key)}
											onKeyDown={handleKeydownFilter}
										/>
									</div>
								)}

								{/* Area: Type Filter Number */}
								{value.type === "number" && (
									<div className="flex justify-center px-3 py-1">
										<input
											type="number"
											className="form-input w-full"
											value={Number(param[key] || 0)}
											onChange={handleChangeFilter(key)}
											onKeyDown={handleKeydownFilter}
										/>
									</div>
								)}

								{/* Area: Type Filter Range Number */}
								{value.type === "range-number" && (
									<div className="flex items-center justify-between px-3 py-1">
										<input
											type="number"
											name={value.keyStart}
											className="form-input w-28"
											value={String(param[`${value.keyStart}`] || 0)}
											onChange={handleChangeFilter(`${value.keyStart}`)}
											onKeyDown={handleKeydownFilter}
										/>

										<span>-</span>

										<input
											type="number"
											name={value.keyEnd}
											className="form-input w-28"
											value={Number(param[`${value.keyEnd}`] || 0)}
											onChange={handleChangeFilter(`${value.keyEnd}`)}
											onKeyDown={handleKeydownFilter}
										/>
									</div>
								)}

								{/* Area: Type Filter Date */}
								{value.type === "date" && value.keyStart && value.keyEnd && (
									<div className="px-3 py-1">
										<RangeDatePicker
											ref={clearDateButtonRef}
											onSelectDate={handleDateFilterChange(key)}
										/>
									</div>
								)}
							</div>
						))}
					</div>

					{/* Area: Action Filter */}
					<div className="w-full border-t bg-gray-50 p-4 py-2 pr-2 dark:border-surface-400/30 dark:bg-gray-700/20">
						<ul className="flex items-center justify-between">
							<li>
								<button
									className="btn text-surface-90 h-8 min-w-20 text-nowrap border border-surface-700 bg-white px-3 py-0 hover:brightness-105 active:scale-x-95 active:scale-y-95 active:brightness-90 dark:border-surface-400/30 dark:bg-surface-300/5 dark:text-white"
									onClick={handleClearDataFilter}
								>
									<FilterX size={14} strokeWidth={2.5} className="mr-2" />
									{t("filter_drawer.cancel_filter")}
								</button>
							</li>
							<li>
								<button
									className="btn h-8 min-w-20 text-nowrap bg-secondary-500 px-3 py-0 text-white hover:brightness-105 active:scale-x-95 active:scale-y-95 active:brightness-90"
									onClick={handleFilterData}
								>
									<Filter size={14} strokeWidth={2.5} className="mr-2" />
									{t("filter_drawer.run_filter")}
								</button>
							</li>
						</ul>
					</div>
				</div>
			</Transition>
		</>
	);
};

export default FilterDrawer;
