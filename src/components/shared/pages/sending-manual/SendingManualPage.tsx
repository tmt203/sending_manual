"use client";

import { apiGetBrands } from "@api/brand";
import { apiCreateMessage } from "@api/messages";
import { apiGetTemplateById, apiGetTemplates } from "@api/templates";
import ReceiverInfoTable, {
	RowData,
} from "@components/non-shared/sending-manual/ReceiverInfoTable";
import { SMSReview } from "@components/shared/atoms";
import { BreadcrumbItem } from "@components/shared/atoms/Breadcrumb";
import { Button, SelectForm } from "@components/shared/molecules";
import { DefaultPageLayout } from "@components/shared/templates";
import { BrandQueryParams } from "@type/api/brand.type";
import { MessageBody } from "@type/api/message.type";
import { Template, TemplateQueryParams } from "@type/api/template.type";
import { SelectOption } from "@type/common.type";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { object, string } from "yup";

const SendingManualPage = () => {
	// Constants
	const SENDING_MANUAL_BREADCRUMBS: BreadcrumbItem[] = [
		{
			key: "sending_manual_page",
			label: "sending_manual_page.title",
		},
	];

	// Hooks
	const t = useTranslations();

	// States
	const [rows, setRows] = useState<RowData[]>([]);
	const [sampleContent, setSampleContent] = useState<string>("");
	const [template, setTemplate] = useState<Template | null>(null);
	const [brandOptions, setBrandOptions] = useState<SelectOption[]>([]);
	const [templateOptions, setTemplateOptions] = useState<SelectOption[]>([]);

	// Memoized
	const initialValues = useMemo(() => {
		return {
			channel: "sms",
			brand: "",
			template_id: "",
		};
	}, []);

	const validationSchema = useMemo(() => {
		return object().shape({
			channel: string().oneOf(["sms", "zns", "email"], t("error_message.invalid_value")),
			brand: string().required(t("error_message.required")),
			template_id: string().required(t("error_message.required")),
		});
	}, []);

	/**
	 * Handle create message
	 * @param values MessageBody
	 */
	const handleCreateMessage = useCallback(async (values: MessageBody) => {
		try {
			const response = await apiCreateMessage(values);

			if (response.code !== "OK") {
				return toast.error(t("sending_manual_page.send_failed"));
			}

			toast.success(t("sending_manual_page.send_success"));
		} catch (error) {
			toast.error(t("sending_manual_page.send_failed"));
		}
	}, []);

	// Formik
	const formik = useFormik({
		initialValues,
		validationSchema,
		enableReinitialize: true,
		onSubmit: async (values) => {
			// const body: MessageBody = {
			// 	template_id: values.template_id,
			// 	destinations: rows.map((row) => ({
			// 		phone_number: row.phone_number,
			// 		list_param: row.list_param,
			// 	})),
			// };

			// await handleCreateMessage(body);
			setTimeout(() => {
				toast.success(t("sending_manual_page.send_success"));
				resetForm();
			}, 1000);
		},
	});

	const isDisabled = useMemo(() => {
		const missingParams = rows.some((row) => {
			return !row.phone_number || Object.values(row.list_param).some((value) => !value);
		});

		return (
			!formik.values.brand ||
			!formik.values.channel ||
			!formik.values.template_id ||
			missingParams ||
			formik.isSubmitting
		);
	}, [formik.values, rows, formik.isSubmitting]);

	/**
	 * Handle get brands
	 */
	const handleGetBrands = useCallback(async () => {
		try {
			const params: BrandQueryParams = {
				channel: formik.values.channel,
			};
			const response = await apiGetBrands(params);

			if (response.code !== "OK") {
				return toast.error(
					t("api.get.failed", { data: t("sending_manual_page.brand_list").toLowerCase() })
				);
			}

			const { data } = response;
			if (!data || data.length === 0) return;

			const options: SelectOption[] = data.map((item) => ({
				label: item.name,
				value: item.id,
				noTranslate: true,
			}));

			setBrandOptions(options);
		} catch (error) {
			toast.error(t("api.get.failed", { data: t("sending_manual_page.brand_list").toLowerCase() }));
		}
	}, [formik.values.channel]);

	/**
	 * Handle get templates
	 */
	const handleGetTemplates = useCallback(async () => {
		try {
			const params: TemplateQueryParams = {
				brand_id: formik.values.brand,
			};
			const response = await apiGetTemplates(params);

			if (response.code !== "OK") {
				return toast.error(
					t("api.get.failed", { data: t("sending_manual_page.template_list").toLowerCase() })
				);
			}

			const { data } = response;
			if (!data || data.length === 0) {
				setTemplateOptions([]);
				return;
			}

			const options: SelectOption[] = data.map((item) => ({
				label: item.name,
				value: item.id,
				noTranslate: true,
			}));

			setTemplateOptions(options);
		} catch (error) {
			toast.error(
				t("api.get.failed", { data: t("sending_manual_page.template_list").toLowerCase() })
			);
		}
	}, [formik.values.brand]);

	/**
	 * Handle get template by ID
	 */
	const handleGetTemplateById = useCallback(async () => {
		try {
			const response = await apiGetTemplateById(formik.values.template_id);

			if (response.code !== "OK") {
				return toast.error(
					t("api.get.failed", { data: t("sending_manual_page.template").toLowerCase() })
				);
			}

			const { data } = response;
			if (!data) return;

			setTemplate(data);
		} catch (error) {
			toast.error(t("api.get.failed", { data: t("sending_manual_page.template").toLowerCase() }));
		}
	}, [formik.values.template_id]);

	/**
	 * Reset form
	 */
	const resetForm = useCallback(() => {
		formik.resetForm();
		setRows([{ id: crypto.randomUUID(), phone_number: "", list_param: {} }]);
	}, []);

	useEffect(() => {
		handleGetBrands();
	}, []);

	useEffect(() => {
		handleGetTemplates();
		setTemplate(null);
	}, [formik.values.brand]);

	useEffect(() => {
		if (!formik.values.template_id) {
			setTemplate(null);
			return;
		}

		// Get template by ID
		handleGetTemplateById();

		// Init first row
		const row: RowData[] = [{ id: crypto.randomUUID(), phone_number: "", list_param: {} }];
		setRows(row);
	}, [formik.values.template_id]);

	useEffect(() => {
		const params = rows[0]?.list_param || {};

		if (Object.keys(params).length === 0) {
			setSampleContent(template?.content ?? "");
			return;
		}

		const content =
			template?.content.replace(/{{(.*?)}}/g, (_, key) => {
				return params[key] || `{{${key}}}`;
			}) ?? "";

		setSampleContent(content);
	}, [rows, template]);

	return (
		<DefaultPageLayout breadcrumbs={SENDING_MANUAL_BREADCRUMBS}>
			<form onSubmit={formik.handleSubmit} className="flex items-start gap-4">
				{/* Area: Form */}
				<div className="flex w-8/12 flex-col gap-4">
					{/* Area: Channel */}
					<SelectForm
						id="channel"
						name="channel"
						disabled
						label="sending_manual_page.channel"
						placeholder={t("select.placeholder", {
							data: t("sending_manual_page.channel").toLowerCase(),
						})}
						options={[
							{ value: "sms", label: "sending_manual_page.sms" },
							{ value: "zns", label: "sending_manual_page.zns" },
							{ value: "email", label: "sending_manual_page.email" },
						]}
						errorMessage={formik.errors.channel}
						value={formik.values.channel}
						onChange={formik.handleChange}
					/>

					{/* Area: Brandname */}
					<SelectForm
						id="brand"
						name="brand"
						label="sending_manual_page.brand"
						placeholder={t("select.placeholder", {
							data: t("sending_manual_page.brand").toLowerCase(),
						})}
						options={brandOptions}
						errorMessage={formik.errors.brand}
						value={formik.values.brand}
						onChange={formik.handleChange}
					/>

					{/* Area: Template */}
					<SelectForm
						id="template_id"
						name="template_id"
						label="sending_manual_page.template"
						placeholder={t("select.placeholder", {
							data: t("sending_manual_page.template").toLowerCase(),
						})}
						options={templateOptions}
						errorMessage={formik.errors.template_id}
						value={formik.values.template_id}
						onChange={formik.handleChange}
					/>

					{/* Area: Receiver Info */}
					{template && <ReceiverInfoTable params={template.params} rows={rows} setRows={setRows} />}

					<div className="mt-10 flex justify-end gap-2">
						{/* Area: Reset Button */}
						<Button className="mt-3" outline type="button" onClick={resetForm}>
							{t("sending_manual_page.reset")}
						</Button>

						{/* Area: Save Button */}
						<Button disabled={isDisabled} className="mt-3" type="submit">
							{t("sending_manual_page.send")}
						</Button>
					</div>
				</div>

				{/* Area: Phone */}
				<div className="w-4/12">
					<div className="mx-auto w-[393px] overflow-hidden">
						<SMSReview
							channel={formik.values.channel}
							branchName={
								brandOptions.find((option) => option.value === formik.values.brand)?.label ?? ""
							}
							messageContent={sampleContent}
							phoneNumber={"0934179289"}
						/>
					</div>
				</div>
			</form>
		</DefaultPageLayout>
	);
};

export default SendingManualPage;
