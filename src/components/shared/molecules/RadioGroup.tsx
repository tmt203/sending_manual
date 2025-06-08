"use client";

import { Display, Variant } from "@type/common.type";
import clsx from "clsx";
import { ChangeEventHandler } from "react";
import Radio from "../atoms/Radio";

export interface RadioItem {
	label?: string;
	variant?: Variant;
	value?: string | number | readonly string[];
}

export interface RadioGroupProps {
	id?: string;
	display?: Display;
	radioGroup?: string;
	groupValue?: string | number | readonly string[];
	radioItems: RadioItem[];
	className?: string;
	onChange?: ChangeEventHandler<HTMLInputElement>;
}

/**
 * Radio Group Component
 * @props RadioGroupProps
 */
const RadioGroup = ({
	id,
	display = "col",
	radioGroup = "",
	radioItems,
	className,
	groupValue,
	onChange,
}: RadioGroupProps) => {
	return (
		<div
			className={clsx("flex gap-2", className, {
				"flex-col": display === "col",
			})}
		>
			{radioItems.map((radio, index) => (
				<Radio
					key={`${radio.value}-${index}`}
					id={id}
					name={radioGroup}
					value={radio.value}
					label={radio.label}
					variant={radio.variant}
					checked={groupValue === radio.value}
					onChange={onChange}
				/>
			))}
		</div>
	);
};

export default RadioGroup;
