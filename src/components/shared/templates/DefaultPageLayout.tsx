import React from "react";
import { Breadcrumb } from "../atoms";
import { BreadcrumbItem } from "../atoms/Breadcrumb";

export interface DefaultPageLayoutProps {
	children?: React.ReactNode;
	leftTileChildren?: React.ReactNode;
	breadcrumbs: BreadcrumbItem[];
}

/**
 * Default Page Layout
 * @props DefaultPageLayoutProps
 */
const DefaultPageLayout = ({ children, leftTileChildren, breadcrumbs }: DefaultPageLayoutProps) => {
	return (
		<div className="px-2 lg:px-4 py-4 w-full h-full relative overflow-hidden bg-white dark:bg-gray-800 dark:text-gray-100">
			{/* Area: Page header */}
			<div className="sm:flex sm:justify-between sm:items-center mb-2">
				{/* Area: Title */}
				<h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
					<Breadcrumb breadcrumbs={breadcrumbs} separate="ChevronRight" />
				</h1>

				{/* Area: Left Title Children */}
				<div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
					{leftTileChildren}
				</div>
			</div>

			{/* Area: Title Divide */}
			<hr className="border-t dark:border-surface-400/30" />

			{/* Area: Content Body */}
			<div className="px-2 mt-4 h-[calc(100%-65px)] overflow-auto scrollbar-thin">{children}</div>
		</div>
	);
};

export default DefaultPageLayout;
