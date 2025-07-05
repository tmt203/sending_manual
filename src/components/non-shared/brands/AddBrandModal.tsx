"use client";

import { InputForm, Modal, SelectForm } from "@components/shared/molecules";
import { Brand, BrandBody } from "@type/api/brand.type";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { object, string } from "yup";

export interface AddBrandModalProps {
	isOpen: boolean;
	brand: Brand;
	setIsOpen: (value: boolean) => void;
	onSubmit: (body: BrandBody) => Promise<void>;
}

/**
 * Add Brand Modal
 * @props AddBrandModalProps
 */
const AddBrandModal = ({ isOpen, brand, setIsOpen, onSubmit }: AddBrandModalProps) => {
	// Hooks
	const t = useTranslations();

	// Memoized
	const initialValues = useMemo(() => {
		return {
			name: brand.name,
			description: brand.description,
			channel: brand.channel,
		};
	}, [brand]);

	const validationSchema = useMemo(() => {
		return object().shape({
			name: string()
				.min(2, t("error_message.min_length", { data: 2 }))
				.max(50, t("error_message.max_length", { data: 50 }))
				.required(t("error_message.required")),
			description: string().max(200, t("error_message.max_length", { data: 200 })),
			channel: string().oneOf(["sms", "zns", "email"], t("error_message.invalid_value")),
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

	return (
		<Modal
			size="md"
			isOpen={isOpen}
			confirmLabel={t("form.save")}
			confirmClassName="bg-secondary-500"
			title={t("brands_page.add_brand_modal.title")}
			setIsOpen={setIsOpen}
			onConfirm={formik.handleSubmit}
			onCancel={formik.handleReset}
		>
			<form className="flex flex-col gap-4">
				{/* Area: Brand Name */}
				<InputForm
					id="name"
					name="name"
					label="brands_page.name"
					placeholder={t("input.placeholder", { data: t("brands_page.name").toLowerCase() })}
					value={formik.values.name}
					errorMessage={formik.errors.name}
					onChange={formik.handleChange}
				/>

				{/* Area: Description */}
				<InputForm
					id="description"
					name="description"
					label="brands_page.description"
					placeholder={t("input.placeholder", { data: t("brands_page.description").toLowerCase() })}
					value={formik.values.description}
					errorMessage={formik.errors.description}
					onChange={formik.handleChange}
				/>

				{/* Area: Channel */}
				<SelectForm
					id="channel"
					name="channel"
					label="brands_page.channel"
					placeholder={t("select.placeholder", { data: t("brands_page.channel").toLowerCase() })}
					options={[
						{ label: "SMS", value: "sms", noTranslate: true },
						// { label: "ZNS", value: "zns", noTranslate: true },
						// { label: "Email", value: "email", noTranslate: true },
					]}
					value={formik.values.channel}
					errorMessage={formik.errors.channel}
					onChange={formik.handleChange}
				/>
			</form>
		</Modal>
	);
};

export default AddBrandModal;
