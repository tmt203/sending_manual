"use client";

import React, { ReactNode } from "react";
import Breadcrumb, { BreadcrumbItem } from "../atoms/Breadcrumb";

export interface PageLayoutProps {
	headerTitle: string;
	headerChildren: ReactNode;
	children: ReactNode;
	breadcrumbs: BreadcrumbItem[];
}

/**
 * Page Layout Component
 * @props PageLayoutProps
 */
const PageLayoutTemplate = ({
	children,
	headerTitle,
	headerChildren,
	breadcrumbs,
}: PageLayoutProps) => {
	return (
		<>
			{/* Area: Header Title */}
			<div className="mb-8 sm:flex sm:items-center sm:justify-between">
				{/* Left: Title */}
				<div className="mb-4 sm:mb-0">
					<h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 md:text-3xl">
						{headerTitle}
					</h1>
					{headerChildren}
				</div>
				{/* Right: Header */}
				<div className="grid grid-flow-col justify-start gap-2 sm:auto-cols-max sm:justify-end">
					<Breadcrumb separate="ChevronRight" breadcrumbs={breadcrumbs} />
				</div>
			</div>

			{children}
		</>
	);
};

export default PageLayoutTemplate;
