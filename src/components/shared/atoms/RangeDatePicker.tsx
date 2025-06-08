"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import clsx from "clsx";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { XCircle } from "lucide-react";
import { MouseEvent, useCallback, useMemo, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

export interface RangeDatePickerProps
	extends Omit<React.ComponentProps<typeof DayPicker>, "selected" | "onSelect" | "mode"> {
	onSelectDate: (date: DateRange) => void;
	ref?: React.Ref<HTMLButtonElement>;
}

/**
 * Range Date Picker Component
 * @props RangeDatePickerProps
 */
const RangeDatePicker = ({ ref, className, onSelectDate }: RangeDatePickerProps) => {
	// State
	const [date, setDate] = useState<DateRange | undefined>({
		from: undefined,
		to: undefined,
	});

	const valueLabel = useMemo(() => {
		if (!date?.from) return "Pick a date";
		if (!date.to) return format(date.from, "dd/MM/yyyy");
		return `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`;
	}, [date]);

	/**
	 * Handle selected Date
	 * @param value DateRange
	 */
	const handleSelectDate = useCallback(
		(value: DateRange) => {
			onSelectDate(value);
			setDate(value);
		},
		[onSelectDate, setDate]
	);

	/**
	 * Handle clear date
	 * @param event MouseEvent<HTMLButtonElement>
	 */
	const handleClearDate = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
			event.stopPropagation();
			onSelectDate({
				from: undefined,
				to: undefined,
			});
			setDate(undefined);
		},
		[setDate, onSelectDate]
	);

	return (
		<div className={clsx("grid gap-2", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<div
						className={clsx(
							"btn px-2.5 min-w-[15.5rem] bg-white border-gray-200 justify-between group",
							"dark:border-surface-400/30 dark:hover:border-gray-600 dark:bg-gray-800",
							"hover:border-gray-300 hover:text-gray-800",
							{ "text-muted-foreground": !date }
						)}
					>
						<div className="flex items-center font-medium text-left text-gray-600 group-hover:text-gray-800 dark:text-gray-300 dark:group-hover:text-gray-100">
							<svg
								className="fill-current text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-100 ml-1 mr-2"
								width="16"
								height="16"
								viewBox="0 0 16 16"
							>
								<path d="M5 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z"></path>
								<path d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4ZM2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z"></path>
							</svg>
							<span>{valueLabel}</span>
						</div>

						<button ref={ref} onClick={handleClearDate}>
							<XCircle
								size={14}
								className={clsx(
									"text-danger-400 dark:text-danger-500 hover:text-danger-600 dark:hover:text-danger-300",
									{ invisible: !date?.from }
								)}
							/>
						</button>
					</div>
				</PopoverTrigger>
				<PopoverContent align="end" className="w-auto p-0">
					<DayPicker
						mode={"range"}
						selected={date}
						numberOfMonths={2}
						captionLayout="dropdown"
						hideNavigation
						className={clsx("p-3 text-gray-600 dark:text-gray-100", className)}
						locale={vi}
						classNames={{
							months: "flex flex-col gap-3 sm:flex-row space-y-4 sm:space-y-0",
							month_caption: "flex justify-start pt-1 pb-3 relative items-center",
							caption_label: "text-base font-medium",
							nav: "absolute flex items-center justify-between gap-1 inset-x-3 top-3",
							button_previous:
								"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none size-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-50",
							button_next:
								"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none size-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-50",
							month_grid: "w-full border-collapse space-y-1",
							weekdays: "flex",
							weekday: "text-gray-400 dark:text-gray-500 font-medium rounded-md w-9 text-[0.8rem]",
							week: "flex w-full mt-2",
							day: "h-9 w-9 mx-[0.5px] text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-green-500/50 [&:has([aria-selected])]:bg-primary-500 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
							day_button:
								"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-primary-500 hover:text-white h-9 w-9 p-0 aria-selected:opacity-100",
							range_start: "rounded-l-lg",
							range_end: "day-range-end rounded-r-lg",
							selected:
								"bg-primary-500 text-white hover:bg-primary-500 hover:text-white focus:bg-primary-500 focus:text-white",
							today: "text-primary-500",
							outside:
								"day-outside text-gray-400 dark:text-gray-500 aria-selected:bg-primary-500/50 aria-selected:text-gray-400 dark:text-gray-500",
							disabled: "text-gray-400 dark:text-gray-500 opacity-50",
							range_middle: "aria-selected:bg-primary-500/70 aria-selected:text-white",
							hidden: "invisible",
							footer: "text-xs font-semibold italic",
						}}
						footer={
							date?.from && date?.to
								? `Selected: ${format(date?.from, "dd/MM/yyyy")}-${format(date?.to, "dd/MM/yyyy")}`
								: "Please pick a date"
						}
						onSelect={handleSelectDate}
						required
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default RangeDatePicker;
