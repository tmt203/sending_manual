"use client";

import PageSizeDropdown from "../atoms/PageSizeDropdown";
import PaginationNumeric from "../atoms/PaginationNumeric";

export interface PaginationProps {
	totalItem?: number;
	pageSize?: number;
	currentPage?: number;
	setPage: (page: number) => void;
	setPageSize: (value: number) => void;
}

/**
 * Pagination Component
 * @props PaginationProps
 */
const Pagination = ({
	totalItem = 0,
	pageSize = 50,
	currentPage = 1,
	setPage,
	setPageSize,
}: PaginationProps) => {
	return (
		<div className="flex items-center justify-between">
			<div className="text-center text-sm text-gray-500 sm:text-left">
				<span className="font-medium text-gray-600 dark:text-gray-300">
					{totalItem > 0 ? pageSize * (currentPage - 1) + 1 : 0}
				</span>{" "}
				-{" "}
				<span className="font-medium text-gray-600 dark:text-gray-300">
					{pageSize * currentPage || 0}
				</span>{" "}
				of <span className="font-medium text-gray-600 dark:text-gray-300">{totalItem}</span> results
			</div>
			<div className="flex gap-3">
				{/* Area: Page size */}
				<PageSizeDropdown pagesize={pageSize} onSetPageSize={setPageSize} />

				{/* Area: Pagination */}
				<PaginationNumeric
					pageSize={pageSize}
					totalItems={totalItem}
					currentPage={currentPage}
					setPage={setPage}
				/>
			</div>
		</div>
	);
};

export default Pagination;
