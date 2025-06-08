"use client";

import {
	apiCreateTemplate,
	apiDeleteTemplate,
	apiGetTemplates,
	apiUpdateTemplate,
} from "@api/templates";
import AddTemplateModal from "@components/non-shared/templates/AddTemplateModal";
import { ActionMenu, InputSearch } from "@components/shared/atoms";
import { BreadcrumbItem } from "@components/shared/atoms/Breadcrumb";
import { Button, ConfirmModal, Filter, Pagination } from "@components/shared/molecules";
import { FilterItemConfig } from "@components/shared/molecules/FilterItem";
import DataTable, { TableRow } from "@components/shared/organisms/DataTable";
import { DefaultPageLayout } from "@components/shared/templates";
import { ApiResponse } from "@type/api.type";
import { Template, TemplateBody, TemplateQueryParams } from "@type/api/template.type";
import { ColumnType, TableColumn } from "@type/component/table.type";
import parse from "html-react-parser";
import { RefreshCcw, SquarePen, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

/**
 * Templates Page
 */
const TemplatesPage = () => {
	// Constants
	const TEMPLATES_BREADCRUMBS: BreadcrumbItem[] = [
		{
			key: "templates_page",
			label: "templates_page.title",
		},
	];
	const TABLE_TEMPLATES_COLUMN: TableColumn<TableRow>[] = [
		{
			key: "name",
			dataType: ColumnType.TEXT,
			label: "templates_page.name",
		},
		{
			key: "content",
			dataType: ColumnType.TEXT,
			label: "templates_page.content",
		},
	];
	const DEFAULT_TEMPLATE: Template = {
		name: "",
		content: "",
		params: [],
		brand_id: "",
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
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [dataTable, setDataTable] = useState<TableRow[]>([]);
	const [templateName, setTemplateName] = useState<string>("");
	const [params, setParams] = useState<Record<string, any>>({});
	const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
	const [selectedTemplates, setSelectedTemplates] = useState<TableRow[]>([]);
	const [addTemplateModalOpen, setAddTemplateModalOpen] = useState<boolean>(false);
	const [notSelectedTemplates, setNotSelectedTemplates] = useState<TableRow[]>([]);
	const [selectedTemplate, setSelectedTemplate] = useState<Template>(DEFAULT_TEMPLATE);
	const [deleteTemplateModalOpen, setDeleteTemplateModalOpen] = useState<boolean>(false);

	// Memoized
	const filters: Record<string, FilterItemConfig> = useMemo(() => {
		return {
			created_at: {
				icon: "Timer",
				name: "templates_page.created_at",
				type: "date",
				keyStart: "created_at[gte]",
				keyEnd: "created_at[lte]",
			},
		};
	}, []);

	/**
	 * Handle select all
	 * @param value boolean
	 */
	const handleSelectedAll = useCallback(
		(value: boolean) => {
			setIsSelectAll(value);
			if (value) {
				setSelectedTemplates(dataTable);
			} else {
				setSelectedTemplates([]);
			}
		},
		[dataTable]
	);

	/**
	 * Handle open create template modal
	 */
	const handleOpenCreateTemplateModal = useCallback(() => {
		setSelectedTemplate(DEFAULT_TEMPLATE);
		setAddTemplateModalOpen(true);
	}, []);

	/**
	 * Handle sync data
	 */
	const handleSyncData = useCallback(() => {
		handleGetTemplates();
	}, []);

	/**
	 * Handle edit template click
	 * @param row TableRow
	 */
	const handleEditTemplateClick = useCallback((row: TableRow) => {
		setSelectedTemplate(row as Template);
		setAddTemplateModalOpen(true);
	}, []);

	/**
	 * Handle open delete modal
	 */
	const handleOpenDeleteModal = useCallback((row: TableRow) => {
		setSelectedTemplate(row as Template);
		setDeleteTemplateModalOpen(true);
	}, []);

	/**
	 * Handle get templates
	 */
	const handleGetTemplates = useCallback(async () => {
		try {
			setIsLoading(true);

			const queryParams: TemplateQueryParams = {
				...(templateName && { name: templateName }),
				...params,
				limit: pageSize,
				offset: (page - 1) * pageSize || 0,
			};

			const response = await apiGetTemplates(queryParams);

			if (response.code !== "OK") {
				return toast.error(
					t("api.get.failed", { data: t("templates_page.template_list").toLowerCase() })
				);
			}

			const { data, total } = response;

			setDataTable(data);
			setTotalItem(total ?? 0);
		} catch (error) {
			toast.error(t("api.get.failed", { data: t("templates_page.template_list").toLowerCase() }));
		} finally {
			setIsLoading(false);
			setSelectedTemplate(DEFAULT_TEMPLATE);
		}
	}, [params, page, pageSize, templateName]);

	/**
	 * Handle add template
	 * @param body TemplateBody
	 */
	const handleAddTemplate = useCallback(
		async (body: TemplateBody) => {
			let response: ApiResponse<Template>;

			try {
				if (selectedTemplate.id) {
					// Update
					response = await apiUpdateTemplate(selectedTemplate.id, body);
				} else {
					// Create
					response = await apiCreateTemplate(body);
				}

				if (response.code !== "OK") {
					if (response.code === "ERR_DUPLICATE_FIELD") {
						toast.error(t("error_message.duplicate_value", { data: body.name }));
						return;
					}

					toast.error(
						t(`api.${selectedTemplate.id ? "update" : "create"}.failed`, { data: body.name })
					);
					return;
				}

				handleGetTemplates();
				toast.success(
					t(`api.${selectedTemplate.id ? "update" : "create"}.success`, { data: body.name })
				);
				setAddTemplateModalOpen(false);
			} catch (error) {
				toast.error(
					t(`api.${selectedTemplate.id ? "update" : "create"}.failed`, { data: body.name })
				);
			}
		},
		[selectedTemplate]
	);

	/**
	 * Handle delete template
	 */
	const handleDeleteTemplate = useCallback(async () => {
		try {
			const response = await apiDeleteTemplate(selectedTemplate.id);

			if (response.code !== "OK") {
				toast.error(t("api.delete.failed", { data: selectedTemplate.name }));
				return;
			}

			toast.success(t("api.delete.success", { data: selectedTemplate.name }));
			handleGetTemplates();
		} catch (error) {
			toast.error(t("api.delete.failed", { data: selectedTemplate.name }));
		}
	}, [selectedTemplate]);

	useEffect(() => {
		handleGetTemplates();
	}, [page, pageSize, params]);

	return (
		<DefaultPageLayout breadcrumbs={TEMPLATES_BREADCRUMBS}>
			<div className="mt-2 flex flex-col gap-2">
				<div className="flex justify-between gap-2">
					{/* Area: Left Action */}
					<div className="flex gap-2">
						{/* Area: Input Search */}
						<InputSearch
							minLength={2}
							placeholder="templates_page.search_template"
							value={templateName}
							onChange={setTemplateName}
							onSearch={handleGetTemplates}
						/>

						{/* Area: Filter */}
						<Filter
							param={params}
							filters={filters}
							onParamChange={setParams}
							onFilter={() => {}}
						/>
					</div>

					{/* Area: Right Action */}
					<div className="flex gap-2">
						{/* Area: Add List */}
						<Button size="sm" onClick={handleOpenCreateTemplateModal}>
							{t("templates_page.add_new_template")}
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
							number: `<b className='text-primary-500'>${isSelectAll ? totalItem - notSelectedTemplates.length : (selectedTemplates.length ?? 0)}</b>`,
						})
					)}
				</span>

				{/* Area: Table Lead */}
				<DataTable
					id="templates-table"
					showAction
					data={dataTable}
					showActionColumn
					currentPage={page}
					pageSize={pageSize}
					totalItem={totalItem}
					isLoading={isLoading}
					columns={TABLE_TEMPLATES_COLUMN}
					selectedList={selectedTemplates}
					notSelectedList={notSelectedTemplates}
					selectedAll={isSelectAll}
					actionColumnOptions={[
						{
							label: "form.edit",
							icon: <SquarePen size={16} />,
							className: "text-primary-500",
							onClick: handleEditTemplateClick,
						},
						{
							label: "form.delete",
							icon: <Trash2 size={16} />,
							className: "text-danger-500",
							onClick: handleOpenDeleteModal,
						},
					]}
					onSelectRow={setSelectedTemplates}
					onSelectAll={handleSelectedAll}
					onDeselectRow={setNotSelectedTemplates}
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

			{/* Area: Add Template Modal */}
			{addTemplateModalOpen && (
				<AddTemplateModal
					template={selectedTemplate}
					isOpen={addTemplateModalOpen}
					onSubmit={handleAddTemplate}
					setIsOpen={setAddTemplateModalOpen}
				/>
			)}

			{/* Area: Confirm Delete Template Modal */}
			<ConfirmModal
				state="warning"
				title={t("templates_page.delete_template_modal.title")}
				isOpen={deleteTemplateModalOpen}
				setIsOpen={setDeleteTemplateModalOpen}
				confirmLabel={t("form.delete")}
				onConfirm={handleDeleteTemplate}
			>
				{t("templates_page.delete_template_modal.message")}
			</ConfirmModal>
		</DefaultPageLayout>
	);
};

export default TemplatesPage;
