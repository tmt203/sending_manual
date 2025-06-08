import {
	ComboboxOption,
	ComboboxOptions,
	Combobox as ComboboxComponent,
	ComboboxInput,
	ComboboxButton,
} from "@headlessui/react";
import clsx from "clsx";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import React, { useMemo, useState } from "react";
const people = [
	{ id: 1, name: "Tom Cook" },
	{ id: 2, name: "Wade Cooper" },
	{ id: 3, name: "Tanya Fox" },
	{ id: 4, name: "Arlene Mccoy" },
	{ id: 5, name: "Devon Webb" },
];

const Combobox = () => {
	const [query, setQuery] = useState<string>("");
	const [selected, setSelected] = useState<{
		id: number;
		name: string;
	} | null>(people[1]);

	const filteredData = useMemo(() => {
		return query === ""
			? people
			: people.filter((person) => {
					return person.name.toLowerCase().includes(query.toLowerCase());
				});
	}, [people, query]);

	return (
		<ComboboxComponent
			value={selected}
			onClose={() => setQuery("")}
			onChange={(value) => setSelected(value)}
		>
			<div className="relative">
				<ComboboxInput
					autoComplete="off"
					displayValue={(person: { id: number; name: string }) => person?.name}
					className={clsx(
						"w-full rounded-lg shadow-sm border-gray-200 border  py-1.5 pr-8 pl-3 text-sm/6",
						"dark:bg-white/5 dark:hover:text-gray-100 dark:bg-gray-800 dark:border-gray-700/60 dark:hover:border-gray-600",
						"hover:border-gray-300 hover:text-gray-800 focus:ring-0 focus:border-gray-200",
						"data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
					)}
					onChange={(event) => setQuery(event.target.value)}
				/>
				<ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
					<ChevronDownIcon
						size={16}
						className={clsx("dark:hover:stroke-gray-100", "hover:stroke-gray-800")}
					/>
				</ComboboxButton>
			</div>

			<ComboboxOptions
				transition
				anchor="bottom"
				className={clsx(
					"w-[var(--input-width)] rounded-xl border shadow-md border-white/5 bg-white dark:bg-gray-900 z-20  p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
					"transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
				)}
			>
				{filteredData.map((person) => (
					<ComboboxOption
						key={person.id}
						value={person}
						className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-gray-500/10"
					>
						<CheckIcon className="invisible size-4 stroke-primary-500 group-data-[selected]:visible" />
						<div className="text-sm/6">{person.name}</div>
					</ComboboxOption>
				))}
			</ComboboxOptions>
		</ComboboxComponent>
	);
};

export default Combobox;
