"use client";

import { apiCreateBrand, apiDeleteBrand, apiGetBrands, apiUpdateBrand } from "@api/brand";
import AddBrandModal from "@components/non-shared/brands/AddBrandModal";
import { ActionMenu, Chip, InputSearch } from "@components/shared/atoms";
import { BreadcrumbItem } from "@components/shared/atoms/Breadcrumb";
import { Button, ConfirmModal, Filter, Pagination } from "@components/shared/molecules";
import { FilterItemConfig } from "@components/shared/molecules/FilterItem";
import { DataTable } from "@components/shared/organisms";
import { TableRow } from "@components/shared/organisms/DataTable";
import { DefaultPageLayout } from "@components/shared/templates";
import { ApiResponse } from "@type/api.type";
import { Brand, BrandBody, BrandQueryParams } from "@type/api/brand.type";
import { ColumnType, TableColumn } from "@type/component/table.type";
import parse from "html-react-parser";
import { RefreshCcw, SquarePen, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

/**
 * Brands Page
 */
const BrandsPage = () => {
	// Constants
	const BRANDS_BREADCRUMBS: BreadcrumbItem[] = [
		{
			key: "brands_page",
			label: "brands_page.title",
		},
	];
	const TABLE_BRANDS_COLUMN: TableColumn<TableRow>[] = [
		{
			key: "name",
			dataType: ColumnType.TEXT,
			label: "brands_page.name",
		},
		{
			key: "description",
			dataType: ColumnType.TEXT,
			label: "brands_page.description",
		},
		{
			key: "channel",
			dataType: ColumnType.ACTION,
			label: "brands_page.channel",
			component: [
				{
					component: Chip,
					props: (row) => {
						return {
							size: "xs",
							label: row.channel,
							variant: row.channel === "sms" ? "warning" : "primary",
							noTranslate: true,
						};
					},
				},
			],
		},
	];
	const BRAND_FILTERS: Record<string, FilterItemConfig> = {
		channel: {
			icon: "Slack",
			name: "brands_page.channel",
			type: "select",
			options: [
				{ label: "SMS", value: "sms", noTranslate: true },
				{ label: "ZNS", value: "zns", noTranslate: true },
				{ label: "Email", value: "email", noTranslate: true },
			],
		},
	};
	const DEFAULT_BRAND: Brand = {
		name: "",
		description: "",
		channel: "sms",
		id: "",
		created_at: "",
		created_by: "",
		updated_at: "",
		updated_by: "",
	};

	// Hooks
	const t = useTranslations();

	// States
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalItem, setTotalItem] = useState<number>(0);
	const [brandName, setBrandName] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [dataTable, setDataTable] = useState<TableRow[]>([]);
	const [params, setParams] = useState<Record<string, any>>({});
	const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
	const [selectedBrands, setSelectedBrands] = useState<TableRow[]>([]);
	const [selectedBrand, setSelectedBrand] = useState<Brand>(DEFAULT_BRAND);
	const [addBrandModalOpen, setAddBrandModalOpen] = useState<boolean>(false);
	const [notSelectedBrands, setNotSelectedBrands] = useState<TableRow[]>([]);
	const [deleteBrandModalOpen, setDeleteBrandModalOpen] = useState<boolean>(false);
	const [tableColumns, setTableColumns] = useState<TableColumn<TableRow>[]>(TABLE_BRANDS_COLUMN);

	// Memoized
	const filters = useMemo(() => BRAND_FILTERS, []);

	/**
	 * Handle get brands
	 */
	const handleGetBrands = useCallback(async () => {
		try {
			setIsLoading(true);

			const queryParams: BrandQueryParams = {
				...(brandName && { name: brandName }),
				...params,
				limit: pageSize,
				offset: (page - 1) * pageSize || 0,
			};

			const response = await apiGetBrands(queryParams);

			if (response.code !== "OK") {
				return toast.error(
					t("api.get.failed", { data: t("brands_page.brand_list").toLowerCase() })
				);
			}

			const { data, total } = response;

			setDataTable(data);
			setTotalItem(total ?? 0);
		} catch (error) {
			toast.error(t("api.get.failed", { data: t("brands_page.brand_list").toLowerCase() }));
		} finally {
			setIsLoading(false);
			setSelectedBrand(DEFAULT_BRAND);
		}
	}, [params, page, pageSize, brandName]);

	/**
	 * Handle open create brand modal
	 */
	const handleOpenCreateBrandModal = useCallback(() => {
		setSelectedBrand(DEFAULT_BRAND);
		setAddBrandModalOpen(true);
	}, []);

	/**
	 * Handle open delete modal
	 * @param row TableRow
	 */
	const handleOpenDeleteModal = useCallback((row: TableRow) => {
		setSelectedBrand(row as Brand);
		setDeleteBrandModalOpen(true);
	}, []);

	/**
	 * Handle select all
	 * @param value boolean
	 */
	const handleSelectedAll = useCallback(
		(value: boolean) => {
			setIsSelectAll(value);
			if (value) {
				setSelectedBrands(dataTable);
			} else {
				setSelectedBrands([]);
			}
		},
		[dataTable]
	);

	/**
	 * Handle add brand
	 * @param body BrandBody
	 */
	const handleAddBrand = useCallback(
		async (body: BrandBody) => {
			let response: ApiResponse<Brand>;

			try {
				if (selectedBrand.id) {
					// Update
					response = await apiUpdateBrand(selectedBrand.id, body);
				} else {
					// Create
					response = await apiCreateBrand(body);
				}

				if (response.code !== "OK") {
					toast.error(
						t(`api.${selectedBrand.id ? "update" : "create"}.failed`, { data: body.name })
					);
					return;
				}

				handleGetBrands();
				toast.success(
					t(`api.${selectedBrand.id ? "update" : "create"}.success`, { data: body.name })
				);
				setAddBrandModalOpen(false);
			} catch (error) {
				toast.error(t(`api.${selectedBrand.id ? "update" : "create"}.failed`, { data: body.name }));
			}
		},
		[selectedBrand]
	);

	/**
	 * Handle sync data
	 */
	const handleSyncData = useCallback(() => {
		handleGetBrands();
	}, [params, page, pageSize, brandName]);

	/**
	 * Handle edit brand click
	 * @param row TableRow
	 */
	const handleEditBrandClick = useCallback((row: TableRow) => {
		setSelectedBrand(row as Brand);
		setAddBrandModalOpen(true);
	}, []);

	/**
	 * Handle delete brand
	 */
	const handleDeleteBrand = useCallback(async () => {
		try {
			const response = await apiDeleteBrand(selectedBrand.id);

			if (response.code !== "OK") {
				toast.error(t("api.delete.failed", { data: selectedBrand.name }));
				return;
			}

			toast.success(t("api.delete.success", { data: selectedBrand.name }));
			handleGetBrands();
		} catch (error) {
			toast.error(t("api.delete.failed", { data: selectedBrand.name }));
		}
	}, [selectedBrand]);

	/**
	 * Handle hide column
	 * @param columnKey string
	 */
	const handleHideColumn = useCallback(
		(columnKey: string) => () => {
			setTableColumns((prevColumns) =>
				prevColumns.map((column) =>
					column.key === columnKey ? { ...column, isHidden: !column.isHidden } : column
				)
			);
		},
		[setTableColumns]
	);

	useEffect(() => {
		handleGetBrands();
	}, [page, pageSize, params]);

	return (
		<DefaultPageLayout breadcrumbs={BRANDS_BREADCRUMBS}>
			<div className="mt-2 flex flex-col gap-2">
				{/* Area: Right Action */}
				<div className="flex justify-between gap-2">
					<div className="flex gap-2">
						{/* Area: Input Search */}
						<InputSearch
							minLength={2}
							value={brandName}
							placeholder="brands_page.search_brand"
							onChange={setBrandName}
							onSearch={handleGetBrands}
						/>

						{/* Area: Filter */}
						<Filter
							param={params}
							filters={filters}
							onParamChange={setParams}
							onFilter={handleGetBrands}
						/>
					</div>

					{/* Area: Left Action */}
					<div className="flex gap-2">
						{/* Area: Add List */}
						<Button size="sm" onClick={handleOpenCreateBrandModal}>
							{t("brands_page.add_new_brand")}
						</Button>

						{/* Area: Action Menu */}
						<ActionMenu
							label="form.other_action"
							actions={[
								{
									icon: RefreshCcw,
									key: "sync-data",
									label: "sync_data",
									action: handleSyncData,
								},
							]}
						/>
					</div>
				</div>

				{/* Area: Count Brands */}
				<span>
					{parse(
						t("brands_page.selected_brand", {
							number: `<b className='text-primary-500'>${isSelectAll ? totalItem - notSelectedBrands.length : (selectedBrands.length ?? 0)}</b>`,
						})
					)}
				</span>

				{/* Area: Table Lead */}
				<DataTable
					id="brands-table"
					showAction
					data={dataTable}
					showActionColumn
					currentPage={page}
					pageSize={pageSize}
					totalItem={totalItem}
					isLoading={isLoading}
					columns={tableColumns}
					selectedList={selectedBrands}
					notSelectedList={notSelectedBrands}
					selectedAll={isSelectAll}
					actionColumnOptions={[
						{
							label: "form.edit",
							icon: <SquarePen size={16} />,
							className: "text-primary-500",
							onClick: handleEditBrandClick,
						},
						{
							label: "form.delete",
							icon: <Trash2 size={16} />,
							className: "text-danger-500",
							onClick: handleOpenDeleteModal,
						},
					]}
					onSelectRow={setSelectedBrands}
					onSelectAll={handleSelectedAll}
					onDeselectRow={setNotSelectedBrands}
					onHideColumn={handleHideColumn}
				/>

				{/* Area: Pagination */}
				{dataTable.length > 0 && (
					<Pagination
						currentPage={page}
						pageSize={pageSize}
						totalItem={totalItem}
						setPage={setPage}
						setPageSize={setPageSize}
					/>
				)}
			</div>

			{/* Area: Add Brand Modal */}
			{addBrandModalOpen && (
				<AddBrandModal
					brand={selectedBrand}
					isOpen={addBrandModalOpen}
					onSubmit={handleAddBrand}
					setIsOpen={setAddBrandModalOpen}
				/>
			)}

			{/* Area: Confirm Delete Brand Modal */}
			<ConfirmModal
				state="warning"
				title={t("brands_page.delete_brand_modal.title")}
				isOpen={deleteBrandModalOpen}
				setIsOpen={setDeleteBrandModalOpen}
				confirmLabel={t("form.delete")}
				onConfirm={handleDeleteBrand}
			>
				{t("brands_page.delete_brand_modal.message")}
			</ConfirmModal>
		</DefaultPageLayout>
	);
};

export default BrandsPage;
