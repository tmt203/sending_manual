"use client";

import { apiGetBrands } from "@api/brand";
import { TextArea } from "@components/shared/atoms";
import { InputForm, Modal, SelectForm } from "@components/shared/molecules";
import { BrandQueryParams } from "@type/api/brand.type";
import { Template, TemplateBody } from "@type/api/template.type";
import { SelectOption } from "@type/common.type";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { array, object, string } from "yup";

export interface AddTemplateModalProps {
	isOpen: boolean;
	template: Template;
	setIsOpen: (value: boolean) => void;
	onSubmit: (body: TemplateBody) => Promise<void>;
}

/**
 * Add Template Modal
 * @props AddTemplateModalProps
 */
const AddTemplateModal = ({ isOpen, template, setIsOpen, onSubmit }: AddTemplateModalProps) => {
	// Hooks
	const t = useTranslations();

	// States
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [brandOptions, setBrandOptions] = useState<SelectOption[]>([]);

	// Memoized
	const initialValues = useMemo(() => {
		return {
			name: template.name,
			params: template.params,
			content: template.content,
			brand_id: template.brand_id,
		};
	}, [template]);

	const validationSchema = useMemo(() => {
		return object().shape({
			name: string()
				.min(2, t("error_message.min_length", { data: 2 }))
				.max(50, t("error_message.max_length", { data: 50 }))
				.required(t("error_message.required")),
			content: string().max(200, t("error_message.max_length", { data: 200 })),
			params: array().of(string()),
			brand_id: string().required(t("error_message.required")),
		});
	}, []);

	// Formik
	const formik = useFormik({
		initialValues,
		validationSchema,
		enableReinitialize: true,
		onSubmit: async (values) => {
			await onSubmit(values);
		},
	});

	/**
	 * Handle get brands
	 */
	const handleGetBrands = useCallback(async () => {
		try {
			setIsLoading(true);

			const queryParams: BrandQueryParams = {
				limit: 9999,
				offset: 0,
			};

			const response = await apiGetBrands(queryParams);

			if (response.code !== "OK") {
				return toast.error(
					t("api.get.failed", { data: t("brands_page.brand_list").toLowerCase() })
				);
			}

			const { data } = response;
			const options: SelectOption[] = data.map((brand) => ({
				label: brand.name,
				value: brand.id,
				noTranslate: true,
			}));

			setBrandOptions(options);
		} catch (error) {
			toast.error(t("api.get.failed", { data: t("brands_page.brand_list").toLowerCase() }));
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Update params when content changes
	useEffect(() => {
		if (formik.values.content) {
			const props = Array.from(formik.values.content.matchAll(/{{(.*?)}}/g)).map(
				(match) => `{{${match[1]}}}`
			);
			formik.setFieldValue("params", props);
		}
	}, [formik.values.content]);

	useEffect(() => {
		handleGetBrands();
	}, []);

	return (
		<Modal
			size="md"
			isOpen={isOpen}
			confirmLabel={t("form.save")}
			confirmClassName="bg-secondary-500"
			title={t(`templates_page.${template.id ? "edit_template_modal" : "add_template_modal"}.title`)}
			setIsOpen={setIsOpen}
			onConfirm={formik.handleSubmit}
			onCancel={formik.handleReset}
		>
			<form className="flex flex-col gap-4">
				{/* Area: Brand */}
				<SelectForm
					id="brand_id"
					name="brand_id"
					label="templates_page.brand"
					placeholder={t("select.placeholder", { data: t("templates_page.brand").toLowerCase() })}
					options={brandOptions}
					value={formik.values.brand_id}
					errorMessage={formik.errors.brand_id}
					onChange={formik.handleChange}
				/>

				{/* Area: Template Name */}
				<InputForm
					id="name"
					name="name"
					label="templates_page.name"
					placeholder={t("input.placeholder", { data: t("templates_page.name").toLowerCase() })}
					value={formik.values.name}
					errorMessage={formik.errors.name}
					onChange={formik.handleChange}
				/>

				{/* Area: Content */}
				<TextArea
					id="content"
					name="content"
					label="templates_page.content"
					placeholder={t("input.placeholder", { data: t("templates_page.content").toLowerCase() })}
					value={formik.values.content}
					errorMessage={formik.errors.content}
					onChange={formik.handleChange}
				/>
			</form>
		</Modal>
	);
};

export default AddTemplateModal;
