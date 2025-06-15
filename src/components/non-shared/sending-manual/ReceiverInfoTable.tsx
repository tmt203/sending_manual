import { Button, InputForm } from "@components/shared/molecules";
import { AlignJustify, PlusCircle, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

export interface RowData {
	id: string;
	list_param: Record<string, string>;
	phone_number: string;
}

export interface ReceiverInfoTableProps {
	params: string[];
	rows: RowData[];
	setRows: (rows: RowData[]) => void;
}

/**
 * Receiver Info Table Component
 */
const ReceiverInfoTable = ({ params, rows, setRows }: ReceiverInfoTableProps) => {
	// Hooks
	const t = useTranslations();

	/**
	 * Handle phone change
	 * @param index number
	 * @param event React.ChangeEvent<HTMLInputElement>
	 */
	const handlePhoneChange = useCallback(
		(index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
			const newRows = [...rows];
			newRows[index].phone_number = event.target.value;
			setRows(newRows);
		},
		[rows]
	);

	/**
	 * Handle list param change
	 * @param index number
	 * @param param string
	 * @param event React.ChangeEvent<HTMLInputElement>
	 */
	const handleListParamChange = useCallback(
		(index: number, param: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
			const newRows = [...rows];
			newRows[index].list_param[param] = event.target.value;
			setRows(newRows);
		},
		[rows]
	);

	/**
	 * Remove row
	 * @param index number
	 */
	const removeRow = useCallback(
		(index: number) => () => {
			const newRows = rows.filter((_, i) => i !== index);
			setRows(newRows);
		},
		[]
	);

	/**
	 * Add row
	 */
	const addRow = useCallback(() => {
		const newRow: RowData = {
			id: crypto.randomUUID(),
			list_param: params.reduce((acc, param) => ({ ...acc, [param]: "" }), {}),
			phone_number: "",
		};
		setRows([...rows, newRow]);
	}, [params, rows, setRows]);

	return (
		<div className="flex flex-col gap-2">
			{/* Area: Title */}
			<div className="font-inter text-base font-semibold text-gray-900 dark:text-white">
				{t("sending_manual_page.receiver_information")} <span className="text-red-500">*</span>
			</div>

			{/* Area: Table */}
			<table className="w-full border-collapse text-sm text-gray-600 dark:text-gray-100">
				<thead className="text-gray-500 dark:text-gray-100">
					<tr className="text-center font-inter text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-100">
						<th className="whitespace-nowrap border-r border-gray-300 p-2 text-center">
							phone_number
						</th>
						{/* Dynamically Generate Headers for List Parameters */}
						{params.map((param) => (
							<th key={param} className="border-r border-gray-300 p-2 text-center">
								{param}
							</th>
						))}
						<th>
							<AlignJustify strokeWidth={2.5} size={16} className="mx-auto" />
						</th>
					</tr>
				</thead>

				<tbody>
					{/* Render Rows Dynamically */}
					{rows.map((row, index) => (
						<tr key={`${index}-${row.id}`} className="border-b">
							{/* Phone Number Input */}
							<td className="border border-l-0 border-gray-300">
								<InputForm
									id="phone"
									required
									type="text"
									value={row.phone_number}
									placeholder={t("input.placeholder", {
										data: "phone_number",
									})}
									className="m-0 w-full rounded p-0 text-center font-inter text-sm font-normal leading-[22px] focus:ring-1 focus:ring-blue-400 [&_input#phone]:!border-none [&_input#phone]:!text-center"
									onChange={handlePhoneChange(index)}
								/>
							</td>

							{/* List Parameter Inputs */}
							{params.map((param, paramIndex) => (
								<td key={param} className="border border-gray-300">
									<InputForm
										id="param"
										required
										value={row.list_param[param] || ""}
										placeholder={t("input.placeholder", {
											data: params[paramIndex],
										})}
										className="m-0 w-full rounded p-0 text-center font-inter text-sm font-normal leading-[22px] focus:ring-1 focus:ring-blue-400 [&_input#param]:!border-none [&_input#param]:!text-center"
										onChange={handleListParamChange(index, param)}
									/>
								</td>
							))}

							{/* Remove Row Button */}
							<td className="relative border-b border-l border-t border-gray-300">
								<div className="flex justify-center">
									<Button
										disabled={rows.length <= 1}
										type="button"
										className="m-1 min-w-8"
										variant="danger"
										outline={true}
										size="2xs"
										onClick={removeRow(index)}
									>
										<Trash2 strokeWidth={2.5} size={16} />
									</Button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<div className="w-4/12">
				{/* Area: Add Row Button */}
				<Button type="button" variant="primary" className="mt-3" onClick={addRow}>
					<PlusCircle size={16} strokeWidth={3} className="mr-2" />
					{t("sending_manual_page.add_receiver")}
				</Button>
			</div>
		</div>
	);
};

export default ReceiverInfoTable;
